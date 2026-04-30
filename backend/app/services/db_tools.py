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
    r'(?P<alias>[A-Za-z_][A-Za-z0-9_]*|"[^"]+")\.(?P<column>[A-Za-z_][A-Za-z0-9_]*|"[^"]+")'
)
_ALLOWED_TABLES = {
    "access_point_curated",
    "ap_hourly_metrics_curated",
    "clients",
    "data_dictionary",
    "network_events_curated",
    "plan_budget_items",
    "plan_steps",
    "strategic_plans",
    "tecnicos",
    "tickets",
    "wifi_points",
    "wifi_usage",
}
_ALLOWED_COLUMNS_BY_TABLE = {
    "access_point_curated": {
        "ap_name",
        "mac",
        "serial",
        "status",
        "local_ip",
        "connectivity_history",
    },
    "ap_hourly_metrics_curated": {
        "timestamp_hour",
        "ap_name",
        "total_events",
        "total_connections",
        "total_disconnections",
        "total_auth",
        "unique_clients",
        "disconnection_rate",
        "status",
    },
    "clients": {
        "client_id",
        "status",
        "client_description",
        "last_seen",
        "usage_mb",
        "device_type",
        "ap_name",
        "policy",
        "onboarding",
    },
    "data_dictionary": {
        "file_name",
        "field_name",
        "data_type",
        "description",
    },
    "network_events_curated": {
        "timestamp",
        "ap_name",
        "ssid",
        "client_id",
        "client_description",
        "event_category",
        "event_type",
        "event_detail",
    },
    "plan_budget_items": {
        "id",
        "plan_id",
        "category",
        "description",
        "qty",
        "unit_cost",
    },
    "plan_steps": {
        "id",
        "plan_id",
        "position",
        "title",
        "owner",
        "start_date",
        "end_date",
        "hours",
        "status",
        "notes",
    },
    "strategic_plans": {
        "id",
        "title",
        "description",
        "zone",
        "focus",
        "priority",
        "total_hours",
        "subtotal",
        "contingency",
        "grand_total",
        "created_at",
        "updated_at",
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
        "FECHA CONEXION",
        "AREA",
        "NOMBRE ZONA",
        "COMUNA",
        "MODEL",
        "NUMERO CONEXIONES",
        "USAGE (kB)",
        "PORCENTAJE USO",
        "id",
    },
}


def _strip_trailing_semicolons(sql: str) -> str:
    return sql.rstrip().rstrip(";").rstrip()


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
    cleaned_sql = _strip_trailing_semicolons(sql)
    normalized = cleaned_sql.lower()
    if not normalized.startswith("select"):
        raise ValueError("Solo se permiten consultas SELECT.")
    if ";" in cleaned_sql:
        raise ValueError("No se permiten multiples sentencias SQL.")

    referenced_tables = {
        match.group("table").strip('"').lower()
        for match in _TABLE_REF_RE.finditer(cleaned_sql)
        if match.group("table")
    }
    disallowed = referenced_tables - _ALLOWED_TABLES
    if disallowed:
        raise ValueError(
            "La consulta referencia tablas no permitidas: "
            f"{', '.join(sorted(disallowed))}. "
            "Tablas permitidas: access_point_curated, ap_hourly_metrics_curated, network_events_curated, clients, wifi_points, wifi_usage, strategic_plans, tecnicos, tickets."
        )

    alias_to_table: dict[str, str] = {}
    for match in _TABLE_ALIAS_RE.finditer(cleaned_sql):
        table = (match.group("table") or "").strip('"').lower()
        alias = (match.group("alias") or "").strip('"').lower()
        if table not in _ALLOWED_TABLES:
            continue
        alias_to_table[table] = table
        if alias and alias not in {"on", "where", "group", "order", "limit"}:
            alias_to_table[alias] = table

    invalid_columns: list[str] = []
    for match in _ALIASED_COLUMN_RE.finditer(cleaned_sql):
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

    wrapped_sql = text(f"SELECT * FROM ({cleaned_sql}) AS q LIMIT :limit")
    with engine.connect() as conn:
        rows = conn.execute(wrapped_sql, {"limit": limit})
        return [dict(row._mapping) for row in rows]


def create_ticket(tipo_anomalia: str, descripcion: str, wifi_point_id: int | None = None) -> int:
    """Crea un nuevo ticket unassigned."""
    sql = text(
        """
        INSERT INTO tickets (tipo_anomalia, descripcion, estado, wifi_point_id)
        VALUES (:tipo, :desc, 'open', :ap_id)
        RETURNING id
        """
    )
    with engine.begin() as conn:
        result = conn.execute(sql, {"tipo": tipo_anomalia, "desc": descripcion, "ap_id": wifi_point_id})
        return result.scalar_one()


def update_ticket_technician(ticket_id: int, tecnico_id: int) -> bool:
    """Asigna un tecnico a un ticket y cambia el estado a 'assigned'."""
    sql = text(
        """
        UPDATE tickets
        SET id_tecnico = :t_id, estado = 'assigned'
        WHERE id = :tkt_id
        """
    )
    with engine.begin() as conn:
        result = conn.execute(sql, {"t_id": tecnico_id, "tkt_id": ticket_id})
        return result.rowcount > 0
