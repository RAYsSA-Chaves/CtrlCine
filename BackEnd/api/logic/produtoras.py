# Lógica das requisições de produtoras

from core.database import get_connection


# Cadastro de ator
def cadastrar_produtora(nome):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# verifica se o produtora já existe
		cursor.execute('SELECT * FROM produtoras WHERE nome = %s', (nome,))
		produtora_existente = cursor.fetchone()

		# se já existe retorna erro
		if produtora_existente:
			response = {'Erro': 'Produtora já cadastrada'}
			return response
	
		# insere nova produtora
		cursor.execute('''
			INSERT INTO produtoras (nome) 
			VALUES (%s)
		''', (nome,))
		conn.commit()
		
		# pega ID da produtora inserida
		id_prod = cursor.lastrowid

		# busca o ator para retornar
		cursor.execute('SELECT * FROM produtoras WHERE id = %s', (id_prod,))
		produtora = cursor.fetchone()

		# resposta com os dados do ator
		response = {
			'Mensagem': 'Produtora cadastrada com sucesso!',
			'id': produtora[0], 
			'nome': produtora[1] 
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

# Listar todas as produtoras
def list_all_producers():
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega todas as produtoras
		cursor.execute('SELECT * FROM produtoras ORDER BY nome ASC')
		produtoras = cursor.fetchall()

		# monta a lista de produtoras como objetos
		lista_produtoras = []
		for prod in produtoras:
			lista_produtoras.append({
			'id': prod[0],
			'nome': prod[1]
		})
			
		# resposta
		response = lista_produtoras

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
def get_produtoras_por_filme(filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca todas as produtoras relacionados ao filme
		cursor.execute('''
			SELECT produtoras.id, produtoras.nome
			FROM filme_produtora
			JOIN produtoras ON filme_produtora.produtora_id = produtoras.id
			WHERE filme_produtora.filme_id = %s
		''', (filme_id,))
		produtoras = cursor.fetchall()
		
		# se não tiver produtoras cadastrados para o filme
		if not produtoras:
			response = {'Mensagem': 'Nenhuma produtora encontrada para este filme'}
		
		else:
			# monta a lista de produtoras como objetos
			lista_produtoras = []
			for prod in produtoras:
				lista_produtoras.append({
				'id': prod[0],
				'nome': prod[1]
			})

			# resposta
			response = lista_produtoras

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Buscar produtora por nome
def get_producer_name(nome):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# busca a produtoa no banco
		cursor.execute('SELECT * FROM produtoras WHERE produtoras.nome = %s', (nome,)) 
		produtora = cursor.fetchone()

		# produtora não encontrada
		if not produtora:
			response = {'Mensagem': 'Produtora não encontrada'}
			return response

		# resposta com os dados da produtora
		response = {
			'id': produtora[0], 
			'nome': produtora[1],  
		}
	
	# erro
	except Exception as e:
		response = {'Erro': str(e)}
	
	# encerra conexão com banco
	finally:
		cursor.close()
		conn.close()

	return response