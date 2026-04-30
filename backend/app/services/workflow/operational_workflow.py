from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

from app.services.workflow.agent_graph_nodes import AgentState, route_after_agent
from app.services.workflow.agent_graph_tools import tools_node
from app.services.workflow.workflow_runtime import (
    _DEFAULT_CONVERSATION_ID,
    build_memory_context,
    nodes,
    store_memory_turn,
)

operational_workflow = StateGraph(AgentState)
operational_workflow.add_node("operativo", nodes["operativo"])
operational_workflow.add_node("tools", tools_node)
operational_workflow.add_node("finalize", nodes["finalize"])

operational_workflow.add_edge(START, "operativo")
operational_workflow.add_conditional_edges(
    "operativo",
    route_after_agent,
    {"tools": "tools", "finalize": "finalize", "end": END},
)
operational_workflow.add_conditional_edges(
    "tools",
    lambda _: "operativo",
    {"operativo": "operativo"},
)
operational_workflow.add_edge("finalize", END)

operational_app = operational_workflow.compile()


async def run_operational_prompt(
    prompt: str,
    context: str | None = None,
    conversation_id: str | None = None,
) -> str:
    conv_id = (conversation_id or _DEFAULT_CONVERSATION_ID).strip() or _DEFAULT_CONVERSATION_ID
    memory_context = build_memory_context(conv_id)
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
                    "Flujo operativo dedicado de Zonas WiFi Cali. "
                    "Inicia en operativo_node y prioriza evidencia de BD + modelo ML."
                )
            ),
            HumanMessage(content=human_text),
        ],
        "next_agent": "operativo",
        "active_agent": "operativo",
    }
    result = await operational_app.ainvoke(initial_state)
    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage) and msg.content:
            answer = str(msg.content)
            store_memory_turn(conv_id, prompt, answer)
            return answer
    return "No se pudo generar una respuesta en el flujo operativo."

