
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Lee la URL de la base de datos desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")


# Solo PostgreSQL/Supabase
if DATABASE_URL.startswith("sqlite"):
    raise ValueError("El proyecto solo debe usar PostgreSQL/Supabase. Verifica tu .env")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Función para obtener una sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
