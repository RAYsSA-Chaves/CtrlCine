# Lógica das requisições de atores

from core.database import get_connection


# Cadastro de ator
def cadastrar_ator(nome, foto):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# verifica se o ator já existe
		cursor.execute('SELECT * FROM atores WHERE nome = %s', (nome,))
		ator_existente = cursor.fetchone()  # retorna 1 tupla -> (1, 'Rayssa')

		# se já existe retorna erro
		if ator_existente:
			response = {'Erro': 'Ator já cadastrado'}
			return response
	
		# insere novo ator
		cursor.execute('''
			INSERT INTO atores (nome, foto) 
			VALUES (%s, %s)
		''', (nome, foto))
		conn.commit()
		
		# pega ID do ator inserido
		id_ator = cursor.lastrowid

		# busca o ator para retornar
		cursor.execute('SELECT * FROM atores WHERE id = %s', (id_ator,))
		ator = cursor.fetchone()

		# resposta com os dados do ator
		response = {
			'Mensagem': 'Ator cadastrado com sucesso!',
			'id': ator[0], 
			'nome': ator[1],  
			'foto': ator[2]  
		}

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()
	
	return response

# ---------------------------------------------

# Listar todos os atores
def list_all_actors():
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega todos os atores
		cursor.execute('SELECT * FROM atores ORDER BY nome ASC')
		atores = cursor.fetchall()

		# monta a lista de atores como objetos
		lista_atores = []
		for ator in atores:
			lista_atores.append({
			'id': ator[0],
			'nome': ator[1],
			'foto': ator[2]
		})
			
		# resposta
		response = lista_atores

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Pegar atores de um filme
def get_atores_por_filme(filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca todos os atores relacionados ao filme
		cursor.execute('''
			SELECT atores.id, atores.nome, atores.foto
			FROM filme_ator
			JOIN atores ON filme_ator.ator_id = atores.id
			WHERE filme_ator.filme_id = %s
		''', (filme_id,))
		atores = cursor.fetchall()  # retorna lista de tuplas -> [(1, 'Rayssa'), (2, 'Ana')]
		
		# se não tiver atores cadastrados para o filme
		if not atores:
			response = {'Mensagem': 'Nenhum ator encontrado para este filme'}
		
		else:
			# monta a lista de atores como objetos
			lista_atores = []
			for ator in atores:
				lista_atores.append({
				'id': ator[0],
				'nome': ator[1],
				'foto': ator[2]
			})

			# resposta
			response = lista_atores

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Buscar ator por nome
def get_actor_name(nome):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca o ator no banco
		cursor.execute('SELECT * FROM atores WHERE atores.nome = %s', (nome,)) 
		ator = cursor.fetchone()

		# ator não encontrado
		if not ator:
			response = {'Mensagem': 'Ator não encontrado'}
			return response

		# resposta com os dados do ator
		response = {
			'id': ator[0], 
			'nome': ator[1],  
		}
	
	# erro
	except Exception as e:
		response = {'Erro': str(e)}
	
	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()

	return response