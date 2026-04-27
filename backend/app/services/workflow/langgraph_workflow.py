from collections import defaultdict, deque

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

from app.core.gemini_config import GEMINI_MODEL, _genai_client
from app.services.workflow.agent_graph_nodes import (
    AgentState,
    build_nodes,
    route_after_agent,
    route_after_tools,
    route_from_supervisor,
)
from app.services.workflow.agent_graph_tools import tools_node

_SHORT_TERM_MEMORY: dict[str, deque[dict[str, str]]] = defaultdict(lambda: deque(maxlen=8))
_DEFAULT_CONVERSATION_ID = "global"


async def _generate_text(prompt: str) -> str:
    if not _genai_client:
        return "No hay GOOGLE_API_KEY configurada para ejecutar Gemini."
    response = await _genai_client.aio.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    return (response.text or "").strip()


def _build_memory_context(conversation_id: str) -> str:
    memory = _SHORT_TERM_MEMORY.get(conversation_id)
    if not memory:
        return "Sin memoria previa."
    lines = []
    for turn in memory:
        lines.append(f"Usuario: {turn.get('user', '')}")
        lines.append(f"Asistente: {turn.get('assistant', '')}")
    return "\n".join(lines)


def _store_memory_turn(conversation_id: str, user_prompt: str, assistant_answer: str) -> None:
    _SHORT_TERM_MEMORY[conversation_id].append(
        {"user": user_prompt[:1500], "assistant": assistant_answer[:2500]}
    )


nodes = build_nodes(_generate_text)

workflow = StateGraph(AgentState)
workflow.add_node("supervisor", nodes["supervisor"])
workflow.add_node("conversacional", nodes["conversacional"])
workflow.add_node("operativo", nodes["operativo"])
workflow.add_node("estrategico", nodes["estrategico"])
workflow.add_node("tools", tools_node)
workflow.add_node("finalize", nodes["finalize"])

workflow.add_edge(START, "supervisor")
workflow.add_conditional_edges(
    "supervisor",
    route_from_supervisor,
    {
        "conversacional": "conversacional",
        "operativo": "operativo",
        "estrategico": "estrategico",
        "final": "finalize",
    },
)
workflow.add_conditional_edges(
    "conversacional",
    route_after_agent,
    {"tools": "tools", "finalize": "finalize"},
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
    {
        "conversacional": "conversacional",
        "operativo": "operativo",
        "estrategico": "estrategico",
    },
)
workflow.add_edge("finalize", END)

multiagent_app = workflow.compile()


async def run_multiagent_prompt(
    prompt: str,
    context: str | None = None,
    conversation_id: str | None = None,
) -> str:
    conv_id = (conversation_id or _DEFAULT_CONVERSATION_ID).strip() or _DEFAULT_CONVERSATION_ID
    memory_context = _build_memory_context(conv_id)
    base_text = f"{prompt}\n\nContexto adicional: {context}" if context else prompt
    human_text = (
        f"{base_text}\n\n"
        "Memoria corta de la conversacion (ultimos turnos):\n"
        f"{memory_context}"
    )
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
        "next_agent": "conversacional",
    }
    result = await multiagent_app.ainvoke(initial_state)
    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage) and msg.content:
            answer = str(msg.content)
            _store_memory_turn(conv_id, prompt, answer)
            return answer
    return "No se pudo generar una respuesta en el flujo multi-agente."
