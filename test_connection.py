"""Script para probar la conexión a la base de datos"""
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL cargada: {DATABASE_URL[:50]}...")

# Probar conexión con psycopg2 directamente
try:
    import psycopg2
    print("\n✓ psycopg2 instalado correctamente")
    
    # Parsear la URL
    from urllib.parse import urlparse
    result = urlparse(DATABASE_URL)
    
    print(f"\nDetalles de conexión:")
    print(f"  Host: {result.hostname}")
    print(f"  Puerto: {result.port}")
    print(f"  Base de datos: {result.path[1:]}")
    print(f"  Usuario: {result.username}")
    
    # Intentar conectar
    print("\nIntentando conectar a PostgreSQL...")
    conn = psycopg2.connect(DATABASE_URL)
    print("✓ Conexión exitosa a PostgreSQL!")
    
    # Probar una consulta simple
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"✓ Versión de PostgreSQL: {version[0][:50]}...")
    
    cursor.close()
    conn.close()
    print("✓ Conexión cerrada correctamente")
    
except Exception as e:
    print(f"\n✗ Error al conectar: {type(e).__name__}")
    print(f"  Mensaje: {str(e)}")
    print("\nPosibles causas:")
    print("  1. Problema de conexión a internet")
    print("  2. Firewall bloqueando la conexión")
    print("  3. Credenciales incorrectas")
    print("  4. Base de datos de Supabase pausada o no disponible")
