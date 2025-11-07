# Rotas para requisições de gêneros

from core.database import get_connection


# Listar todos os gêneros
def list_all_genres():
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega todos os gêneros
		cursor.execute('SELECT * FROM generos ORDER BY nome ASC')
		generos = cursor.fetchall()

		# monta a lista de gêneros como objetos
		lista_generos = []
		for gen in generos:
			lista_generos.append({
			'id': gen[0],
			'nome': gen[1]
		})
			
		# resposta
		response = lista_generos

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Pegar gêneros de um filme
def get_generos_por_filme(filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca todos os gêneros relacionados ao filme
		cursor.execute('''
			SELECT generos.id, generos.nome
			FROM filme_genero
			JOIN generos ON filme_genero.genero_id = generos.id
			WHERE filme_genero.filme_id = %s
		''', (filme_id,))
		generos = cursor.fetchall()
		
		# se não tiver gêneros cadastrados para o filme
		if not generos:
			response = {'Mensagem': 'Nenhum gênero encontrado para este filme'}
		
		else:
			# monta a lista de gêneros como objetos
			lista_generos = []
			for gen in generos:
				lista_generos.append({
				'id': gen[0],
				'nome': gen[1]
			})

			# resposta
			response = lista_generos

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Buscar gênero por nome
def get_genre_name(nome):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca o gênero no banco
		cursor.execute('SELECT * FROM generos WHERE generos.nome = %s', (nome,)) 
		genero = cursor.fetchone()

		# gênero não encontrado
		if not genero:
			response = {'Mensagem': 'Gênero não encontrado'}
			return response

		# resposta com os dados do gênero
		response = {
			'Mensagem': 'Gênero encontrado!',
			'id': genero[0], 
			'nome': genero[1],  
		}
	
	# erro
	except Exception as e:
		response = {'Erro': str(e)}
	
	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()

	return response