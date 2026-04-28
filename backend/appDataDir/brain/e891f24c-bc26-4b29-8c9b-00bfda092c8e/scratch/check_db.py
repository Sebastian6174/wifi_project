from sqlalchemy import text
from app.core.database import engine
import json

with engine.connect() as conn:
    # Check tickets table
    res = conn.execute(text("SELECT column_name, column_default, is_nullable FROM information_schema.columns WHERE table_name = 'tickets'")).fetchall()
    print("Tickets columns:")
    for r in res:
        print(f"  {r}")

    # Check if it has a sequence
    res = conn.execute(text("SELECT relname FROM pg_class WHERE relkind = 'S'")).fetchall()
    print("\nSequences:")
    for r in res:
        print(f"  {r}")
