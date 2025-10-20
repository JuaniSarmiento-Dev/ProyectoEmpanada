from sqlalchemy.orm import Session
import models
import schemas

def get_empanada(db: Session, empanada_id: int):
    """Función para obtener una empanada por su ID (SELECT)"""
    return db.query(models.Empanada).filter(models.Empanada.id == empanada_id).first()

def create_empanada(db: Session, empanada: schemas.EmpanadaCreate):
    """Función para crear una nueva empanada (INSERT)"""
    db_empanada = models.Empanada(nombre=empanada.nombre, precio=empanada.precio)
    db.add(db_empanada)
    db.commit()
    db.refresh(db_empanada)
    return db_empanada
