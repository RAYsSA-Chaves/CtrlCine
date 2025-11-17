# Lógica das requisições de listas

from core.database import get_connection


# Criar nova lista
def create_list(usuario_id, nome):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            'INSERT INTO listas (nome, usuario_id) VALUES (%s, %s)',
            (nome, usuario_id)
        )
        conn.commit()

        # pega o id gerado automaticamente
        novo_id = cursor.lastrowid

        response = {
            'id': novo_id,
            'nome': nome
        }

    except Exception as e:
        response = {'Erro': str(e)}

    finally:
        cursor.close()
        conn.close()
        return response

# -------------------------------------------------------------

# Salvar filme em uma lista
def add_movie_to_list(lista_id, filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# verifica se o filme já está na lista
		cursor.execute('SELECT id FROM filmes_listas WHERE lista_id=%s AND filme_id=%s', (lista_id, filme_id))
		existe = cursor.fetchone()
		if existe:
			response = {'Erro': 'Este filme já está nesta lista!'}
			
		else:
			# adiciona se não existe
			cursor.execute('INSERT INTO filmes_listas (lista_id, filme_id) VALUES (%s, %s)', (lista_id, filme_id))
			conn.commit()
			response = {'Mensagem': 'Filme adicionado à lista com sucesso!'}
			
	except Exception as e:
		response = {'Erro': str(e)}
		
	finally:
		cursor.close()
		conn.close()
		return response

# -------------------------------------------------------------

# Remover filme da lista
def remover_filme_lista(lista_id, filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# deleta a lista do banco
		cursor.execute('DELETE FROM filmes_listas WHERE lista_id=%s AND filme_id=%s', (lista_id, filme_id))
		conn.commit()
		if cursor.rowcount > 0:
			response = {'Mensagem': 'Filme removido da lista'}
		else:
			response = {'Erro': 'Filme não encontrado nesta lista'}
			
	except Exception as e:
		response = {'Erro': str(e)}
		
	finally:
		cursor.close()
		conn.close()
		return response

# -------------------------------------------------------------

# Editar nome da lista
def edit_list(lista_id, novo_nome):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# atualiza lista no banco
		cursor.execute('UPDATE listas SET nome=%s WHERE id=%s', (novo_nome, lista_id))
		conn.commit()
		if cursor.rowcount > 0:
			response = {'Mensagem': 'Lista atualizada com sucesso!'}
		else:
			response = {'Erro': 'Lista não encontrada'}
			
	except Exception as e:
		response = {'Erro': str(e)}
		
	finally:
		cursor.close()
		conn.close()
		return response

# -------------------------------------------------------------

# Deletar lista
def delete_list(lista_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# deleta a lista do banco
		cursor.execute('DELETE FROM listas WHERE id=%s', (lista_id,))
		conn.commit()
		if cursor.rowcount > 0:
			response = {'Mensagem': 'Lista deletada com sucesso!'}
		else:
			response = {'Erro': 'Lista não encontrada'}
			
	except Exception as e:
		response = {'Erro': str(e)}
		
	finally:
		cursor.close()
		conn.close()
		return response

# -------------------------------------------------------------

# Listar todas as listas de um usuário (com capa)
def get_listas_usuario(usuario_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega listas do usuário
		cursor.execute('SELECT id, nome FROM listas WHERE usuario_id=%s', (usuario_id,))
		listas = cursor.fetchall()

        # monta lista de listas como dicionário
		response = []
		for lista in listas:
			lista_id = lista[0]
			nome = lista[1]

			# pega o último filme adicionado para usar como capa
			cursor.execute('''
				SELECT filmes.capa_vertical 
				FROM filmes_listas
				JOIN filmes ON filmes_listas.filme_id = filmes.id
				WHERE filmes_listas.lista_id = %s
				ORDER BY filmes_listas.id DESC
				LIMIT 1
			''', (lista_id,))
			capa = cursor.fetchone()
			capa_url = capa[0] if capa else None

			response.append({
				'id': lista_id,
				'nome': nome,
				'capa': capa_url
			})
			
	except Exception as e:
		response = {'Erro': str(e)}
		
	finally:
		cursor.close()
		conn.close()
		return response