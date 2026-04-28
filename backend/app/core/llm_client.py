import os

import google.genai as genai
from google.genai.errors import ClientError
from dotenv import load_dotenv
from openai import AsyncOpenAI

from app.core.llm_config import DEFAULT_GEMINI_MODEL, get_model_config

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()

_genai_client = genai.Client(api_key=GOOGLE_API_KEY) if GOOGLE_API_KEY else None
_openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

_GEMINI_FALLBACKS = (DEFAULT_GEMINI_MODEL, "gemini-2.0-flash", "gemini-2.5-pro")


def _dedupe_models(models: tuple[str, ...]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for model in models:
        if model and model not in seen:
            seen.add(model)
            ordered.append(model)
    return ordered


async def _generate_with_gemini(prompt: str, model: str) -> str:
    if not _genai_client:
        return "No hay GOOGLE_API_KEY configurada para ejecutar Gemini."

    candidates = _dedupe_models((model, *_GEMINI_FALLBACKS))
    last_error: Exception | None = None

    for model_name in candidates:
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


async def _generate_with_openai(prompt: str, model: str) -> str:
    if not _openai_client:
        return "No hay OPENAI_API_KEY configurada para ejecutar OpenAI."

    response = await _openai_client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    if not response.choices:
        return "Sin respuesta."
    content = response.choices[0].message.content
    return (content or "").strip() or "Sin respuesta."


async def generate_llm_response(prompt: str) -> str:
    config = get_model_config()
    if config.provider == "openai":
        return await _generate_with_openai(prompt, config.model)
    return await _generate_with_gemini(prompt, config.model)
