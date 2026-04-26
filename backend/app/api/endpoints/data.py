import os

from fastapi import APIRouter, HTTPException
from app.schemas.data_schema import IngestRequest
from app.services.csv_service import load_wifi_data, load_connections_data, etl_csv_to_table

router = APIRouter()


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

