import json
from uuid import uuid4

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langgraph.checkpoint.memory import InMemorySaver
from openai import BadRequestError

from conversational.db_tools import run_sql_readonly
from conversational.prompts import APPLICATION_CONTEXT
from conversational.schemas import ChatRequest, ChatResponse

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

    sql = None
    data = None
    row_count = None
    for message in reversed(messages):
        if isinstance(message, ToolMessage):
            try:
                payload = json.loads(message.content)
            except (TypeError, json.JSONDecodeError):
                continue

            if payload.get("tool") != "run_sql_readonly":
                continue

            if payload.get("error"):
                break

            sql = payload.get("sql")
            data = payload.get("data")
            row_count = payload.get("count")
            break

    return ChatResponse(
        answer=answer,
        model=MODEL,
        thread_id=effective_thread_id,
        sql=sql,
        data=data,
        row_count=row_count,
        show_table=show_table,
        table_title=table_title,
    )
