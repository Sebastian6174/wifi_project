import json
import os
from typing import Any, Literal, TypedDict

from dotenv import load_dotenv
from google import genai
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

from app.services.db_tools import get_tables_overview, run_readonly_query

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
_genai_client = genai.Client(api_key=GOOGLE_API_KEY) if GOOGLE_API_KEY else None


class AgentState(MessagesState, TypedDict):
    next_agent: Literal["operativo", "estrategico", "final"]


def _last_user_text(messages: list[Any]) -> str:
    for msg in reversed(messages):
        if isinstance(msg, HumanMessage):
            return str(msg.content)
    return ""


async def _generate_text(prompt: str) -> str:
    if not _genai_client:
        return "No hay GOOGLE_API_KEY configurada para ejecutar Gemini."

    response = await _genai_client.aio.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return (response.text or "").strip()


@tool
def query_wifi_database(sql: str) -> str:
    """
    Ejecuta consultas SQL de solo lectura sobre la base de Zonas WiFi.
    Entrada: consulta SELECT.
    """
    rows = run_readonly_query(sql, limit=300)
    return json.dumps(rows, ensure_ascii=False, default=str)


@tool
def predict_anomaly(zone_name: str) -> str:
    """
    Estima una alerta simple por zona a partir de conexiones históricas.
    Entrada: nombre de la zona.
    """
    query = f"""
    SELECT
      nombre_zona,
      AVG(numero_conexiones) AS avg_conexiones,
      MAX(numero_conexiones) AS max_conexiones,
      MIN(numero_conexiones) AS min_conexiones
    FROM conexiones_wifi
    WHERE nombre_zona ILIKE '%{zone_name.strip().replace("'", "''")}%'
    GROUP BY nombre_zona
    ORDER BY avg_conexiones DESC
    LIMIT 5
    """
    rows = run_readonly_query(query, limit=10)
    if not rows:
        return json.dumps(
            {
                "zone_name": zone_name,
                "status": "sin_datos",
                "message": "No se encontraron datos para esa zona.",
            },
            ensure_ascii=False,
        )
    return json.dumps(
        {
            "zone_name": zone_name,
            "status": "ok",
            "prediction_hint": "Revisar anomalias cuando max_conexiones > 2x avg_conexiones.",
            "data": rows,
        },
        ensure_ascii=False,
        default=str,
    )


TOOLS = [query_wifi_database, predict_anomaly]
tools_node = ToolNode(TOOLS)


SUPERVISOR_PROMPT = """
Eres el Supervisor/Router de un sistema multi-agente.
Decide a qué agente enrutar:
- operativo: SQL, diagnostico tecnico, estado de tablas, fallas.
- estrategico: tendencias, geoespacial, anomalias, inversion.
- final: si la respuesta puede cerrarse sin delegar.

Devuelve SOLO JSON valido con este formato:
{"next_agent":"operativo|estrategico|final","reason":"..."}
"""


async def supervisor_node(state: AgentState) -> dict[str, Any]:
    user_text = _last_user_text(state["messages"])
    prompt = (
        f"{SUPERVISOR_PROMPT}\n\n"
        f"Consulta del usuario:\n{user_text}\n"
    )
    raw = await _generate_text(prompt)
    next_agent: Literal["operativo", "estrategico", "final"] = "operativo"
    try:
        parsed = json.loads(raw)
        candidate = parsed.get("next_agent", "operativo")
        if candidate in {"operativo", "estrategico", "final"}:
            next_agent = candidate
    except Exception:
        # fallback simple
        text = user_text.lower()
        if any(word in text for word in ["anom", "tendencia", "estrateg", "inversion", "predic"]):
            next_agent = "estrategico"
        elif any(word in text for word in ["resumen", "saludo", "explica"]):
            next_agent = "final"

    if next_agent == "final":
        final_text = await _generate_text(
            "Responde de forma clara y breve al usuario.\n\n"
            f"Consulta: {user_text}"
        )
        return {"next_agent": "final", "messages": [AIMessage(content=final_text)]}

    return {"next_agent": next_agent}


