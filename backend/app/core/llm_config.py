import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()

DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
DEFAULT_OPENAI_MODEL = "gpt-5-nano"


@dataclass(frozen=True)
class ModelConfig:
    provider: str
    model: str


def _env_non_empty(key: str) -> str | None:
    value = os.getenv(key)
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def get_model_config() -> ModelConfig:
    gemini_model = _env_non_empty("GEMINI_MODEL")
    if gemini_model:
        return ModelConfig(provider="gemini", model=gemini_model)

    openai_model = _env_non_empty("OPENAI_MODEL")
    if openai_model:
        return ModelConfig(provider="openai", model=openai_model)

    return ModelConfig(provider="gemini", model=DEFAULT_GEMINI_MODEL)


def get_gemini_model() -> str:
    return _env_non_empty("GEMINI_MODEL") or DEFAULT_GEMINI_MODEL


def get_openai_model() -> str:
    return _env_non_empty("OPENAI_MODEL") or DEFAULT_OPENAI_MODEL
