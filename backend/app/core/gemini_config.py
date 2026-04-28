import asyncio
import os

import google.genai as genai
from google.genai.errors import ClientError
from dotenv import load_dotenv

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

_genai_client = genai.Client(api_key=GOOGLE_API_KEY) if GOOGLE_API_KEY else None

_MODEL_FALLBACKS = ("gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro")


async def generate_gemini_response(request: str) -> str:
    if not _genai_client:
        return "No hay GOOGLE_API_KEY configurada para ejecutar Gemini."

    model_candidates: list[str] = []
    for model_name in (GEMINI_MODEL, *_MODEL_FALLBACKS):
        if model_name and model_name not in model_candidates:
            model_candidates.append(model_name)

    last_error: Exception | None = None
    for model_name in model_candidates:
        try:
            response = await _genai_client.aio.models.generate_content(
                model=model_name,
                contents=request,
            )
            return (response.text or "").strip()
        except ClientError as exc:
            # Si el modelo no existe/soporta generateContent, prueba siguiente fallback.
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