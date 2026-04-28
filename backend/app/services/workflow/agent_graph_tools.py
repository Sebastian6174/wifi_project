import json

from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode

from app.services.db_tools import run_readonly_query

DB_SCHEMA_PROMPT = """
Esquema SQL real disponible (NO inventar columnas):

Tabla zonas_wifi:
- id
- nombre_zona
- direccion
- barrio
- comuna
- codigo
- correo_electronico
- latitud
- longitud
- proveedor_conectividad
- velocidad
- horarios

Tabla conexiones_wifi:
- id
- fecha_conexion
- area
- nombre_zona
- comuna
- model
- numero_conexiones
- usage_kb
- porcentaje_uso

Reglas duras:
- NO usar columnas inexistentes (prohibido: id_zona, kb_consumidos, ciudad).
- Para relacionar tablas usa JOIN por nombre_zona o comuna segun el caso.
"""


@tool
def query_wifi_database(sql: str) -> str:
    """Ejecuta SQL read-only contra zonas_wifi/conexiones_wifi."""
    rows = run_readonly_query(sql, limit=300)
    return json.dumps(rows, ensure_ascii=False, default=str)


@tool
def predict_anomaly(zone_name: str) -> str:
    """
    Detecta anomalías comparando usage_kb real vs predicho por un MLP entrenado con
    comuna y numero_conexiones (80/20 train/test). Si no hay datos o el modelo no
    puede entrenarse, usa heurística por agregados de zona.
    """
    from ml_core.wifi_usage_nn import run_anomaly_detection_for_zone

    report = run_anomaly_detection_for_zone(zone_name)
    return json.dumps(report, ensure_ascii=False, default=str)


@tool
def create_work_orders(signal: str) -> str:
    """
    Stub para ordenes de trabajo priorizadas.
    """
    return json.dumps(
        {
            "status": "stub",
            "message": "Tool de ordenes de trabajo aun en definicion.",
            "input": signal,
        },
        ensure_ascii=False,
    )


@tool
def geospatial_cross_analysis(question: str) -> str:
    """
    Stub para cruce geoespacial.
    """
    return json.dumps(
        {
            "status": "stub",
            "message": "Tool geoespacial aun en definicion.",
            "input": question,
        },
        ensure_ascii=False,
    )


TOOLS = [query_wifi_database, predict_anomaly, create_work_orders, geospatial_cross_analysis]
tools_node = ToolNode(TOOLS)
