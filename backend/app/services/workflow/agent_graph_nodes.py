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
                            - final: si se puede responder sin delegar.

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
                    Siempre prioriza query_wifi_database(sql) cuando necesites datos.
                    {DB_SCHEMA_PROMPT}

                    Devuelve SOLO JSON:
                    1) Tool:
                    {{"action":"tool","tool":"query_wifi_database","input":"SELECT ..."}}
                    2) Final:
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
            
            prompt = f"""
                Eres el Agente Operativo. Acabas de ejecutar la tool '{tool_name}'.
                Resultado: {tool_output}
                
                Tu objetivo es completar este FLUJO OBLIGATORIO para gestionar anomalías:
                
                PASO 1: Detectar anomalías (ya ejecutado si vienes de predict_anomaly).
                PASO 2: Crear tickets unassigned. Usa 'create_unassigned_tickets' con los datos de las anomalías. 
                        Argumento: {{"anomalies": [ {{"tipo_anomalia": "...", "descripcion": "...", "wifi_point_id": ...}}, ... ]}}
                        IMPORTANTE: Usa el 'id' del punto wifi obtenido de la evidencia como 'wifi_point_id'.
                PASO 3: Obtener técnicos. Usa 'query_wifi_database' para listar técnicos disponibles (SELECT * FROM tecnicos).
                PASO 4: Asignar tickets. Usa 'create_work_orders' pasando los 'ticket_id' y 'tecnico_id'.
                        Argumento: {{"assignments": [ {{"ticket_id": ..., "tecnico_id": ...}}, ... ]}}
                PASO 5: Respuesta final. Solo cuando todo esté asignado en la DB, genera el diagnóstico para el usuario.
                
                Esquema DB: {DB_SCHEMA_PROMPT}
                
                REGLA DE ORO: No te saltes pasos. Si acabas de crear tickets, el siguiente paso es buscar técnicos y luego asignar.
                
                Devuelve SOLO JSON:
                {{"action":"tool","tool":"...","args":{{...}}}}
                o
                {{"action":"final","answer":"..."}}
                
                Consulta original: {user_text}
            """
            raw = await generate_text(prompt)
            parsed = _safe_json(raw, {"action": "final", "answer": raw})
            
            if parsed.get("action") == "tool":
                t_name = parsed.get("tool")
                t_args = parsed.get("args", {})
                
                # Asegurar que args sea un diccionario para tool_calls
                if not isinstance(t_args, dict):
                    t_args = { "input": t_args }

                return {
                    "active_agent": "operativo",
                    "messages": [
                        AIMessage(
                            content=f"Continuando flujo operativo con {t_name}.",
                            tool_calls=[{
                                "id": f"call_op_{t_name}_{len(state['messages'])}",
                                "name": t_name,
                                "args": t_args,
                            }],
                        )
                    ],
                }
            
            # Si es final, formatear según las reglas de visualización del mapa
            final_context = [str(m.content) for m in state["messages"][-6:]]
            final_answer = await generate_text(
                f"Genera la respuesta final basada en este flujo operativo. \n"
                "Reglas de estructura:\n"
                "1) Diagnostico tecnico\n"
                "2) Evidencia (datos clave del tool)\n"
                "3) Acciones recomendadas priorizadas\n"
                "4) Bloque JSON final en ```json ... ``` (id, name, status, lat, lng)\n"
                "IMPORTANTE: El JSON debe incluir TODAS las anomalías detectadas para que aparezcan en el mapa.\n\n"
                f"Contexto: {final_context}"
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
                    Objetivo: cruces geoespaciales y recomendaciones de inversion.
                    Herramientas:
                    - geospatial_cross_analysis(question)
                    - query_wifi_database(sql)
                    - predict_anomaly(zone_name)
                    {DB_SCHEMA_PROMPT}

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
    return "finalize"


def route_after_tools(state: AgentState) -> str:
    return state.get("active_agent", "conversacional")
