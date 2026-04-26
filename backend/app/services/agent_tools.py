import asyncio
import re
from dataclasses import dataclass
from typing import Any, Awaitable, Callable

from app.services.db_tools import get_tables_overview, run_readonly_query


ToolRunner = Callable[[str], Awaitable[dict[str, Any]]]


@dataclass(frozen=True)
class AgentTool:
    name: str
    description: str
    runner: ToolRunner


async def _run_db_overview(_: str) -> dict[str, Any]:
    overview = await asyncio.to_thread(get_tables_overview)
    return {"tool": "db_overview", "result": overview}


async def _run_db_query(tool_input: str) -> dict[str, Any]:
    query = tool_input.strip()
    if not query:
        raise ValueError("db_query requiere una consulta SQL.")
    rows = await asyncio.to_thread(run_readonly_query, query)
    return {"tool": "db_query", "rows": rows}


async def _run_ml_stub(tool_input: str) -> dict[str, Any]:
    return {
        "tool": "ml_forecast_stub",
        "result": (
            "Tool de ML aun en modo stub. "
            f"Solicitud recibida: '{tool_input.strip() or 'sin parametros'}'."
        ),
    }


TOOLS: dict[str, AgentTool] = {
    "db_overview": AgentTool(
        name="db_overview",
        description="Entrega tablas publicas y conteo de filas.",
        runner=_run_db_overview,
    ),
    "db_query": AgentTool(
        name="db_query",
        description="Ejecuta consultas SQL de solo lectura (SELECT).",
        runner=_run_db_query,
    ),
    "ml_forecast_stub": AgentTool(
        name="ml_forecast_stub",
        description="Placeholder para futuros algoritmos de ML.",
        runner=_run_ml_stub,
    ),
}


_TOOL_CALL_RE = re.compile(r"^tool:(?P<name>[a-zA-Z0-9_]+)\s*(?P<input>.*)$")
_AUTO_DB_HINT_RE = re.compile(
    r"\b(cuant[oa]s|conteo|total|registros|filas|tabla|conexiones|zonas)\b",
    flags=re.IGNORECASE,
)


def available_tools_text() -> str:
    lines = [f"- {tool.name}: {tool.description}" for tool in TOOLS.values()]
    return "\n".join(lines)


async def execute_tools_for_prompt(prompt: str) -> list[dict[str, Any]]:
    """
    Pattern de tools:
    - Invocacion explicita: `tool:<nombre> <input>`
    - Invocacion automatica: consultas de datos disparan `db_overview`
    """
    results: list[dict[str, Any]] = []
    stripped = prompt.strip()

    match = _TOOL_CALL_RE.match(stripped)
    if match:
        tool_name = match.group("name")
        tool_input = match.group("input")
        tool = TOOLS.get(tool_name)
        if not tool:
            return [{"tool": tool_name, "error": "Tool no encontrada."}]
        try:
            result = await tool.runner(tool_input)
            results.append(result)
        except Exception as exc:
            results.append({"tool": tool_name, "error": str(exc)})
        return results

    if _AUTO_DB_HINT_RE.search(prompt):
        try:
            results.append(await TOOLS["db_overview"].runner(""))
        except Exception as exc:
            results.append({"tool": "db_overview", "error": str(exc)})

    return results
