# Lógica das avaliações dos usuários

from core.database import get_connection


# Adicionar nova avaliação
def adicionar_avaliacao(usuario_id, filme_id, nota, resenha=None):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# verifica se o usuário já avaliou o filme
		cursor.execute(
			'SELECT id FROM avaliacoes_usuarios WHERE usuario_id=%s AND filme_id=%s',
			(usuario_id, filme_id)
		)
		existe = cursor.fetchone()

		if existe:
			response = {'Erro': 'Você já avaliou este filme'}
		else:
			# insere a avaliação no banco
			cursor.execute('''
				INSERT INTO avaliacoes_usuarios (usuario_id, filme_id, nota, resenha)
				VALUES (%s, %s, %s, %s)
			''', (usuario_id, filme_id, nota, resenha))
			conn.commit()

			response = {'Mensagem': 'Avaliação adicionada com sucesso!'}

	except Exception as e:
		response = {'Erro': str(e)}

	finally:
		cursor.close()
		conn.close()
		return response

# -------------------------------------------------------------

# Listar todas as avaliações de um filme
def listar_avaliacoes_filme(filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega todas as avaliações no banco
		cursor.execute('''
			SELECT avaliacoes_usuarios.id, usuarios.nome, usuarios.foto, avaliacoes_usuarios.nota, avaliacoes_usuarios.resenha
			FROM avaliacoes_usuarios
			JOIN usuarios ON avaliacoes_usuarios.usuario_id = usuarios.id
			WHERE filme_id = %s
			ORDER BY avaliacoes_usuarios.id DESC
		''', (filme_id,))
		rows = cursor.fetchall()

		# monta de lista de avaliações como objetos
		avaliacoes = []
		for row in rows:
			avaliacoes.append({
				'id': row[0],
				'usuario_nome': row[1],
				'usuario_foto': row[2],
				'nota': row[3],
				'resenha': row[4]
			})

		# resposta
		response = avaliacoes

	except Exception as e:
		response = {'Erro': str(e)}

	finally:
		cursor.close()
		conn.close()
		return response

# -------------------------------------------------------------

# Pegar avaliação específica de um usuário para um filme
def get_avaliacao_usuario(usuario_id, filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega avaliação no banco
		cursor.execute('''
			SELECT avaliacoes_usuarios.id, usuarios.nome, avaliacoes_usuarios.nota, avaliacoes_usuarios.resenha
			FROM avaliacoes_usuarios
			JOIN usuarios ON avaliacoes_usuarios.usuario_id = usuarios.id
			WHERE filme_id = %s AND usuario_id = %s
		''', (filme_id, usuario_id))
		row = cursor.fetchone()

		# monta resposta com infos da avaliação como dicionário
		if row:
			response = {
				'id': row[0],
				'usuario_nome': row[1],
				'nota': row[2],
				'resenha': row[3]
			}
		else:
			response = {'Erro': 'Você ainda não avaliou este filme'}

	except Exception as e:
		response = {'Erro': str(e)}

	finally:
		cursor.close()
		conn.close()
		return response
