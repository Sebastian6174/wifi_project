import os
from urllib.parse import quote_plus

from dotenv import load_dotenv

load_dotenv()


def _env(*keys: str, default: str | None = None) -> str | None:
    for key in keys:
        val = os.getenv(key)
        if val is not None and val != "":
            return val
    return default


def get_database_url() -> str:
    """
    Construye la URL de SQLAlchemy para PostgreSQL.
    Usa DB_* (o alias POSTGRES_*) para no chocar con USER del sistema operativo.
    """
    user = _env("DB_USER", "POSTGRES_USER", default="postgres")
    password = _env("DB_PASSWORD", "POSTGRES_PASSWORD", "PASSWORD", default="") or ""
    host = _env("DB_HOST", "HOST", default="localhost")
    port = _env("DB_PORT", "PORT", default="5432")
    dbname = _env("DB_NAME", "DBNAME", default="postgres")
    sslmode = _env("DB_SSLMODE", default="require")

    user_q = quote_plus(user)
    password_q = quote_plus(password) if password else ""
    auth = f"{user_q}:{password_q}@" if password_q else f"{user_q}@"

    base = f"postgresql+psycopg2://{auth}{host}:{port}/{dbname}"
    if sslmode and sslmode.lower() != "disable":
        base = f"{base}?sslmode={quote_plus(sslmode)}"
    return base
