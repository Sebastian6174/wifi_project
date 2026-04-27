import asyncio
import os

import google.genai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-1.5-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

_genai_client = genai.Client(api_key=GOOGLE_API_KEY) if GOOGLE_API_KEY else None

def generate_gemini_response(request):
    return "nada"