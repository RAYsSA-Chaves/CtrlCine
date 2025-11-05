# Rotas para requisições de filmes

from BackEnd.core.database import get_connection

import json 
import requests

cursor = get_connection.db.cursor
