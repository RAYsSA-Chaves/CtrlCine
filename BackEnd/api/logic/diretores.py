# Lógica das requisições de diretores

from core.database import get_connection


# Cadastro de diretor
def cadastrar_diretor(nome):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# verifica se o diretor já existe
		cursor.execute('SELECT * FROM diretores WHERE nome = %s', (nome,))
		diretor_existente = cursor.fetchone()

		# se já existe retorna erro
		if diretor_existente:
			response = {'Erro': 'Diretor já cadastrado'}
			return response
	
		# insere novo diretor
		cursor.execute('''
			INSERT INTO diretores (nome) 
			VALUES (%s)
		''', (nome,))
		conn.commit()
		
		# pega ID do diretor inserido
		id_diretor = cursor.lastrowid

		# busca o diretor para retornar
		cursor.execute('SELECT * FROM diretores WHERE id = %s', (id_diretor,))
		diretor = cursor.fetchone()

		# resposta com os dados do diretor
		response = {
			'Mensagem': 'Diretor cadastrado com sucesso!',
			'id': diretor[0], 
			'nome': diretor[1] 
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

# Listar todos os diretores
def list_all_directors():
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega todos os diretores
		cursor.execute('SELECT * FROM diretores ORDER BY nome ASC')
		diretores = cursor.fetchall()

		# monta a lista de diretores como objetos
		lista_diretores = []
		for diretor in diretores:
			lista_diretores.append({
			'id': diretor[0],
			'nome': diretor[1]
		})
			
		# resposta
		response = lista_diretores

	except Exception as e:
		response = {'Erro': str(e)}

	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Pegar diretores de um filme
def get_diretores_por_filme(filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca todas os diretores relacionados ao filme
		cursor.execute('''
			SELECT diretores.id, diretores.nome
			FROM filme_diretor
			JOIN diretores ON filme_diretor.diretor_id = diretores.id
			WHERE filme_diretor.filme_id = %s
		''', (filme_id,))
		diretores = cursor.fetchall()
		
		# se não tiver diretores cadastrados para o filme
		if not diretores:
			response = {'Mensagem': 'Nenhum diretor encontrado para este filme'}
		
		else:
			# monta a lista de diretores como objetos
			lista_diretores = []
			for diretor in diretores:
				lista_diretores.append({
				'id': diretor[0],
				'nome': diretor[1]
			})

			# resposta
			response = lista_diretores

	except Exception as e:
		response = {'Erro': str(e)}

	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Buscar diretor por nome
def get_director_name(nome):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca o diretor no banco
		cursor.execute('SELECT * FROM diretores WHERE diretores.nome LIKE %s', (f"%{nome}%",))
		diretor = cursor.fetchone()

		# diretor não encontrado
		if not diretor:
			response = {'Mensagem': 'Diretor não encontrado'}
			return response

		# resposta com os dados do diretor
		response = {
			'id': diretor[0], 
			'nome': diretor[1],  
		}
	
	except Exception as e:
		response = {'Erro': str(e)}
	

	finally:
		cursor.close()
		conn.close()

	return response