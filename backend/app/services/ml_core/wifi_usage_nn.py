"""
Red neuronal (MLPRegressor) que estima usage_kb a partir de comuna y numero_conexiones.

Entrena con 80% train / 20% test, persiste el pipeline en disco y expone detección de
anomalías por zona para la tool predict_anomaly.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sqlalchemy import text

from app.core.database import engine
from app.services.db_tools import run_readonly_query

logger = logging.getLogger(__name__)

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
BUNDLE_PATH = ARTIFACT_DIR / "wifi_usage_mlp.joblib"

MIN_ROWS_FOR_TRAINING = 40
ANOMALY_SIGMA = 2.0


def _one_hot_encoder() -> OneHotEncoder:
    try:
        return OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    except TypeError:
        return OneHotEncoder(handle_unknown="ignore", sparse=False)


def _build_pipeline() -> Pipeline:
    prep = ColumnTransformer(
        transformers=[
            ("comuna", _one_hot_encoder(), ["comuna"]),
            ("num", StandardScaler(), ["numero_conexiones"]),
        ]
    )
    mlp = MLPRegressor(
        hidden_layer_sizes=(64, 32),
        activation="relu",
        solver="adam",
        max_iter=800,
        early_stopping=True,
        validation_fraction=0.1,
        random_state=42,
        n_iter_no_change=25,
    )
    return Pipeline([("prep", prep), ("mlp", mlp)])


def _load_training_frame() -> pd.DataFrame:
    sql = text(
        """
        SELECT comuna, numero_conexiones, usage_kb
        FROM conexiones_wifi
        WHERE comuna IS NOT NULL
          AND TRIM(comuna) <> ''
          AND numero_conexiones IS NOT NULL
          AND usage_kb IS NOT NULL
        """
    )
    with engine.connect() as conn:
        df = pd.read_sql(sql, conn)
    df = df.dropna()
    df["comuna"] = df["comuna"].astype(str).str.strip()
    df["numero_conexiones"] = pd.to_numeric(df["numero_conexiones"], errors="coerce")
    df["usage_kb"] = pd.to_numeric(df["usage_kb"], errors="coerce")
    return df.dropna()


def train_and_persist() -> dict[str, Any]:
    df = _load_training_frame()
    if len(df) < MIN_ROWS_FOR_TRAINING:
        raise RuntimeError(
            f"Se necesitan al menos {MIN_ROWS_FOR_TRAINING} filas válidas; hay {len(df)}."
        )

    X = df[["comuna", "numero_conexiones"]]
    y = df["usage_kb"].astype(float)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipe = _build_pipeline()
    pipe.fit(X_train, y_train)

    y_pred_test = pipe.predict(X_test)
    residuals = y_test.values - y_pred_test
    residual_std = float(np.std(residuals)) if len(residuals) else 0.0
    if residual_std <= 0:
        residual_std = float(np.mean(np.abs(residuals))) or 1.0

    bundle: dict[str, Any] = {
        "pipeline": pipe,
        "residual_std": residual_std,
        "r2_test": float(r2_score(y_test, y_pred_test)),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
    }

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, BUNDLE_PATH)
    logger.info(
        "Modelo usage_kb guardado en %s (n_train=%s, n_test=%s, r2_test=%.4f)",
        BUNDLE_PATH,
        bundle["n_train"],
        bundle["n_test"],
        bundle["r2_test"],
    )
    return bundle


def load_bundle() -> dict[str, Any]:
    if not BUNDLE_PATH.is_file():
        raise FileNotFoundError(f"No existe artefacto: {BUNDLE_PATH}")
    return joblib.load(BUNDLE_PATH)


def get_or_train_bundle() -> dict[str, Any]:
    try:
        return load_bundle()
    except FileNotFoundError:
        return train_and_persist()


def _heuristic_zone_report(zone_name: str) -> dict[str, Any]:
    safe_zone = zone_name.strip().replace("'", "''")
    query = f"""
    SELECT
      nombre_zona,
      AVG(numero_conexiones) AS avg_conexiones,
      MAX(numero_conexiones) AS max_conexiones,
      MIN(numero_conexiones) AS min_conexiones
    FROM conexiones_wifi
    WHERE nombre_zona ILIKE '%{safe_zone}%'
    GROUP BY nombre_zona
    ORDER BY avg_conexiones DESC
    LIMIT 5
    """
    rows = run_readonly_query(query, limit=10)
    return {
        "zone_name": zone_name,
        "status": "ok" if rows else "sin_datos",
        "model": {"source": "heuristic_only"},
        "prediction_hint": "Anomalia sugerida cuando max_conexiones > 2x avg_conexiones.",
        "data": rows,
    }


def run_anomaly_detection_for_zone(zone_name: str) -> dict[str, Any]:
    """
    Para filas de conexiones_wifi de la zona: predice usage_kb y marca anomalías si el
    residual supera ANOMALY_SIGMA * residual_std del conjunto de prueba.
    """
    safe_zone = zone_name.strip().replace("'", "''")
    detail_query = f"""
    SELECT nombre_zona, comuna, numero_conexiones, usage_kb
    FROM conexiones_wifi
    WHERE nombre_zona ILIKE '%{safe_zone}%'
      AND comuna IS NOT NULL
      AND TRIM(comuna) <> ''
      AND numero_conexiones IS NOT NULL
      AND usage_kb IS NOT NULL
    LIMIT 300
    """
    rows = run_readonly_query(detail_query, limit=300)
    if not rows:
        return _heuristic_zone_report(zone_name)

    try:
        bundle = get_or_train_bundle()
    except Exception as exc:
        logger.warning("No se pudo entrenar/cargar MLP: %s", exc)
        base = _heuristic_zone_report(zone_name)
        base["model"] = {"source": "heuristic_fallback", "error": str(exc)}
        return base

    pipe = bundle["pipeline"]
    residual_std = max(float(bundle.get("residual_std") or 1.0), 1e-6)

    enriched: list[dict[str, Any]] = []
    anomaly_count = 0
    for row in rows:
        comuna = str(row.get("comuna") or "").strip()
        nconn = float(row["numero_conexiones"])
        actual = float(row["usage_kb"])
        X = pd.DataFrame([{"comuna": comuna, "numero_conexiones": nconn}])
        predicted = float(pipe.predict(X)[0])
        residual = actual - predicted
        is_anomaly = abs(residual) > ANOMALY_SIGMA * residual_std
        if is_anomaly:
            anomaly_count += 1
        enriched.append(
            {
                **{k: row[k] for k in row},
                "predicted_usage_kb": round(predicted, 4),
                "residual_kb": round(residual, 4),
                "is_anomaly": is_anomaly,
            }
        )

    return {
        "zone_name": zone_name,
        "status": "ok",
        "model": {
            "source": "mlp_regressor",
            "r2_test": bundle.get("r2_test"),
            "n_train": bundle.get("n_train"),
            "n_test": bundle.get("n_test"),
            "residual_std_test": bundle.get("residual_std"),
            "anomaly_threshold_kb": round(ANOMALY_SIGMA * residual_std, 4),
        },
        "rows_analyzed": len(enriched),
        "anomaly_count": anomaly_count,
        "prediction_hint": (
            f"Anomalia si |usage_kb - predicho| > {ANOMALY_SIGMA:.1f} * "
            f"desv. residual en test (~{ANOMALY_SIGMA * residual_std:.1f} KB)."
        ),
        "data": enriched,
    }
