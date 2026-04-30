import json
from typing import Any, Callable, Literal

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langgraph.graph import MessagesState

from app.services.workflow.agent_graph_tools import DB_SCHEMA_PROMPT


class AgentState(MessagesState, total=False):
    next_agent: Literal["conversacional", "operativo", "estrategico", "final"]
    active_agent: Literal["conversacional", "operativo", "estrategico"]


def _last_user_text(messages: list[Any]) -> str:
    for msg in reversed(messages):
        if isinstance(msg, HumanMessage):
            return str(msg.content)
    return ""


def _safe_json(raw: str, default: dict[str, Any]) -> dict[str, Any]:
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass
    return default


def _last_tool_output(messages: list[Any]) -> str | None:
    for msg in reversed(messages):
        if isinstance(msg, ToolMessage):
            return str(msg.content)
    return None


def _extract_zone_candidate(user_text: str) -> str:
    # Ignore memory context for extraction
    clean_text = user_text.split("Memoria corta de la conversacion")[0]
    lowered = clean_text.lower()
    
    if "general" in lowered:
        return ""
        
    for marker in ("zona ", "comuna "):
        idx = lowered.find(marker)
        if idx >= 0:
            tail = clean_text[idx + len(marker) :].strip()
            candidate = tail.split()[0].strip(",.;:!?()[]{}\"'")
            if candidate:
                return candidate
                
    # Fallback: if no specific zone, return empty for global analysis
    return ""



