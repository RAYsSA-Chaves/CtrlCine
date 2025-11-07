# Rotas para requisições de filmes

from core.database import get_connection
from api.logic.atores import get_atores_por_filme, get_actor_name
from api.logic.diretores import get_diretores_por_filme, get_director_name
from api.logic.generos import get_generos_por_filme, get_genre_name
from api.logic.produtoras import get_produtoras_por_filme, get_producer_name


# Pegar todos os filmes (ou filtrados)
def get_movies(filters):
	...


# ---------------------------------------------

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
			return response
