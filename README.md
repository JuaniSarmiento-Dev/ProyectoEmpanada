# Empanadas Luna

Este proyecto es un backend desarrollado con FastAPI, SQLAlchemy y Alembic para gestionar datos en una base de datos Supabase.

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.kxwnhbavkefoxqswawno.supabase.co:5432/postgres
```

Reemplaza `[YOUR_PASSWORD]` con la contraseña de tu base de datos.

2. Instala las dependencias:

```
pip install -r requirements.txt
```

3. Ejecuta las migraciones:

```
alembic upgrade head
```

## Estructura del Proyecto

- `main.py`: Punto de entrada de la aplicación FastAPI.
- `models.py`: Modelos de datos definidos con SQLAlchemy.
- `database.py`: Configuración de la conexión a la base de datos.
- `alembic/`: Archivos de configuración y migraciones de Alembic.

## Comandos Útiles

- Crear una nueva migración:

```
alembic revision --autogenerate -m "Descripción de la migración"
```

- Aplicar migraciones:

```
alembic upgrade head
```

## Licencia

Este proyecto está bajo la licencia MIT.