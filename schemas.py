
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class IngresoBase(BaseModel):
    descripcion: str
    monto: float

class IngresoCreate(IngresoBase):
    pass

class Ingreso(IngresoBase):
    id: int
    semana_id: int
    class Config:
        from_attributes = True

class GastoBase(BaseModel):
    descripcion: str
    monto: float

class GastoCreate(GastoBase):
    pass

class Gasto(GastoBase):
    id: int
    semana_id: int
    class Config:
        from_attributes = True


class SemanaBase(BaseModel):
    nombre: str

class SemanaCreate(SemanaBase):
    pass

class Semana(SemanaBase):
    id: int
    ingresos: List[Ingreso] = []
    gastos: List[Gasto] = []
    class Config:
        from_attributes = True

# Empanada (puedes eliminarlo si no lo necesitas)
class EmpanadaBase(BaseModel):
    nombre: str
    precio: float

class EmpanadaCreate(EmpanadaBase):
    pass

class Empanada(EmpanadaBase):
    id: int
    class Config:
        from_attributes = True
