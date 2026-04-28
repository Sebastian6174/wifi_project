import json
from uuid import uuid4

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langgraph.checkpoint.memory import InMemorySaver
from openai import BadRequestError

from app.services.conversational.db_tools import run_sql_readonly
from app.services.conversational.prompts import APPLICATION_CONTEXT
from app.services.conversational.schemas import ChatRequest, ChatResponse

load_dotenv()

MODEL = "gpt-5-nano"

checkpointer = InMemorySaver()
agent = create_agent(
    model=MODEL,
    tools=[run_sql_readonly],
    system_prompt=APPLICATION_CONTEXT,
    checkpointer=checkpointer,
)


def run_conversational_chat(payload: ChatRequest) -> ChatResponse:
    effective_thread_id = payload.thread_id
    config = {"configurable": {"thread_id": effective_thread_id}}

    try:
        result = agent.invoke(
            {"messages": [HumanMessage(content=payload.message)]},
            config=config,
        )
    except BadRequestError as exc:
        error_text = str(exc)
        stale_tool_call_error = (
            "tool_calls" in error_text
            and "did not have response messages" in error_text
        )

        if not stale_tool_call_error:
            raise ValueError(f"LLM bad request: {error_text}") from exc

        # Recover by retrying with a fresh thread state when previous thread history is inconsistent.
        effective_thread_id = f"{payload.thread_id}-reset-{uuid4().hex[:8]}"
        reset_config = {"configurable": {"thread_id": effective_thread_id}}
        result = agent.invoke(
            {"messages": [HumanMessage(content=payload.message)]},
            config=reset_config,
        )

    messages = result.get("messages", []) if isinstance(result, dict) else []
    if not messages:
        raise ValueError("Agent returned no messages.")

    answer = None
    show_table = None
    table_title = None
    show_chart = None
    chart_title = None
    chart_x_key = None
    chart_y_key = None
    for message in reversed(messages):
        if isinstance(message, AIMessage):
            answer = message.content
            break

    if answer is None:
        raise ValueError("Agent returned no assistant response.")

    if not isinstance(answer, str):
        answer = str(answer)

    try:
        parsed = json.loads(answer)
    except json.JSONDecodeError:
        parsed = None

    if isinstance(parsed, dict):
        answer = str(parsed.get("answer", "")).strip()
        if answer == "":
            answer = "Sin respuesta."
        show_table = parsed.get("show_table")
        table_title = parsed.get("table_title")
        show_chart = parsed.get("show_chart")
        chart_title = parsed.get("chart_title")
        chart_x_key = parsed.get("chart_x_key")
        chart_y_key = parsed.get("chart_y_key")

    sql = None
    data = None
    row_count = None
    tool_error = None
    for message in reversed(messages):
        if isinstance(message, ToolMessage):
            try:
                payload = json.loads(message.content)
            except (TypeError, json.JSONDecodeError):
                continue

            if payload.get("tool") != "run_sql_readonly":
                continue

            if payload.get("error"):
                tool_error = payload.get("error")
                break

            sql = payload.get("sql")
            data = payload.get("data")
            row_count = payload.get("count")
            break

    table_data = None
    chart_data = None
    chart_config = None

    if tool_error and (answer is None or answer.strip() == ""):
        answer = f"Error al ejecutar SQL: {tool_error}"

    if show_table is True and isinstance(data, list) and data:
        headers = list(data[0].keys())
        rows = [[str(row.get(h, "")) for h in headers] for row in data]
        truncated = False
        if len(rows) > 10:
            rows = rows[:10]
            truncated = True
        table_data = {"headers": headers, "rows": rows}
        if table_title is None or str(table_title).strip() == "":
            table_title = "Resultados"
        if truncated and answer:
            answer = f"{answer}\n\nNota: Se muestran solo las primeras 10 filas."

    if show_chart is True and chart_x_key and chart_y_key and isinstance(data, list) and data:
        chart_data = data[:10]
        if chart_title is None or str(chart_title).strip() == "":
            chart_title = "Grafico"
        chart_config = {
            "x_key": chart_x_key,
            "y_key": chart_y_key,
            "title": chart_title,
        }

    return ChatResponse(
        answer=answer,
        model=MODEL,
        thread_id=effective_thread_id,
        sql=sql,
        row_count=row_count,
        show_table=show_table,
        table_title=table_title,
        show_chart=show_chart,
        chart_title=chart_title,
        chart_x_key=chart_x_key,
        chart_y_key=chart_y_key,
        table_data=table_data,
        chart_data=chart_data,
        chart_config=chart_config,
    )
