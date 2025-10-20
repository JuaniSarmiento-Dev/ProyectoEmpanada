from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from uuid import UUID
from database import SessionLocal, engine
from models import Base
from repository import (
    crear_semana,
    obtener_semana,
    listar_semanas,
    crear_transaccion,
    listar_transacciones_por_semana,
    calcular_balance,
)
from schemas import SemanaCreate, SemanaOut, TransaccionCreate, TransaccionOut

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Empanadas Luna API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/semanas", response_model=SemanaOut)
def create_semana(semana: SemanaCreate, db: Session = Depends(get_db)):
    return crear_semana(db, semana)


@app.get("/semanas", response_model=list[SemanaOut])
def get_semanas(db: Session = Depends(get_db)):
    return listar_semanas(db)


@app.get("/semanas/{semana_id}", response_model=SemanaOut)
def get_semana(semana_id: UUID, db: Session = Depends(get_db)):
    semana = obtener_semana(db, semana_id)
    if not semana:
        raise HTTPException(status_code=404, detail="Semana not found")
    return semana


@app.post("/transacciones", response_model=TransaccionOut)
def create_transaccion(transaccion: TransaccionCreate, db: Session = Depends(get_db)):
    return crear_transaccion(db, transaccion)


@app.get("/semanas/{semana_id}/transacciones", response_model=list[TransaccionOut])
def get_transacciones(semana_id: UUID, db: Session = Depends(get_db)):
    return listar_transacciones_por_semana(db, semana_id)


@app.get("/semanas/{semana_id}/balance")
def get_balance(semana_id: UUID, db: Session = Depends(get_db)):
    return calcular_balance(db, semana_id)