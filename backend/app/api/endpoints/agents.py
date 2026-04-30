import logging

from fastapi import APIRouter, HTTPException

from app.core.llm_client import generate_llm_response
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


import re
import json

def _extract_structured_data(text: str):
    prediction = None
    anomalies = None
    
    # Busca bloques JSON. El primero que sea un objeto {} suele ser la prediccion.
    # El primero que sea un array [] suele ser la lista de anomalias.
    json_blocks = re.findall(r"```json\s+([\s\S]*?)\s+```", text)
    
    for block in json_blocks:
        try:
            parsed = json.loads(block.strip())
            if isinstance(parsed, dict) and prediction is None:
                prediction = parsed
            elif isinstance(parsed, list) and anomalies is None:
                anomalies = parsed
        except:
            continue
            
    # Limpiar el texto para que no muestre los bloques crudos si se desea
    clean_text = re.sub(r"Bloque JSON.*?```json[\s\S]*?```", "", text, flags=re.IGNORECASE | re.DOTALL).strip()
    # Si la limpieza dejo el texto muy vacio, volvemos al original pero sin los bloques
    if len(clean_text) < 20:
        clean_text = re.sub(r"```json[\s\S]*?```", "", text, flags=re.DOTALL).strip()

    return clean_text, prediction, anomalies

from sqlalchemy import text
from app.core.database import engine

import httpx

async def _enrich_anomalies_with_coords(anomalies):
    if not anomalies:
        return anomalies
        
    try:
        async with httpx.AsyncClient() as client:
            for anom in anomalies:
                # Si ya tiene coordenadas válidas, saltar
                if anom.get("lat") and anom.get("lng") and abs(float(anom["lat"])) < 100:
                    continue
                    
                target_name = str(anom.get("name", anom.get("ap_name", "")))
                # Limpiar el nombre para la búsqueda (p.ej. AP-SILOE-01 -> Siloe)
                clean_target = re.sub(r'AP-|-AP\d+|ZW\s+', '', target_name, flags=re.I).strip().lower()
                
                # 1. PRIORIDAD: Geocoding Externo (Nominatim)
                try:
                    search_query = f"{clean_target}, Cali, Colombia"
                    logger.info(f"Geocoding prioritario (Nominatim) para: {search_query}")
                    headers = {"User-Agent": "ZonasWiFi_Cali_Bot/0.1"}
                    response = await client.get(
                        "https://nominatim.openstreetmap.org/search",
                        params={"q": search_query, "format": "json", "limit": 1},
                        headers=headers,
                        timeout=5.0
                    )
                    if response.status_code == 200 and response.json():
                        data = response.json()[0]
                        anom["lat"] = float(data["lat"])
                        anom["lng"] = float(data["lon"])
                        logger.info(f"Anomalia '{target_name}' ubicada via Nominatim: {anom['lat']}, {anom['lng']}")
                        continue # Ya encontramos ubicación, pasar a la siguiente anomalía
                except Exception as ge:
                    logger.warning(f"Nominatim falló para {target_name}: {ge}")

                # 2. FALLBACK: Búsqueda difusa en DB local
                try:
                    with engine.connect() as conn:
                        query = text('SELECT id, "NOMBRE ZONA" as name, "LATITUD" as lat, "LONGITUD" as lng FROM wifi_points')
                        all_points = [dict(row._mapping) for row in conn.execute(query)]
                        
                        best_match = None
                        for pt in all_points:
                            pt_name = str(pt["name"]).lower()
                            if clean_target in pt_name or pt_name in clean_target:
                                best_match = pt
                                break
                        
                        if best_match:
                            lat = float(best_match["lat"]) if best_match["lat"] else None
                            lng = float(best_match["lng"]) if best_match["lng"] else None
                            if lat:
                                while abs(lat) > 10: lat /= 10
                            if lng:
                                while abs(lng) > 100: lng /= 10
                            
                            anom["lat"] = lat
                            anom["lng"] = lng
                            anom["wifi_point_id"] = best_match["id"]
                            logger.info(f"Anomalia '{target_name}' ubicada via Fallback DB Local: '{best_match['name']}'")
                except Exception as dbe:
                    logger.error(f"Error en fallback de DB local para {target_name}: {dbe}")
                            
    except Exception as e:
        logger.error(f"Error general enriqueciendo anomalias: {e}")
        
    return anomalies


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
            answer = await generate_llm_response(full_prompt)
    
        # Procesar respuesta para extraer JSONs
        clean_answer, prediction, anomalies = _extract_structured_data(answer)
        
        # Enriquecer anomalias con coordenadas si faltan
        if anomalies:
            anomalies = await _enrich_anomalies_with_coords(anomalies)

        logger.info("Respuesta generada para agente=%s", request.agent_type)
        return AgentPromptResponse(
            agent_type=request.agent_type, 
            answer=clean_answer,
            prediction=prediction,
            anomalies=anomalies
        )
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
