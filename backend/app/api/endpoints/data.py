import os

from fastapi import APIRouter, HTTPException
from app.schemas.data_schema import IngestRequest
from app.services.csv_service import load_wifi_data, load_connections_data, etl_csv_to_table

import logging
router = APIRouter()
logger = logging.getLogger("app.data")


@router.get("/preview")
async def preview_data() -> dict:
    wifi_path = os.getenv("ZONAS_WIFI_CSV_PATH", "data/zonas-wi-fi-de-cali-2025.csv")
    conn_path = os.getenv("CONEXIONES_CSV_PATH", "data/conexiones_diciembre.csv")

    try:
        wifi_preview = await load_wifi_data(wifi_path, rows=5)
        conn_preview = await load_connections_data(conn_path, rows=5)        
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error leyendo CSVs: {exc}") from exc

    return {"zonas_wifi": wifi_preview, "conexiones": conn_preview}


@router.post("/ingest")
async def ingest_data(payload: IngestRequest) -> dict:
    if not payload.ingest_wifi and not payload.ingest_connections:
        raise HTTPException(status_code=400, detail="Debes activar al menos una fuente para ingestar.")

    wifi_path = os.getenv("ZONAS_WIFI_CSV_PATH", "data/zonas-wi-fi-de-cali-2025.csv")
    conn_path = os.getenv("CONEXIONES_CSV_PATH", "data/conexiones_diciembre.csv")

    result: dict[str, int | str | dict] = {
        "status": "ok",
        "if_exists": payload.if_exists,
        "tables": {},
    }

    try:
        if payload.ingest_wifi:
            wifi_rows = await etl_csv_to_table(
                csv_path=wifi_path,
                table_name=payload.wifi_table,
                if_exists=payload.if_exists,
                chunksize=payload.chunksize,
            )
            result["tables"]["zonas_wifi"] = {"table": payload.wifi_table, "rows": wifi_rows}

        if payload.ingest_connections:
            conn_rows = await etl_csv_to_table(
                csv_path=conn_path,
                table_name=payload.connections_table,
                if_exists=payload.if_exists,
                chunksize=payload.chunksize,
            )
            result["tables"]["conexiones"] = {"table": payload.connections_table, "rows": conn_rows}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error ejecutando ETL: {exc}") from exc

    return result

from sqlalchemy import text
from app.core.database import engine

@router.get("/wifi-points")
async def get_wifi_points():
    logger.info("Solicitud recibida para obtener todos los wifi_points")
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT 
                    id, 
                    "NOMBRE ZONA" as name, 
                    "LATITUD" as lat, 
                    "LONGITUD" as lng,
                    "COMUNA" as comuna
                FROM wifi_points
            """)
            result = conn.execute(query)
            rows = list(result)
            if rows:
                logger.info(f"Primer fila raw: {rows[0]._mapping.keys()} -> {rows[0]._mapping}")
            
            points = []
            for row in rows:
                try:
                    data = row._mapping
                    lat_raw = data.get("lat")
                    lng_raw = data.get("lng")
                    
                    lat = float(lat_raw) if lat_raw is not None else None
                    lng = float(lng_raw) if lng_raw is not None else None
                    
                    # Heuristic normalization for Cali coordinates
                    if lat:
                        while abs(lat) > 10: lat /= 10
                    if lng:
                        while abs(lng) > 100: lng /= 10
                    
                    points.append({
                        "id": int(data.get("id")),
                        "name": str(data.get("name")),
                        "lat": lat,
                        "lng": lng,
                        "commune": data.get("comuna"),
                        "status": "online" # Default to green
                    })
                except Exception as e:
                    logger.warning(f"Error procesando punto: {e}")
                    continue
            
            logger.info(f"Retornando {len(points)} wifi_points")
            if points:
                logger.debug(f"Ejemplo punto: {points[0]}")
            return points
    except Exception as exc:
        logger.error(f"Error critico en get_wifi_points: {exc}")
        raise HTTPException(status_code=500, detail=f"Error obteniendo wifi_points: {exc}") from exc
