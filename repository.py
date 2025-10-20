from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from models import Semana, Transaccion
from schemas import SemanaCreate, TransaccionCreate
from sqlalchemy import func
from decimal import Decimal
from datetime import datetime

def crear_semana(db: Session, semana: SemanaCreate) -> Semana:
    nueva_semana = Semana(
        id=uuid4(),  # Generate a new UUID
        nombre=semana.nombre,
        fecha_inicio=semana.fecha_inicio,
        fecha_fin=semana.fecha_fin
    )
    db.add(nueva_semana)
    db.commit()
    db.refresh(nueva_semana)
    return nueva_semana

def obtener_semana(db: Session, semana_id: UUID) -> Semana:
    return db.query(Semana).filter(Semana.id == semana_id).first()

def listar_semanas(db: Session) -> list[Semana]:
    return db.query(Semana).all()

def crear_transaccion(db: Session, transaccion: TransaccionCreate) -> Transaccion:
    nueva_transaccion = Transaccion(
        id=uuid4(),
        fecha=datetime.utcnow(),
        tipo=transaccion.tipo,
        monto=transaccion.monto,
        descripcion=transaccion.descripcion,
        semana_id=transaccion.semana_id
    )
    db.add(nueva_transaccion)
    db.commit()
    db.refresh(nueva_transaccion)
    return nueva_transaccion

def listar_transacciones_por_semana(db: Session, semana_id: UUID) -> list[Transaccion]:
    return db.query(Transaccion).filter(Transaccion.semana_id == semana_id).all()

def calcular_balance(db: Session, semana_id: UUID) -> dict:
    ingresos = db.query(func.sum(Transaccion.monto)).filter(
        Transaccion.semana_id == semana_id, Transaccion.tipo == "ingreso"
    ).scalar() or Decimal(0)

    egresos = db.query(func.sum(Transaccion.monto)).filter(
        Transaccion.semana_id == semana_id, Transaccion.tipo == "egreso"
    ).scalar() or Decimal(0)

    return {
        "total_ingresos": ingresos,
        "total_egresos": egresos,
        "balance_neto": ingresos - egresos
    }