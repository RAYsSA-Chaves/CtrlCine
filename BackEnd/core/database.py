# Conexão com o banco de dados

from core.configs import Settings

import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host=Settings.DB_HOST,
        user=Settings.DB_USER,
        password=Settings.DB_PASSWORD,
        database=Settings.DB_NAME
    )