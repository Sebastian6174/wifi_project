from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class ZonaWifi(Base):
    __tablename__ = "wifi_points"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre_zona = Column("NOMBRE ZONA", String(255), nullable=False)
    direccion = Column("DIRECCION", String(255), nullable=True)
    barrio = Column("BARRIO", String(120), nullable=True)
    comuna = Column("COMUNA", Integer, nullable=True)
    codigo = Column("CODIGO", String(32), nullable=True)
    correo_electronico = Column("CORREO ELECTRÓNICO", String(255), nullable=True)
    latitud = Column("LATITUD", Float, nullable=True)
    longitud = Column("LONGITUD", Float, nullable=True)
    proveedor_conectividad = Column("PROVEEDOR CONECTIVIDAD", String(120), nullable=True)
    velocidad = Column("VELOCIDAD", String(120), nullable=True)
    horarios = Column("HORARIOS", String(255), nullable=True)


class ConexionWifi(Base):
    __tablename__ = "wifi_usage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_conexion = Column("FECHA CONEXION", Date, nullable=True)
    area = Column("AREA", String(40), nullable=True)
    nombre_zona = Column("NOMBRE ZONA", String(255), nullable=False)
    comuna = Column("COMUNA", String(120), nullable=True)
    model = Column("MODEL", String(80), nullable=True)
    numero_conexiones = Column("NUMERO CONEXIONES", Integer, nullable=True)
    usage_kb = Column("USAGE (kB)", Float, nullable=True)
    porcentaje_uso = Column("PORCENTAJE USO", String(40), nullable=True)


class Tecnico(Base):
    __tablename__ = "tecnicos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    especialidad = Column(String(120), nullable=True)


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tipo_anomalia = Column(String(120), nullable=True)
    descripcion = Column(String(500), nullable=True)
    estado = Column(String(40), nullable=True)
    id_tecnico = Column(Integer, ForeignKey("tecnicos.id"), nullable=True)
    created_at = Column(DateTime, nullable=True)
    resuelto_en = Column(Date, nullable=True)
    wifi_point_id = Column(Integer, ForeignKey("wifi_points.id"), nullable=True)

    tecnico = relationship("Tecnico")
    wifi_point = relationship("ZonaWifi")
