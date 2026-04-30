from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

from app.services.workflow.agent_graph_nodes import (
    AgentState,
    route_after_agent,
    route_after_tools,
    route_from_supervisor,
)
from app.services.workflow.agent_graph_tools import tools_node
from app.services.workflow.workflow_runtime import (
    _DEFAULT_CONVERSATION_ID,
    build_memory_context,
    nodes,
    store_memory_turn,
)

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
    {"tools": "tools", "finalize": "finalize", "end": END},
)
workflow.add_conditional_edges(
    "operativo",
    route_after_agent,
    {"tools": "tools", "finalize": "finalize", "end": END},
)
workflow.add_conditional_edges(
    "estrategico",
    route_after_agent,
    {"tools": "tools", "finalize": "finalize", "end": END},
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
            store_memory_turn(conv_id, prompt, answer)
            return answer
    return "No se pudo generar una respuesta en el flujo multi-agente."
