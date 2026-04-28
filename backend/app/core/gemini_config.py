from app.core.llm_client import generate_llm_response


async def generate_gemini_response(request: str) -> str:
    return await generate_llm_response(request)