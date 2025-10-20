from sqlalchemy import Column, String, Date, DateTime, Enum, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class TipoTransaccion(enum.Enum):
    INGRESO = "ingreso"
    EGRESO = "egreso"

class Semana(Base):
    __tablename__ = 'semana'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)

class Transaccion(Base):
    __tablename__ = 'transaccion'

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    fecha = Column(DateTime, nullable=False)
    tipo = Column(Enum(TipoTransaccion), nullable=False)
    monto = Column(Numeric, nullable=False)
    descripcion = Column(String, nullable=True)
    semana_id = Column(UUID(as_uuid=True), ForeignKey('semana.id'), nullable=False)