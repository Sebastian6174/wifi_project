from sqlalchemy import Column, Date, Float, Integer, String

from app.core.database import Base


class ZonaWifi(Base):
    __tablename__ = "zonas_wifi"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre_zona = Column(String(255), nullable=False)
    direccion = Column(String(255), nullable=True)
    barrio = Column(String(120), nullable=True)
    comuna = Column(Integer, nullable=True)
    codigo = Column(String(32), nullable=True)
    correo_electronico = Column(String(255), nullable=True)
    latitud = Column(Float, nullable=True)
    longitud = Column(Float, nullable=True)
    proveedor_conectividad = Column(String(120), nullable=True)
    velocidad = Column(String(120), nullable=True)
    horarios = Column(String(255), nullable=True)


class ConexionWifi(Base):
    __tablename__ = "conexiones_wifi"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_conexion = Column(Date, nullable=True)
    area = Column(String(40), nullable=True)
    nombre_zona = Column(String(255), nullable=False)
    comuna = Column(Integer, nullable=True)
    model = Column(String(80), nullable=True)
    numero_conexiones = Column(Integer, nullable=True)
    usage_kb = Column(Float, nullable=True)
    porcentaje_uso = Column(Float, nullable=True)
