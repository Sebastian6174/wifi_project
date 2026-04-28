import re
from typing import Any

from sqlalchemy import text

from app.core.database import engine

_IDENTIFIER_RE = re.compile(r'^(?:[A-Za-z_][A-Za-z0-9_]*|"[^"]+")$')
_TABLE_REF_RE = re.compile(
    r'\b(?:from|join)\s+(?:(?:"?(?:public)"?\.)?)(?P<table>[A-Za-z_][A-Za-z0-9_]*|"[^"]+")\b',
    flags=re.IGNORECASE,
)
_TABLE_ALIAS_RE = re.compile(
    r'\b(?:from|join)\s+(?:(?:"?(?:public)"?\.)?)(?P<table>[A-Za-z_][A-Za-z0-9_]*|"[^"]+")'
    r'(?:\s+(?:as\s+)?(?P<alias>[A-Za-z_][A-Za-z0-9_]*|"[^"]+"))?',
    flags=re.IGNORECASE,
)
_ALIASED_COLUMN_RE = re.compile(
    r'\b(?P<alias>[A-Za-z_][A-Za-z0-9_]*|"[^"]+")\.(?P<column>[A-Za-z_][A-Za-z0-9_]*|"[^"]+")\b'
)
_ALLOWED_TABLES = {"wifi_points", "wifi_usage", "tecnicos", "tickets"}
_ALLOWED_COLUMNS_BY_TABLE = {
    "wifi_points": {
        "id",
        "NOMBRE ZONA",
        "DIRECCION",
        "BARRIO",
        "COMUNA",
        "CODIGO",
        "CORREO ELECTRÓNICO",
        "LATITUD",
        "LONGITUD",
        "PROVEEDOR CONECTIVIDAD",
        "VELOCIDAD",
        "HORARIOS",
    },
    "wifi_usage": {
        "id",
        "FECHA CONEXION",
        "AREA",
        "NOMBRE ZONA",
        "COMUNA",
        "MODEL",
        "NUMERO CONEXIONES",
        "USAGE (kB)",
        "PORCENTAJE USO",
    },
    "tecnicos": {
        "id",
        "nombre",
        "especialidad",
    },
    "tickets": {
        "id",
        "tipo_anomalia",
        "descripcion",
        "estado",
        "id_tecnico",
        "created_at",
        "resuelto_en",
        "wifi_point_id",
    },
}


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

    referenced_tables = {
        match.group("table").strip('"').lower()
        for match in _TABLE_REF_RE.finditer(sql)
        if match.group("table")
    }
    disallowed = referenced_tables - _ALLOWED_TABLES
    if disallowed:
        raise ValueError(
            "La consulta referencia tablas no permitidas: "
            f"{', '.join(sorted(disallowed))}. "
            "Tablas permitidas: wifi_points, wifi_usage, tecnicos, tickets."
        )

    alias_to_table: dict[str, str] = {}
    for match in _TABLE_ALIAS_RE.finditer(sql):
        table = (match.group("table") or "").strip('"').lower()
        alias = (match.group("alias") or "").strip('"').lower()
        if table not in _ALLOWED_TABLES:
            continue
        alias_to_table[table] = table
        if alias and alias not in {"on", "where", "group", "order", "limit"}:
            alias_to_table[alias] = table

    invalid_columns: list[str] = []
    for match in _ALIASED_COLUMN_RE.finditer(sql):
        alias = match.group("alias").strip('"').lower()
        column = match.group("column").strip('"')
        table = alias_to_table.get(alias)
        if not table:
            continue
        allowed_columns = _ALLOWED_COLUMNS_BY_TABLE.get(table, set())
        if column not in allowed_columns:
            invalid_columns.append(f"{alias}.{column}")

    if invalid_columns:
        raise ValueError(
            "La consulta usa columnas no permitidas o inexistentes: "
            f"{', '.join(sorted(set(invalid_columns)))}. "
            "Revisa el esquema disponible."
        )

    wrapped_sql = text(f"SELECT * FROM ({sql}) AS q LIMIT :limit")
    with engine.connect() as conn:
        rows = conn.execute(wrapped_sql, {"limit": limit})
        return [dict(row._mapping) for row in rows]