async def operativo_node(state: AgentState) -> dict[str, Any]:
    user_text = _last_user_text(state["messages"])
    prompt = f"""
Eres Agente Operativo experto en SQL y diagnostico de fallas.
Si necesitas datos, decide el uso de tool:
- query_wifi_database(sql)

Devuelve SOLO JSON valido:
1) Si usas tool:
{{"action":"tool","tool":"query_wifi_database","input":"SELECT ..."}}
2) Si no usas tool:
{{"action":"final","answer":"..."}}

Consulta:
{user_text}
"""
    raw = await _generate_text(prompt)
    try:
        parsed = json.loads(raw)
    except Exception:
        parsed = {"action": "final", "answer": raw}

    if parsed.get("action") == "tool":
        return {
            "next_agent": "operativo",
            "messages": [
                AIMessage(
                    content="Ejecutando consulta SQL solicitada.",
                    tool_calls=[
                        {
                            "id": "call_operativo_sql",
                            "name": "query_wifi_database",
                            "args": {"sql": parsed.get("input", "SELECT 1")},
                        }
                    ],
                )
            ],
        }

    return {"next_agent": "final", "messages": [AIMessage(content=parsed.get("answer", ""))]}


async def estrategico_node(state: AgentState) -> dict[str, Any]:
    user_text = _last_user_text(state["messages"])
    investment_hint = get_tables_overview(["zonas_wifi", "conexiones_wifi"])
    prompt = f"""
Eres Agente Estrategico experto en geoespacial, tendencias e inversion.
Contexto de datos disponibles:
{json.dumps(investment_hint, ensure_ascii=False, default=str)}

Si necesitas tool, usa:
- predict_anomaly(zone_name)
- query_wifi_database(sql)

Devuelve SOLO JSON valido:
1) Tool:
{{"action":"tool","tool":"predict_anomaly|query_wifi_database","input":"..."}}
2) Final:
{{"action":"final","answer":"..."}}

Consulta:
{user_text}
"""
    raw = await _generate_text(prompt)
    try:
        parsed = json.loads(raw)
    except Exception:
        parsed = {"action": "final", "answer": raw}

    if parsed.get("action") == "tool":
        tool_name = parsed.get("tool", "predict_anomaly")
        if tool_name not in {"predict_anomaly", "query_wifi_database"}:
            tool_name = "predict_anomaly"
        arg_name = "zone_name" if tool_name == "predict_anomaly" else "sql"
        return {
            "next_agent": "estrategico",
            "messages": [
                AIMessage(
                    content=f"Ejecutando tool {tool_name}.",
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
    latest_context = state["messages"][-6:]
    prompt = (
        "Genera respuesta final para el ciudadano con base en la consulta y resultados internos.\n"
        f"Consulta usuario: {user_text}\n"
        f"Mensajes recientes: {[str(m.content) for m in latest_context]}"
    )
    answer = await _generate_text(prompt)
    return {"messages": [AIMessage(content=answer)], "next_agent": "final"}


def route_from_supervisor(state: AgentState) -> str:
    return state.get("next_agent", "operativo")


def route_after_agent(state: AgentState) -> str:
    last = state["messages"][-1]
    if isinstance(last, AIMessage) and getattr(last, "tool_calls", None):
        return "tools"
    return "finalize"


def route_after_tools(state: AgentState) -> str:
    owner = state.get("next_agent", "operativo")
    if owner == "estrategico":
        return "estrategico"
    return "operativo"


workflow = StateGraph(AgentState)
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("operativo", operativo_node)
workflow.add_node("estrategico", estrategico_node)
workflow.add_node("tools", tools_node)
workflow.add_node("finalize", finalize_node)

workflow.add_edge(START, "supervisor")
workflow.add_conditional_edges(
    "supervisor",
    route_from_supervisor,
    {
        "operativo": "operativo",
        "estrategico": "estrategico",
        "final": "finalize",
    },
)
workflow.add_conditional_edges(
    "operativo",
    route_after_agent,
    {"tools": "tools", "finalize": "finalize"},
)
workflow.add_conditional_edges(
    "estrategico",
    route_after_agent,
    {"tools": "tools", "finalize": "finalize"},
)
workflow.add_conditional_edges(
    "tools",
    route_after_tools,
    {"operativo": "operativo", "estrategico": "estrategico"},
)
workflow.add_edge("finalize", END)

multiagent_app = workflow.compile()


async def run_multiagent_prompt(prompt: str, context: str | None = None) -> str:
    human_text = f"{prompt}\n\nContexto adicional: {context}" if context else prompt
    initial_state: AgentState = {
        "messages": [
            SystemMessage(
                content=(
                    "Sistema multi-agente de Zonas WiFi Cali. "
                    "Prioriza respuestas precisas, verificables y accionables."
                )
            ),
            HumanMessage(content=human_text),
        ],
        "next_agent": "operativo",
    }
    result = await multiagent_app.ainvoke(initial_state)
    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage) and msg.content:
            return str(msg.content)
    return "No se pudo generar una respuesta en el flujo multi-agente."
