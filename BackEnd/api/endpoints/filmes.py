# Rotas para requisições de filmes

from BackEnd.core.database import get_connection
from BackEnd.api.endpoints.atores import get_atores_por_filme 

import json 

# Pegar filme específico
def get_filme_por_id(filme_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
      # pega infos básicas do filme 
      cursor.execute('SELECT id, titulo, descricao, ano FROM filmes WHERE id = %s', (filme_id,))
        filme = cursor.fetchone()

        if not filme:
            response = {'Erro': 'Filme não encontrado.'}
        else:
            # pega os atores do filme
            atores = get_atores_por_filme(filme_id)

            # monta a resposta
            response = {
                'id': filme[0],
                'titulo': filme[1],
                'descricao': filme[2],
                'ano': filme[3],
                'atores': atores 
            }

  # erro
    except Exception as e:
      response = {'Erro': str(e)}

  # printa o filme completo e fecha conexão com banco 
      finally:
        cursor.close()
        conn.close()
        print(response)
        return json.dumps(response, ensure_ascii=False, indent=4)
