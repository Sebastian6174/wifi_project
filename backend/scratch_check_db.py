from app.core.database import engine
from sqlalchemy import text

def check():
    with engine.connect() as conn:
        count = conn.execute(text('SELECT count(*) FROM wifi_points')).scalar()
        print(f"Total rows: {count}")
        rows = conn.execute(text('SELECT id, \"NOMBRE ZONA\" FROM wifi_points LIMIT 5')).fetchall()
        for r in rows:
            print(r)

if __name__ == "__main__":
    check()
