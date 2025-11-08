# Lógica das solicitações do usuários

import json

from core.database import get_connection


# Listar todas as solicitações
def listar_solicitacoes():
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega todas as solicitações no banco
		cursor.execute('SELECT * FROM solicitacoes')
		rows = cursor.fetchall()

        # monta a lista de solicitações como objetos
		solicitacoes = []
		for row in rows:
			solicitacoes.append({
				'id': row[0],
				'usuario_id': row[1],
				'filme': json.loads(row[2]),
				'tipo': row[3],
				'aceito': row[4]
			})
		# resposta
		response = solicitacoes

    # erro
	except Exception as e:
		response = {'Erro': str(e)}

    # encerra conexão com o banco	
	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Pegar solicitação específica
def get_solicitacao_por_id(solicitacao_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega infos da solicitação 
		cursor.execute('SELECT * FROM solicitacoes WHERE id = %s', (solicitacao_id,))
		solicitacao = cursor.fetchone()

		if not solicitacao:
			response = {'Erro': 'Solicitação não encontrada.'}
		else:
			# monta a resposta
			response = {
				'id': solicitacao[0],
				'usuario_id': solicitacao[1],
				'filme': json.loads(solicitacao[2]),
				'tipo': solicitacao[3],
				'aceito': solicitacao[4]
			}

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# fecha conexão com banco e retorna a solicitação
	finally:
			cursor.close()
			conn.close()
			return response

# ---------------------------------------------

# Criar nova solicitação
def criar_solicitacao(usuario_id, filme_json, tipo):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# campos únicos para verificar duplicidade
		campos_unicos = {
			'titulo': filme_json.get('titulo'),
			'capa_horizontal': filme_json.get('capa_horizontal'),
			'capa_vertical': filme_json.get('capa_vertical'),
			'trailer': filme_json.get('trailer')
		}

		# verificar se já existe
		for campo, valor in campos_unicos.items():
			cursor.execute(f"SELECT id FROM filmes WHERE {campo} = %s", (valor,))
			existe = cursor.fetchone()
			if existe:
				response = {'Erro': f'Já existe um filme cadastrado com o mesmo {campo}'}
				return response  # barra a operação

		# guarda a solicitação na tabela no banco
		cursor.execute('''
            INSERT INTO solicitacoes (usuario_id, filme, tipo)
			VALUES (%s, %s, %s)
        ''', (usuario_id, json.dumps(filme_json, ensure_ascii=False), tipo))
		conn.commit()
		
        # ID da solicitação inserida
		id_solicitacao = cursor.lastrowid
		
        # busca a solicitação para retornar
		cursor.execute('SELECT * FROM solicitacoes WHERE id = %s', (id_solicitacao,))
		solicitacao = cursor.fetchone()
		
        # monta a resposta
		response = {
			'Mensagem': 'Solicitação enviada com sucesso!',
			'id': solicitacao[0], 
			'usuario_id': solicitacao[1] ,
            'filme': json.loads(solicitacao[2])['titulo'],
			'tipo': solicitacao[3]
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

# Recusar/deletar solicitação
def recusar_solicitacao(solicitacao_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# deleta solicitação do banco
		cursor.execute('DELETE FROM solicitacoes WHERE id =  %s', (solicitacao_id,))
		conn.commit()

        # retorno para o usuário
		if cursor.rowcount > 0:  # quantas linhas foram afetadas pela última execução de comando SQL
			response = {'Mensagem': 'Solicitação removida com sucesso'}
		else:
			response = {'Erro': 'Solicitação não encontrada'}
	
    # erro
	except Exception as e:
		response = {'Erro': str(e)}
	
    # ecerra conexão com o banco
	finally:
		cursor.close()
		conn.close()
		return response

# ---------------------------------------------

# Atualizar solicitaçõoes aceitas 
def aceitar_solicitacao(solicitacao_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		cursor.execute('UPDATE solicitacoes SET aceito=TRUE WHERE id=%s', (solicitacao_id,))
		conn.commit()
	except Exception as e:
		print('Erro ao atualizar status da solicitação:' + str(e))
	finally:
		cursor.close()
		conn.close()
		return