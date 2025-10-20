
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base


class Semana(Base):
    __tablename__ = "semanas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    ingresos = relationship("Ingreso", back_populates="semana", cascade="all, delete-orphan")
    gastos = relationship("Gasto", back_populates="semana", cascade="all, delete-orphan")

class Ingreso(Base):
    __tablename__ = "ingresos"
    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String)
    monto = Column(Float)
    semana_id = Column(Integer, ForeignKey("semanas.id"))
    semana = relationship("Semana", back_populates="ingresos")

class Gasto(Base):
    __tablename__ = "gastos"
    id = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String)
    monto = Column(Float)
    semana_id = Column(Integer, ForeignKey("semanas.id"))
    semana = relationship("Semana", back_populates="gastos")

# Empanada queda como ejemplo, puedes eliminarlo si no lo necesitas
class Empanada(Base):
    __tablename__ = "empanadas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    precio = Column(Float)
