import json

from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode

from app.services.db_tools import run_readonly_query, create_ticket, update_ticket_technician

from app.services.ml_core.wifi_usage_nn import run_anomaly_detection_for_zone


DB_SCHEMA_PROMPT = """
Esquema SQL real disponible (IMPORTANTE: USAR COMILLAS DOBLES PARA COLUMNAS CON ESPACIOS):

Tabla wifi_points:
- id
- "NOMBRE ZONA"
- "DIRECCION"
- "BARRIO"
- "COMUNA"
- "CODIGO"
- "CORREO ELECTRÓNICO"
- "LATITUD"
- "LONGITUD"
- "PROVEEDOR CONECTIVIDAD"
- "VELOCIDAD"
- "HORARIOS"

Tabla wifi_usage:
- id
- "FECHA CONEXION"
- "AREA"
- "NOMBRE ZONA"
- "COMUNA"
- "MODEL"
- "NUMERO CONEXIONES"
- "USAGE (kB)"
- "PORCENTAJE USO"

Tabla tecnicos:
- id
- nombre
- especialidad

Tabla tickets:
- id
- tipo_anomalia
- descripcion
- estado
- id_tecnico
- created_at
- resuelto_en
- wifi_point_id

Reglas duras:
- USAR SIEMPRE COMILLAS DOBLES para nombres de columnas con espacios o caracteres especiales (ej: "NOMBRE ZONA").
- NO usar columnas inexistentes (prohibido: id_zona, kb_consumidos, ciudad, nombre_zona).
- Para relacionar tablas usa JOIN por "NOMBRE ZONA" o "COMUNA".
"""


@tool
def query_wifi_database(sql: str) -> str:
    """Ejecuta SQL read-only contra wifi_points/wifi_usage/tecnicos/tickets."""
    rows = run_readonly_query(sql, limit=300)
    return json.dumps(rows, ensure_ascii=False, default=str)


@tool
def predict_anomaly(zone_name: str) -> str:
    """
    Detecta anomalías comparando USAGE (kB) real vs predicho.
    """
    report = run_anomaly_detection_for_zone(zone_name)
    return json.dumps(report, ensure_ascii=False, default=str)


@tool
def create_unassigned_tickets(anomalies: list[dict]) -> str:
    """
    Crea tickets 'open' (sin técnico) para las anomalías detectadas.
    Espera una lista de objetos con: tipo_anomalia, descripcion, wifi_point_id (opcional).
    """
    created_ids = []
    for anomaly in anomalies:
        tkt_id = create_ticket(
            tipo_anomalia=anomaly.get("tipo_anomalia", "Anomalía Genérica"),
            descripcion=anomaly.get("descripcion", "Detectado por el Agente Operacional"),
            wifi_point_id=anomaly.get("wifi_point_id")
        )
        created_ids.append(tkt_id)
    
    return json.dumps({"status": "success", "created_ticket_ids": created_ids}, ensure_ascii=False)


@tool
def create_work_orders(assignments: list[dict]) -> str:
    """
    Asigna técnicos a tickets específicos. 
    Espera una lista de objetos con: ticket_id, tecnico_id.
    """
    results = []
    for assignment in assignments:
        success = update_ticket_technician(
            ticket_id=assignment.get("ticket_id"),
            tecnico_id=assignment.get("tecnico_id")
        )
        results.append({"ticket_id": assignment.get("ticket_id"), "success": success})
    
    return json.dumps({"status": "completed", "results": results}, ensure_ascii=False)


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



TOOLS = [
    query_wifi_database, 
    predict_anomaly, 
    create_unassigned_tickets, 
    create_work_orders, 
    geospatial_cross_analysis
]
tools_node = ToolNode(TOOLS)
