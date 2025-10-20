
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
import repository
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SEMANAS ---
@app.post("/semanas/", response_model=schemas.Semana)
def create_semana(semana: schemas.SemanaCreate, db: Session = Depends(get_db)):
    db_semana = models.Semana(**semana.dict())
    db.add(db_semana)
    db.commit()
    db.refresh(db_semana)
    return db_semana

@app.get("/semanas/", response_model=list[schemas.Semana])
def list_semanas(db: Session = Depends(get_db)):
    return db.query(models.Semana).all()

@app.get("/semanas/{semana_id}", response_model=schemas.Semana)
def get_semana(semana_id: int, db: Session = Depends(get_db)):
    semana = db.query(models.Semana).filter(models.Semana.id == semana_id).first()
    if not semana:
        raise HTTPException(status_code=404, detail="Semana not found")
    return semana

@app.put("/semanas/{semana_id}", response_model=schemas.Semana)
def update_semana(semana_id: int, semana: schemas.SemanaCreate, db: Session = Depends(get_db)):
    db_semana = db.query(models.Semana).filter(models.Semana.id == semana_id).first()
    if not db_semana:
        raise HTTPException(status_code=404, detail="Semana not found")
    db_semana.nombre = semana.nombre
    db.commit()
    db.refresh(db_semana)
    return db_semana

@app.delete("/semanas/{semana_id}")
def delete_semana(semana_id: int, db: Session = Depends(get_db)):
    db_semana = db.query(models.Semana).filter(models.Semana.id == semana_id).first()
    if not db_semana:
        raise HTTPException(status_code=404, detail="Semana not found")
    db.delete(db_semana)
    db.commit()
    return {"message": "Semana eliminada correctamente"}

# --- INGRESOS ---
@app.post("/semanas/{semana_id}/ingresos/", response_model=schemas.Ingreso)
def create_ingreso(semana_id: int, ingreso: schemas.IngresoCreate, db: Session = Depends(get_db)):
    db_ingreso = models.Ingreso(**ingreso.dict(), semana_id=semana_id)
    db.add(db_ingreso)
    db.commit()
    db.refresh(db_ingreso)
    return db_ingreso

@app.get("/semanas/{semana_id}/ingresos/", response_model=list[schemas.Ingreso])
def list_ingresos(semana_id: int, db: Session = Depends(get_db)):
    return db.query(models.Ingreso).filter(models.Ingreso.semana_id == semana_id).all()

@app.put("/ingresos/{ingreso_id}", response_model=schemas.Ingreso)
def update_ingreso(ingreso_id: int, ingreso: schemas.IngresoCreate, db: Session = Depends(get_db)):
    db_ingreso = db.query(models.Ingreso).filter(models.Ingreso.id == ingreso_id).first()
    if not db_ingreso:
        raise HTTPException(status_code=404, detail="Ingreso not found")
    db_ingreso.descripcion = ingreso.descripcion
    db_ingreso.monto = ingreso.monto
    db.commit()
    db.refresh(db_ingreso)
    return db_ingreso

@app.delete("/ingresos/{ingreso_id}")
def delete_ingreso(ingreso_id: int, db: Session = Depends(get_db)):
    db_ingreso = db.query(models.Ingreso).filter(models.Ingreso.id == ingreso_id).first()
    if not db_ingreso:
        raise HTTPException(status_code=404, detail="Ingreso not found")
    db.delete(db_ingreso)
    db.commit()
    return {"message": "Ingreso eliminado correctamente"}

# --- GASTOS ---
@app.post("/semanas/{semana_id}/gastos/", response_model=schemas.Gasto)
def create_gasto(semana_id: int, gasto: schemas.GastoCreate, db: Session = Depends(get_db)):
    db_gasto = models.Gasto(**gasto.dict(), semana_id=semana_id)
    db.add(db_gasto)
    db.commit()
    db.refresh(db_gasto)
    return db_gasto

@app.get("/semanas/{semana_id}/gastos/", response_model=list[schemas.Gasto])
def list_gastos(semana_id: int, db: Session = Depends(get_db)):
    return db.query(models.Gasto).filter(models.Gasto.semana_id == semana_id).all()

@app.put("/gastos/{gasto_id}", response_model=schemas.Gasto)
def update_gasto(gasto_id: int, gasto: schemas.GastoCreate, db: Session = Depends(get_db)):
    db_gasto = db.query(models.Gasto).filter(models.Gasto.id == gasto_id).first()
    if not db_gasto:
        raise HTTPException(status_code=404, detail="Gasto not found")
    db_gasto.descripcion = gasto.descripcion
    db_gasto.monto = gasto.monto
    db.commit()
    db.refresh(db_gasto)
    return db_gasto

@app.delete("/gastos/{gasto_id}")
def delete_gasto(gasto_id: int, db: Session = Depends(get_db)):
    db_gasto = db.query(models.Gasto).filter(models.Gasto.id == gasto_id).first()
    if not db_gasto:
        raise HTTPException(status_code=404, detail="Gasto not found")
    db.delete(db_gasto)
    db.commit()
    return {"message": "Gasto eliminado correctamente"}

# --- BALANCE ---
@app.get("/semanas/{semana_id}/balance/")
def get_balance(semana_id: int, db: Session = Depends(get_db)):
    ingresos = db.query(models.Ingreso).filter(models.Ingreso.semana_id == semana_id).all()
    gastos = db.query(models.Gasto).filter(models.Gasto.semana_id == semana_id).all()
    total_ingresos = sum(i.monto for i in ingresos)
    total_gastos = sum(g.monto for g in gastos)
    balance = total_ingresos - total_gastos
    return {
        "total_ingresos": total_ingresos,
        "total_gastos": total_gastos,
        "balance": balance
    }

# --- Empanadas (puedes eliminarlo si no lo necesitas) ---
@app.post("/empanadas/", response_model=schemas.Empanada)
def create_empanada(empanada: schemas.EmpanadaCreate, db: Session = Depends(get_db)):
    return repository.create_empanada(db=db, empanada=empanada)

@app.get("/empanadas/{empanada_id}", response_model=schemas.Empanada)
def read_empanada(empanada_id: int, db: Session = Depends(get_db)):
    db_empanada = repository.get_empanada(db, empanada_id=empanada_id)
    if db_empanada is None:
        raise HTTPException(status_code=404, detail="Empanada not found")
    return db_empanada
