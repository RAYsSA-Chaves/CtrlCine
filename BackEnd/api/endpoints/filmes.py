# Rotas para requisições de filmes

from core.database import get_connection

import json 
import requests

cursor = get_connection.db.cursor