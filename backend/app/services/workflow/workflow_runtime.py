from collections import defaultdict, deque

from app.core.gemini_config import GEMINI_MODEL, _genai_client
from google.genai.errors import ClientError
from app.services.workflow.agent_graph_nodes import build_nodes

_SHORT_TERM_MEMORY: dict[str, deque[dict[str, str]]] = defaultdict(lambda: deque(maxlen=8))
_DEFAULT_CONVERSATION_ID = "global"


async def generate_text(prompt: str) -> str:
    if not _genai_client:
        return "No hay GOOGLE_API_KEY configurada para ejecutar Gemini."
    model_candidates: list[str] = []
    for model_name in (GEMINI_MODEL, "gemini-2.5-flash", "gemini-2.0-flash"):
        if model_name and model_name not in model_candidates:
            model_candidates.append(model_name)

    last_error: Exception | None = None
    for model_name in model_candidates:
        try:
            response = await _genai_client.aio.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return (response.text or "").strip()
        except ClientError as exc:
            if exc.code == 404:
                last_error = exc
                continue
            raise
        except Exception as exc:  # pragma: no cover
            last_error = exc
            continue

    if last_error:
        return f"Error llamando a Gemini: {last_error}"
    return "No se pudo generar respuesta con los modelos configurados."


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

