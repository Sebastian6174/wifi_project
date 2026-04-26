import asyncio
import os

import google.genai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-1.5-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)


async def generate_gemini_response(prompt: str) -> str:
    """
    Wrapper asincrono para el SDK de Gemini.
    El SDK actual es sincrono; por eso se delega a un hilo con to_thread.
    """
    model = genai.GenerativeModel(GEMINI_MODEL)
    response = await asyncio.to_thread(model.generate_content, prompt)
    return getattr(response, "text", "") or "No se obtuvo respuesta del modelo."
