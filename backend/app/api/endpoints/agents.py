import logging

from fastapi import APIRouter, HTTPException

from app.core.gemini_config import generate_gemini_response
from app.schemas.agent_schema import AgentInput, AgentPromptRequest, AgentPromptResponse
from app.services.conversational.schemas import ChatRequest, ChatResponse
from app.services.conversational.service import run_conversational_chat
from app.services.workflow.langgraph_workflow import run_multiagent_prompt
from app.services.workflow.operational_workflow import run_operational_prompt

router = APIRouter()
logger = logging.getLogger("app.agents")

AGENT_SYSTEM_PROMPTS = {
    "operativo": (
        "Eres el Agente Operativo de ZonasWiFi_Cali_AI. "
        "Respondes con foco en ejecucion tecnica, estado de servicios, incidentes y acciones."
    ),
    "conversacional": (
        "Eres el Agente Conversacional de ZonasWiFi_Cali_AI. "
        "Respondes de forma clara, amable y orientada al ciudadano. "
        "Usa los resultados de tools cuando esten disponibles para responder con datos reales."
    ),
    "estrategico": (
        "Eres el Agente Estrategico de ZonasWiFi_Cali_AI. "
        "Respondes con analisis de tendencias, decisiones y recomendaciones de alto nivel."
    ),
}


async def _run_agent(request: AgentPromptRequest) -> AgentPromptResponse:
    logger.info("Solicitud recibida para agente=%s", request.agent_type)

    system_prompt = AGENT_SYSTEM_PROMPTS.get(request.agent_type)
    if not system_prompt:
        logger.warning("Tipo de agente no soportado: %s", request.agent_type)
        raise HTTPException(status_code=400, detail="Tipo de agente no soportado.")

    try:
        if request.agent_type == "conversacional":
            logger.info("Ejecutando flujo LangGraph multi-agente para consulta conversacional")
            answer = await run_multiagent_prompt(
                request.prompt,
                request.context,
                request.conversation_id,
            )
        elif request.agent_type == "operativo":
            logger.info("Ejecutando flujo LangGraph operativo dedicado")
            answer = await run_operational_prompt(
                request.prompt,
                request.context,
                request.conversation_id,
            )
        else:
            full_prompt = (
                f"{system_prompt}\n\n"
                f"Contexto:\n{request.context or 'Sin contexto adicional'}\n\n"
                f"Consulta del usuario:\n{request.prompt}"
            )
            logger.info("Ejecutando decision directa para agente=%s", request.agent_type)
            answer = await generate_gemini_response(full_prompt)
    
        logger.info("Respuesta generada para agente=%s", request.agent_type)
        return AgentPromptResponse(agent_type=request.agent_type, answer=answer)
    except Exception as exc: 
        logger.exception("Error procesando agente=%s", request.agent_type)
        raise HTTPException(status_code=500, detail=f"Error interno de IA: {exc}") from exc


@router.post("/operativo", response_model=AgentPromptResponse)
async def agente_operativo(payload: AgentInput) -> AgentPromptResponse:
    request = AgentPromptRequest(agent_type="operativo", **payload.model_dump())
    return await _run_agent(request)


@router.post("/conversacional", response_model=AgentPromptResponse)
async def agente_conversacional(payload: AgentInput) -> AgentPromptResponse:
    request = AgentPromptRequest(agent_type="conversacional", **payload.model_dump())
    return await _run_agent(request)


@router.post("/conversacional/dedicado", response_model=ChatResponse)
async def agente_conversacional_dedicado(payload: ChatRequest) -> ChatResponse:
    try:
        return run_conversational_chat(payload)
    except Exception as exc:
        logger.exception("Error procesando conversacional dedicado")
        raise HTTPException(status_code=500, detail=f"Error interno de IA: {exc}") from exc


@router.post("/estrategico", response_model=AgentPromptResponse)
async def agente_estrategico(payload: AgentInput) -> AgentPromptResponse:
    request = AgentPromptRequest(agent_type="estrategico", **payload.model_dump())
    return await _run_agent(request)
