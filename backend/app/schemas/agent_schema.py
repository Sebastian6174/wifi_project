from typing import Literal

from pydantic import BaseModel, Field


class AgentInput(BaseModel):
    prompt: str = Field(..., min_length=5, max_length=5000)
    context: str | None = Field(
        default=None,
        description="Contexto adicional para enriquecer la respuesta.",
    )

class AgentPromptRequest(BaseModel):
    agent_type: Literal["operativo", "conversacional", "estrategico"] = Field(
        ...,
        description="Tipo de agente que procesara la consulta.",
    )
    prompt: str = Field(..., min_length=5, max_length=5000)
    context: str | None = Field(default=None)


class AgentPromptResponse(BaseModel):
    agent_type: str
    answer: str
