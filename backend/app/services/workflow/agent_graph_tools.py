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
    Heuristica inicial de anomalias (placeholder mejorable).
    """
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
    return json.dumps(
        {
            "zone_name": zone_name,
            "status": "ok" if rows else "sin_datos",
            "prediction_hint": "Anomalia sugerida cuando max_conexiones > 2x avg_conexiones.",
            "data": rows,
        },
        ensure_ascii=False,
        default=str,
    )


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
