import re
from typing import Any

from sqlalchemy import text

from app.core.database import engine

_IDENTIFIER_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def _is_safe_identifier(value: str) -> bool:
    return bool(_IDENTIFIER_RE.match(value))


def list_public_tables(limit: int = 25) -> list[str]:
    sql = text(
        """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
        LIMIT :limit
        """
    )
    with engine.connect() as conn:
        rows = conn.execute(sql, {"limit": limit}).fetchall()
    return [row[0] for row in rows]


def get_table_row_count(table_name: str) -> int:
    if not _is_safe_identifier(table_name):
        raise ValueError(f"Nombre de tabla no valido: {table_name}")
    sql = text(f'SELECT COUNT(*) FROM public."{table_name}"')
    with engine.connect() as conn:
        return int(conn.execute(sql).scalar_one())


def get_tables_overview(table_names: list[str] | None = None) -> dict[str, Any]:
    tables = table_names or list_public_tables()
    overview: list[dict[str, Any]] = []
    for table in tables:
        if not _is_safe_identifier(table):
            continue
        try:
            row_count = get_table_row_count(table)
            overview.append({"table": table, "rows": row_count})
        except Exception as exc:
            overview.append({"table": table, "error": str(exc)})
    return {"tables": overview}


def run_readonly_query(sql: str, limit: int = 200) -> list[dict[str, Any]]:
    normalized = sql.strip().lower()
    if not normalized.startswith("select"):
        raise ValueError("Solo se permiten consultas SELECT.")
    if ";" in normalized:
        raise ValueError("No se permiten multiples sentencias SQL.")

    wrapped_sql = text(f"SELECT * FROM ({sql}) AS q LIMIT :limit")
    with engine.connect() as conn:
        rows = conn.execute(wrapped_sql, {"limit": limit})
        return [dict(row._mapping) for row in rows]
