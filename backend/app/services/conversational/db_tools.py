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

    if len(rows) == 1 and list(rows[0].keys()) == ["run_sql_readonly"]:
        inner = rows[0].get("run_sql_readonly")
        if isinstance(inner, str):
            try:
                inner = json.loads(inner)
            except json.JSONDecodeError:
                inner = None

        if isinstance(inner, list):
            inner = {
                "tool": "run_sql_readonly",
                "sql": statement,
                "count": len(inner),
                "data": inner,
            }

        if isinstance(inner, dict):
            inner.setdefault("tool", "run_sql_readonly")
            inner.setdefault("sql", statement)
            if "count" not in inner and isinstance(inner.get("data"), list):
                inner["count"] = len(inner["data"])
            return json.dumps(inner, ensure_ascii=True)

    result = {
        "tool": "run_sql_readonly",
        "sql": statement,
        "count": len(rows),
        "data": rows,
    }
    return json.dumps(result, ensure_ascii=True)


@tool
def lookup_data_dictionary(field_name: str) -> str:
    """Lookup field metadata in data_dictionary by field name."""
    field = (field_name or "").strip()
    if not field:
        return json.dumps(
            {
                "tool": "lookup_data_dictionary",
                "error": "field_name cannot be empty.",
            },
            ensure_ascii=True,
        )

    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT file_name, field_name, data_type, description
                    FROM data_dictionary
                    WHERE field_name ILIKE :field
                    ORDER BY file_name, field_name
                    LIMIT 50
                    """
                ),
                {"field": f"%{field}%"},
            ).fetchall()
    except Exception as exc:
        return json.dumps(
            {
                "tool": "lookup_data_dictionary",
                "error": f"Dictionary lookup failed: {str(exc)}",
            },
            ensure_ascii=True,
        )

    rows = [dict(row._mapping) for row in rows]
    return json.dumps(
        {
            "tool": "lookup_data_dictionary",
            "field_name": field,
            "count": len(rows),
            "data": rows,
        },
        ensure_ascii=True,
    )
