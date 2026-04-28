from collections import defaultdict, deque

from app.core.llm_client import generate_llm_response
from app.services.workflow.agent_graph_nodes import build_nodes

_SHORT_TERM_MEMORY: dict[str, deque[dict[str, str]]] = defaultdict(lambda: deque(maxlen=8))
_DEFAULT_CONVERSATION_ID = "global"


async def generate_text(prompt: str) -> str:
    return await generate_llm_response(prompt)


def build_memory_context(conversation_id: str) -> str:
    memory = _SHORT_TERM_MEMORY.get(conversation_id)
    if not memory:
        return "No hay historial de conversacion disponible."
    lines = []
    for turn in memory:
        lines.append(f"Usuario: {turn.get('user', '')}")
        lines.append(f"Asistente: {turn.get('assistant', '')}")
    return "\n".join(lines)


def store_memory_turn(conversation_id: str, user_prompt: str, assistant_answer: str) -> None:
    _SHORT_TERM_MEMORY[conversation_id].append(
        {"user": user_prompt[:1500], "assistant": assistant_answer[:2500]}
    )


nodes = build_nodes(generate_text)

