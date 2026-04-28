import asyncio
import logging
from pathlib import Path
import re
import unicodedata

import pandas as pd

from app.core.database import Base, engine
from app.models import WifiPoint, WifiUsage, Client

logger = logging.getLogger(__name__)

_CSV_READ_KWARGS: dict = {
    "on_bad_lines": "warn",
    "sep": ";",
    "thousands": ",",
    "decimal": ",",
    "encoding": "latin1",
}

_WIFI_COLUMN_MAP = {
    "nombre zona": "nombre_zona",
    "direccion": "direccion",
    "barrio": "barrio",
    "comuna": "comuna",
    "codigo": "codigo",
    "correo electronico": "correo_electronico",
    "correo electr nico": "correo_electronico",
    "latitud": "latitud",
    "longitud": "longitud",
    "proveedor conectividad": "proveedor_conectividad",
    "velocidad": "velocidad",
    "horarios": "horarios",
}

_CONN_COLUMN_MAP = {
    "fecha conexion": "fecha_conexion",
    "fecha conexi n": "fecha_conexion",
    "area": "area",
    "nombre zona": "nombre_zona",
    "comuna": "comuna",
    "model": "model",
    "numero conexiones": "numero_conexiones",
    "n mero conexiones": "numero_conexiones",
    "usage kb": "usage_kb",
    "porcentaje uso": "porcentaje_uso",
}

_MONTHS_ES = {
    "ene": "jan",
    "feb": "feb",
    "mar": "mar",
    "abr": "apr",
    "may": "may",
    "jun": "jun",
    "jul": "jul",
    "ago": "aug",
    "sep": "sep",
    "oct": "oct",
    "nov": "nov",
    "dic": "dec",
}


def _normalize_key(value: str) -> str:
    raw = (value or "").strip().lower()
    raw = raw.replace("ï¿½", "e")
    raw = unicodedata.normalize("NFKD", raw).encode("ascii", "ignore").decode("ascii")
    raw = re.sub(r"[^a-z0-9]+", " ", raw).strip()
    return raw


def _rename_columns(df: pd.DataFrame, column_map: dict[str, str]) -> pd.DataFrame:
    rename: dict[str, str] = {}
    for col in df.columns:
        normalized = _normalize_key(str(col))
        if normalized in column_map:
            rename[col] = column_map[normalized]
    return df.rename(columns=rename)


def _coerce_months_es(series: pd.Series) -> pd.Series:
    if series.empty:
        return series
    s = series.astype("string").str.lower().str.strip()
    for es, en in _MONTHS_ES.items():
        s = s.str.replace(f"-{es}-", f"-{en}-", regex=False)
    return s


def clean_wifi_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = _rename_columns(df, _WIFI_COLUMN_MAP)
    keep_cols = [c for c in _WIFI_COLUMN_MAP.values() if c in df.columns]
    cleaned = df[keep_cols].copy()
    if "comuna" in cleaned.columns:
        cleaned["comuna"] = pd.to_numeric(cleaned["comuna"], errors="coerce").astype("Int64")
    if "latitud" in cleaned.columns:
        cleaned["latitud"] = pd.to_numeric(cleaned["latitud"], errors="coerce")
    if "longitud" in cleaned.columns:
        cleaned["longitud"] = pd.to_numeric(cleaned["longitud"], errors="coerce")
    return cleaned


def clean_connections_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = _rename_columns(df, _CONN_COLUMN_MAP)
    keep_cols = [c for c in _CONN_COLUMN_MAP.values() if c in df.columns]
    cleaned = df[keep_cols].copy()
    if "fecha_conexion" in cleaned.columns:
        normalized_dates = _coerce_months_es(cleaned["fecha_conexion"])
        cleaned["fecha_conexion"] = pd.to_datetime(
            normalized_dates, format="%d-%b-%y", errors="coerce"
        ).dt.date
    if "comuna" in cleaned.columns:
        cleaned["comuna"] = pd.to_numeric(cleaned["comuna"], errors="coerce").astype("Int64")
    if "numero_conexiones" in cleaned.columns:
        cleaned["numero_conexiones"] = (
            pd.to_numeric(cleaned["numero_conexiones"], errors="coerce").astype("Int64")
        )
    if "usage_kb" in cleaned.columns:
        cleaned["usage_kb"] = pd.to_numeric(cleaned["usage_kb"], errors="coerce")
    if "porcentaje_uso" in cleaned.columns:
        cleaned["porcentaje_uso"] = (
            cleaned["porcentaje_uso"]
            .astype("string")
            .str.replace("%", "", regex=False)
            .str.replace(".", "", regex=False)
            .str.replace(",", ".", regex=False)
        )
        cleaned["porcentaje_uso"] = pd.to_numeric(cleaned["porcentaje_uso"], errors="coerce")
    return cleaned


def _clean_by_table_name(df: pd.DataFrame, table_name: str) -> pd.DataFrame:
    normalized = table_name.strip().lower()
    if normalized == WifiPoint.__tablename__:
        return clean_wifi_dataframe(df)
    if normalized == WifiUsage.__tablename__:
        return clean_connections_dataframe(df)
    return df


def read_csv_dataframe(csv_path: str | Path) -> pd.DataFrame:
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"No existe el archivo CSV: {csv_path}")
    return pd.read_csv(path, **_CSV_READ_KWARGS)


def _read_csv_preview(csv_path: str, rows: int) -> list[dict]:
    return read_csv_dataframe(csv_path).head(rows).to_dict(orient="records")


async def load_wifi_data(csv_path: str, rows: int = 10) -> list[dict]:
    return await asyncio.to_thread(_read_csv_preview, csv_path, rows)


async def load_connections_data(csv_path: str, rows: int = 10) -> list[dict]:
    return await asyncio.to_thread(_read_csv_preview, csv_path, rows)


def _dataframe_to_sql_sync(
    df: pd.DataFrame,
    table_name: str,
    *,
    if_exists: str = "replace",
    index: bool = False,
    chunksize: int | None = 10_000,
) -> None:
    df.to_sql(
        table_name,
        engine,
        if_exists=if_exists,
        index=index,
        chunksize=chunksize,
    )


async def etl_csv_to_table(
    csv_path: str | Path,
    table_name: str,
    *,
    if_exists: str = "replace",
    index: bool = False,
    chunksize: int | None = 10_000,
) -> int:
    """
    Lee un CSV con las mismas reglas que el preview y escribe el DataFrame en PostgreSQL.
    Devuelve el número de filas cargadas.
    """

    def _run() -> int:
        Base.metadata.create_all(bind=engine, tables=[WifiPoint.__table__, WifiUsage.__table__])
        df = read_csv_dataframe(csv_path)
        df = _clean_by_table_name(df, table_name)
        _dataframe_to_sql_sync(
            df,
            table_name,
            if_exists=if_exists,
            index=index,
            chunksize=chunksize,
        )
        logger.info("ETL completado: %s -> %s (%s filas)", csv_path, table_name, len(df))
        return len(df)

    return await asyncio.to_thread(_run)
