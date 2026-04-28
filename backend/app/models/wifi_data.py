from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.core.database import Base


class AccessPointCurated(Base):
    __tablename__ = "access_point_curated"

    ap_name = Column(String, primary_key=True)
    mac = Column(String, nullable=True)
    serial = Column(String, nullable=True)
    status = Column(String, nullable=True)
    local_ip = Column(String, nullable=True)
    connectivity_history = Column(String, nullable=True)


class NetworkEventCurated(Base):
    __tablename__ = "network_events_curated"

    # No explicit PK in user schema, but we need one for SQLAlchemy.
    # Assuming id or timestamp+ap_name? Let's use a composite or add an id if it exists.
    # User didn't show id for curated tables, but usually they have one.
    # I'll add an 'id' column but keep it flexible.
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=True)
    ap_name = Column(String, nullable=True)
    ssid = Column(String, nullable=True)
    client_id = Column(String, nullable=True)
    client_description = Column(String, nullable=True)
    event_category = Column(String, nullable=True)
    event_type = Column(String, nullable=True)
    event_detail = Column(JSONB, nullable=True)


class Client(Base):
    __tablename__ = "clients"

    client_id = Column(String, primary_key=True)
    status = Column(String, nullable=True)
    client_description = Column(String, nullable=True)
    last_seen = Column(String, nullable=True)  # User said text
    usage_mb = Column(Float, nullable=True)
    device_type = Column(String, nullable=True)
    ap_name = Column(String, nullable=True)
    policy = Column(String, nullable=True)
    onboarding = Column(Integer, nullable=True)


class ApHourlyMetricCurated(Base):
    __tablename__ = "ap_hourly_metrics_curated"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp_hour = Column(DateTime, nullable=True)
    ap_name = Column(String, nullable=True)
    total_events = Column(Integer, nullable=True)
    total_connections = Column(Integer, nullable=True)
    total_disconnections = Column(Integer, nullable=True)
    total_auth = Column(Integer, nullable=True)
    unique_clients = Column(Integer, nullable=True)
    disconnection_rate = Column(Float, nullable=True)
    status = Column(String, nullable=True)


class DataDictionary(Base):
    __tablename__ = "data_dictionary"
    id = Column(Integer, primary_key=True, autoincrement=True)
    file_name = Column(String, nullable=True)
    field_name = Column(String, nullable=True)
    data_type = Column(String, nullable=True)
    description = Column(String, nullable=True)


class StrategicPlan(Base):
    __tablename__ = "strategic_plans"

    id = Column(UUID(as_uuid=True), primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    zone = Column(String, nullable=False)
    focus = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    total_hours = Column(Numeric, nullable=True)
    subtotal = Column(Numeric, nullable=True)
    contingency = Column(Numeric, nullable=True)
    grand_total = Column(Numeric, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class PlanStep(Base):
    __tablename__ = "plan_steps"

    id = Column(UUID(as_uuid=True), primary_key=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("strategic_plans.id"))
    position = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    owner = Column(String, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    hours = Column(Numeric, nullable=True)
    status = Column(String, nullable=False)
    notes = Column(String, nullable=True)


class PlanBudgetItem(Base):
    __tablename__ = "plan_budget_items"

    id = Column(UUID(as_uuid=True), primary_key=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("strategic_plans.id"))
    category = Column(String, nullable=False)
    description = Column(String, nullable=False)
    qty = Column(Integer, nullable=False)
    unit_cost = Column(Numeric, nullable=False)


class Tecnico(Base):
    __tablename__ = "tecnicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=True)
    especialidad = Column(String, nullable=True)


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    tipo_anomalia = Column(String, nullable=True)
    descripcion = Column(String, nullable=True)
    estado = Column(String, nullable=True)
    id_tecnico = Column(Integer, ForeignKey("tecnicos.id"), nullable=True)
    created_at = Column(DateTime, nullable=True)
    resuelto_en = Column(Date, nullable=True)
    wifi_point_id = Column(Integer, nullable=True)


class WifiPoint(Base):
    __tablename__ = "wifi_points"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre_zona = Column("NOMBRE ZONA", String, nullable=True)
    direccion = Column("DIRECCION", String, nullable=True)
    barrio = Column("BARRIO", String, nullable=True)
    comuna = Column("COMUNA", Integer, nullable=True)
    codigo = Column("CODIGO", Integer, nullable=True)
    correo_electronico = Column("CORREO ELECTRÓNICO", String, nullable=True)
    latitud = Column("LATITUD", Integer, nullable=True)
    longitud = Column("LONGITUD", Integer, nullable=True)
    proveedor_conectividad = Column("PROVEEDOR CONECTIVIDAD", String, nullable=True)
    velocidad = Column("VELOCIDAD", String, nullable=True)
    horarios = Column("HORARIOS", String, nullable=True)


class WifiUsage(Base):
    __tablename__ = "wifi_usage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_conexion = Column("FECHA CONEXION", Date, nullable=True)
    area = Column("AREA", String, nullable=True)
    nombre_zona = Column("NOMBRE ZONA", String, nullable=True)
    comuna = Column("COMUNA", String, nullable=True)
    model = Column("MODEL", String, nullable=True)
    numero_conexiones = Column("NUMERO CONEXIONES", Integer, nullable=True)
    usage_kb = Column("USAGE (kB)", Integer, nullable=True)
    porcentaje_uso = Column("PORCENTAJE USO", String, nullable=True)
