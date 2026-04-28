import json

from langchain_core.tools import tool
from sqlalchemy import text

from app.core.database import engine


@tool
def run_sql_readonly(sql: str) -> str:
    """Execute a read-only SQL query through DB function public.run_sql_readonly(p_sql text)."""
    statement = sql.strip()
    if not statement:
        return json.dumps(
            {
                "tool": "run_sql_readonly",
                "error": "SQL statement cannot be empty.",
            },
            ensure_ascii=True,
        )

    normalized = statement.lower()
    if not normalized.startswith("select"):
        return json.dumps(
            {
                "tool": "run_sql_readonly",
                "error": "Only SELECT statements are allowed in this tool.",
            },
            ensure_ascii=True,
        )

    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text("SELECT * FROM public.run_sql_readonly(:p_sql)"),
                {"p_sql": statement},
            ).fetchall()
    except Exception as exc:
        return json.dumps(
            {
                "tool": "run_sql_readonly",
                "sql": statement,
                "error": f"SQL execution failed: {str(exc)}",
            },
            ensure_ascii=True,
        )
    rows = [dict(row._mapping) for row in rows]

    result = {
        "tool": "run_sql_readonly",
        "sql": statement,
        "count": len(rows),
        "data": rows,
    }
    return json.dumps(result, ensure_ascii=True)
