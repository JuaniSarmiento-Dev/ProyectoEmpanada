from pydantic import BaseModel
from datetime import date, datetime
from uuid import UUID
from decimal import Decimal
from enum import Enum

class SemanaCreate(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date

class SemanaOut(BaseModel):
    id: UUID
    nombre: str
    fecha_inicio: date
    fecha_fin: date

    model_config = {"from_attributes": True}

class TipoTransaccion(str, Enum):
    INGRESO = "ingreso"
    EGRESO = "egreso"

class TransaccionCreate(BaseModel):
    tipo: TipoTransaccion
    monto: Decimal
    descripcion: str
    semana_id: UUID

class TransaccionOut(BaseModel):
    id: UUID
    fecha: datetime
    tipo: TipoTransaccion
    monto: Decimal
    descripcion: str

    model_config = {"from_attributes": True}