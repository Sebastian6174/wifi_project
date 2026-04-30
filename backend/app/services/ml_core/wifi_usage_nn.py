"""
Detección de anomalías operacionales mediante MLPRegressor.
Predice 'total_disconnections' basado en 'total_connections' y 'unique_clients'.
Si el error de predicción es muy alto, se marca como anomalía técnica.
"""

from __future__ import annotations

import logging
import re
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
from sklearn.preprocessing import StandardScaler
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import engine

logger = logging.getLogger(__name__)

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
BUNDLE_PATH = ARTIFACT_DIR / "wifi_operational_mlp.joblib"

MIN_ROWS_FOR_TRAINING = 50
ANOMALY_SIGMA = 2.5  # Umbral más estricto para evitar falsos positivos

def _quote_ident(identifier: str) -> str:
    return '"' + identifier.replace('"', '""') + '"'

def _table_exists(table_name: str) -> bool:
    sql = text(
        """
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = :table_name
        LIMIT 1
        """
    )
    with engine.connect() as conn:
        return conn.execute(sql, {"table_name": table_name}).scalar() is not None

def _resolve_operational_schema() -> dict[str, str]:
    """
    Busca la mejor tabla para métricas operacionales.
    Prioridad: ap_hourly_metrics_curated -> wifi_usage (legacy).
    """
    if _table_exists("ap_hourly_metrics_curated"):
        return {
            "table": "ap_hourly_metrics_curated",
            "zone_col": "ap_name",
            "conn_col": "total_connections",
            "clients_col": "unique_clients",
            "target_col": "total_disconnections",
            "time_col": "timestamp_hour"
        }
    elif _table_exists("wifi_usage"):
        return {
            "table": "wifi_usage",
            "zone_col": "NOMBRE ZONA",
            "conn_col": "NUMERO CONEXIONES",
            "clients_col": "NUMERO CONEXIONES", # Fallback
            "target_col": "USAGE (kB)", # En legacy usamos usage como target
            "time_col": "FECHA CONEXION"
        }
    
    raise RuntimeError("No se encontró una tabla de métricas compatible (ap_hourly_metrics_curated o wifi_usage).")

def _build_pipeline() -> Pipeline:
    prep = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), ["total_connections", "unique_clients", "hour"]),
        ]
    )
    mlp = MLPRegressor(
        hidden_layer_sizes=(32, 16),
        activation="relu",
        solver="adam",
        max_iter=1000,
        random_state=42,
    )
    return Pipeline([("prep", prep), ("mlp", mlp)])

def _load_training_frame() -> pd.DataFrame:
    schema = _resolve_operational_schema()
    table = _quote_ident(schema["table"])
    conn_col = _quote_ident(schema["conn_col"])
    clients_col = _quote_ident(schema["clients_col"])
    target_col = _quote_ident(schema["target_col"])
    time_col = _quote_ident(schema["time_col"])

    sql = text(f"SELECT {time_col}, {conn_col}, {clients_col}, {target_col} FROM {table}")
    
    with engine.connect() as conn:
        df = pd.read_sql(sql, conn)
    
    df = df.dropna()
    df["timestamp"] = pd.to_datetime(df[schema["time_col"]], errors="coerce")
    df["hour"] = df["timestamp"].dt.hour
    df["total_connections"] = pd.to_numeric(df[schema["conn_col"]], errors="coerce")
    df["unique_clients"] = pd.to_numeric(df[schema["clients_col"]], errors="coerce")
    df["target"] = pd.to_numeric(df[schema["target_col"]], errors="coerce")
    
    return df.dropna()[["total_connections", "unique_clients", "hour", "target"]]

def train_and_persist() -> dict[str, Any]:
    df = _load_training_frame()
    if len(df) < MIN_ROWS_FOR_TRAINING:
        raise RuntimeError(f"Insuficientes datos para entrenar ({len(df)} < {MIN_ROWS_FOR_TRAINING})")

    X = df[["total_connections", "unique_clients", "hour"]]
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipe = _build_pipeline()
    pipe.fit(X_train, y_train)

    y_pred = pipe.predict(X_test)
    residual_std = float(np.std(y_test - y_pred))

    bundle = {
        "pipeline": pipe,
        "residual_std": residual_std,
        "r2": float(r2_score(y_test, y_pred)),
        "schema": _resolve_operational_schema()
    }

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, BUNDLE_PATH)
    logger.info("Modelo operacional guardado. R2: %.4f, Std: %.4f", bundle["r2"], residual_std)
    return bundle

def get_bundle() -> dict[str, Any]:
    try:
        return joblib.load(BUNDLE_PATH)
    except:
        return train_and_persist()

def run_anomaly_detection_for_zone(zone_name: str) -> dict[str, Any]:
    """
    Detecta anomalías en una zona específica usando el modelo de desconexiones/uso.
    """
    try:
        schema = _resolve_operational_schema()
        bundle = get_bundle()
    except Exception as exc:
        return {"status": "error", "message": str(exc)}

    table = _quote_ident(schema["table"])
    zone_col = _quote_ident(schema["zone_col"])
    conn_col = _quote_ident(schema["conn_col"])
    clients_col = _quote_ident(schema["clients_col"])
    target_col = _quote_ident(schema["target_col"])
    time_col = _quote_ident(schema["time_col"])

    # Buscamos también coordenadas en wifi_points
    sql = text(f"""
        SELECT 
            u.*, 
            p.id as wifi_point_id,
            p."LATITUD" as lat, 
            p."LONGITUD" as lng
        FROM {table} u
        LEFT JOIN wifi_points p ON u.{zone_col} = p."NOMBRE ZONA"
        WHERE CAST(u.{zone_col} AS TEXT) ILIKE :zone
        ORDER BY {time_col} DESC
        LIMIT 100
    """)

    try:
        with engine.connect() as conn:
            rows = conn.execute(sql, {"zone": f"%{zone_name}%"}).fetchall()
        data = [dict(r._mapping) for r in rows]
    except SQLAlchemyError as exc:
        return {"status": "error", "message": f"Error en query: {exc}"}

    if not data:
        return {"status": "no_data", "zone": zone_name}

    pipe = bundle["pipeline"]
    std = bundle["residual_std"]
    target_name = schema["target_col"]

    enriched = []
    anomalies = 0
    for row in data:
        ts = pd.to_datetime(row[schema["time_col"]])
        X = pd.DataFrame([{
            "total_connections": float(row[schema["conn_col"]] or 0),
            "unique_clients": float(row[schema["clients_col"]] or 0),
            "hour": ts.hour
        }])
        pred = float(pipe.predict(X)[0])
        actual = float(row[schema["target_col"]] or 0)
        residual = actual - pred
        
        is_anomaly = abs(residual) > ANOMALY_SIGMA * std
        if is_anomaly:
            anomalies += 1

        enriched.append({
            "ap_name": row.get(schema["zone_col"]),
            "timestamp": str(ts),
            "actual_value": actual,
            "predicted_value": round(pred, 2),
            "is_anomaly": is_anomaly,
            "type": "tecnica" if target_name == "total_disconnections" else "uso",
            "lat": row.get("lat"),
            "lng": row.get("lng"),
            "wifi_point_id": row.get("wifi_point_id")
        })

    return {
        "status": "ok",
        "zone": zone_name,
        "target_metric": target_name,
        "anomaly_count": anomalies,
        "data": enriched[:20] # Top 20 recientes
    }