def build_nodes(
    generate_text: Callable[[str], Any],
) -> dict[str, Callable[[AgentState], Any]]:
    supervisor_prompt = """
                            Eres el Supervisor/Router de un sistema multi-agente.
                            Decide a qué agente enrutar:
                            - conversacional: principal consultor SQL de la base.
                            - operativo: deteccion de anomalias, alertas automaticas, ordenes de trabajo.
                            - estrategico: cruces geoespaciales y decisiones de alto nivel.
                            - final: solo para saludos o preguntas que NO requieren datos técnicos o estadísticos.
                            
                            REGLA: Si la pregunta menciona zonas, porcentajes, estados de APs o cualquier métrica, NUNCA uses 'final'. Delega a un agente.

                            Devuelve SOLO JSON:
                            {"next_agent":"conversacional|operativo|estrategico|final","reason":"..."}
                        """

    async def supervisor_node(state: AgentState) -> dict[str, Any]:
        user_text = _last_user_text(state["messages"])
        raw = await generate_text(f"{supervisor_prompt}\n\nConsulta:\n{user_text}")
        parsed = _safe_json(raw, {"next_agent": "conversacional"})
        next_agent = parsed.get("next_agent", "conversacional")
        if next_agent not in {"conversacional", "operativo", "estrategico", "final"}:
            next_agent = "conversacional"
        return {"next_agent": next_agent}

    async def conversacional_node(state: AgentState) -> dict[str, Any]:
        user_text = _last_user_text(state["messages"])
        tool_output = _last_tool_output(state["messages"])
        if tool_output:
            answer = await generate_text(
                "Eres el Agente Conversacional. Usa este resultado de tool para responder al usuario "
                "en lenguaje claro, sin pedir mas tools.\n\n"
                f"Consulta original:\n{user_text}\n\n"
                f"Resultado de tool:\n{tool_output}"
            )
            return {"next_agent": "final", "messages": [AIMessage(content=answer)]}

        prompt = f"""
                    Eres el Agente Conversacional. Eres el principal consultor SQL.
                    REGLA MANDATORIA: Está PROHIBIDO responder con datos (porcentajes, nombres de zonas, estadísticas) basados en tu conocimiento interno. 
                    Si la consulta requiere cualquier dato del inventario, clientes, eventos o métricas, DEBES usar 'query_wifi_database'.
                    Usa 'access_point_curated' para inventario, 'ap_hourly_metrics_curated' para tendencias, 'clients' para dispositivos, 'network_events_curated' para diagnósticos y 'wifi_points' para ubicación geográfica.
                    {DB_SCHEMA_PROMPT}

                    Si no usas una tool para obtener datos reales, estarás fallando en tu misión.
                    
                    Devuelve SOLO JSON:
                    1) Tool (si necesitas datos):
                    {{"action":"tool","tool":"query_wifi_database","input":"SELECT ..."}}
                    2) Final (solo si ya tienes el resultado de la tool o es una duda no relacionada con datos):
                    {{"action":"final","answer":"..."}}

                    Consulta:
                    {user_text}
                """
        raw = await generate_text(prompt)
        parsed = _safe_json(raw, {"action": "final", "answer": raw})
        if parsed.get("action") == "tool":
            return {
                "active_agent": "conversacional",   
                "messages": [
                    AIMessage(
                        content="Consultando base de datos para responder.",
                        tool_calls=[
                            {
                                "id": "call_conversacional_sql",
                                "name": "query_wifi_database",
                                "args": {"sql": parsed.get("input", "SELECT 1")},
                            }
                        ],
                    )
                ],
            }
        return {"next_agent": "final", "messages": [AIMessage(content=parsed.get("answer", ""))]}

    async def operativo_node(state: AgentState) -> dict[str, Any]:
        user_text = _last_user_text(state["messages"])
        last_msg = state["messages"][-1]
        
        # Si venimos de una tool, evaluamos qué paso sigue
        if isinstance(last_msg, ToolMessage):
            tool_name = last_msg.name
            tool_output = last_msg.content
            
            # En modo simplificado, directo a respuesta final
            final_answer = await generate_text(
                f"Genera el informe operativo final. \n"
                "Reglas de estructura:\n"
                "1) Diagnostico tecnico corto.\n"
                "2) Resumen de la prediccion de anomalias.\n"
                "3) Bloque JSON de prediccion en ```json { ... } ``` (usar el output del tool).\n"
                "4) Bloque JSON de anomalias detectadas en ```json [ { ... } ] ``` (lista de objetos con id, name, status, lat, lng).\n\n"
                f"Consulta original: {user_text}\n"
                f"Resultado de la tool {tool_name}: {tool_output}"
            )
            return {"next_agent": "final", "messages": [AIMessage(content=final_answer)]}

        # Inicio del flujo
        zone_candidate = _extract_zone_candidate(user_text)
        return {
            "active_agent": "operativo",
            "messages": [
                AIMessage(
                    content="Iniciando diagnóstico operativo y detección de anomalías.",
                    tool_calls=[{
                        "id": "call_op_predict_anomaly",
                        "name": "predict_anomaly",
                        "args": {"zone_name": zone_candidate},
                    }],
                )
            ],
        }


    async def estrategico_node(state: AgentState) -> dict[str, Any]:
        user_text = _last_user_text(state["messages"])
        tool_output = _last_tool_output(state["messages"])
        if tool_output:
            answer = await generate_text(
                "Eres el Agente Estrategico. Con base en el resultado de tool, entrega analisis "
                "geoespacial/tendencial y recomendacion. No solicites mas tools.\n\n"
                f"Consulta original:\n{user_text}\n\n"
                f"Resultado de tool:\n{tool_output}"
            )
            return {"next_agent": "final", "messages": [AIMessage(content=answer)]}

        prompt = f"""
                    Eres el Agente Estrategico.
                    Objetivo: cruces geoespaciales, recomendaciones de inversion y analisis de tendencias.
                    REGLA MANDATORIA: No inventes datos. Usa las tablas curadas 'ap_hourly_metrics_curated' y 'wifi_points' (usando "LATITUD"/"LONGITUD") para generar insights reales.
                    Herramientas:
                    - geospatial_cross_analysis(question)
                    - query_wifi_database(sql)
                    - predict_anomaly(zone_name)
                    {DB_SCHEMA_PROMPT}

                    Si la consulta requiere datos actuales o históricos, DEBES usar una tool.
                    
                    Devuelve SOLO JSON:
                    1) Tool:
                    {{"action":"tool","tool":"geospatial_cross_analysis|query_wifi_database|predict_anomaly","input":"..."}}
                    2) Final:
                    {{"action":"final","answer":"..."}}

                    Consulta:
                    {user_text}
                """
        raw = await generate_text(prompt)
        parsed = _safe_json(raw, {"action": "final", "answer": raw})
        if parsed.get("action") == "tool":
            tool_name = parsed.get("tool", "geospatial_cross_analysis")
            if tool_name not in {"geospatial_cross_analysis", "query_wifi_database", "predict_anomaly"}:
                tool_name = "geospatial_cross_analysis"
            arg_name = (
                "question"
                if tool_name == "geospatial_cross_analysis"
                else "sql"
                if tool_name == "query_wifi_database"
                else "zone_name"
            )
            return {
                "active_agent": "estrategico",
                "messages": [
                    AIMessage(
                        content=f"Ejecutando {tool_name} para analisis estrategico.",
                        tool_calls=[
                            {
                                "id": "call_estrategico_tool",
                                "name": tool_name,
                                "args": {arg_name: parsed.get("input", "")},
                            }
                        ],
                    )
                ],
            }
        return {"next_agent": "final", "messages": [AIMessage(content=parsed.get("answer", ""))]}

    async def finalize_node(state: AgentState) -> dict[str, Any]:
        user_text = _last_user_text(state["messages"])
        latest = [str(m.content) for m in state["messages"][-8:]]
        prompt = (
            "Genera la respuesta final al usuario de forma clara y accionable.\n"
            f"Consulta: {user_text}\n"
            f"Contexto interno reciente: {latest}"
        )
        answer = await generate_text(prompt)
        return {"next_agent": "final", "messages": [AIMessage(content=answer)]}

    return {
        "supervisor": supervisor_node,
        "conversacional": conversacional_node,
        "operativo": operativo_node,
        "estrategico": estrategico_node,
        "finalize": finalize_node,
    }


def route_from_supervisor(state: AgentState) -> str:
    return state.get("next_agent", "conversacional")


def route_after_agent(state: AgentState) -> str:
    last = state["messages"][-1]
    if isinstance(last, AIMessage) and getattr(last, "tool_calls", None):
        return "tools"
    if state.get("next_agent") == "final":
        return "end"
    return "finalize"


def route_after_tools(state: AgentState) -> str:
    return state.get("active_agent", "conversacional")
