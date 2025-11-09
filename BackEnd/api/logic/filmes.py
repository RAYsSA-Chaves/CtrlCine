# Lógica das requisições de filmes

import json

from core.database import get_connection
from api.logic.atores import get_atores_por_filme, get_actor_name
from api.logic.diretores import get_diretores_por_filme, get_director_name
from api.logic.generos import get_generos_por_filme, get_genre_name
from api.logic.produtoras import get_produtoras_por_filme, get_producer_name


# Pegar todos os filmes (ou filtrados)
def get_movies(filters):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		query = 'SELECT * FROM filmes'
		joins = []
		conds = []
		params = []

		# filtro por ator
		if 'ator' in filters:
			ator = get_actor_name(filters['ator'])
			if 'id' in ator:
				joins.append('JOIN filme_ator ON filme_ator.filme_id = filmes.id')
				conds.append('filme_ator.ator_id = %s')
				params.append(ator['id'])
			else:
				return {'Mensagem': 'Ator não encontrado'}
		
		# filtro por diretor
		if 'diretor' in filters:
			diretor = get_director_name(filters['diretor'])
			if 'id' in diretor:
				joins.append('JOIN filme_diretor ON filme_diretor.filme_id = filmes.id')
				conds.append('filme_diretor.diretor_id = %s')
				params.append(diretor['id'])
			else:
				return {'Mensagem': 'Diretor não encontrado'}
			
		# filtro por produtora
		if 'produtora' in filters:
			prod = get_producer_name(filters['produtora'])
			if 'id' in prod:
				joins.append('JOIN filme_produtora ON filme_produtora.filme_id = filmes.id')
				conds.append('filme_produtora.produtora_id = %s')
				params.append(prod['id'])
			else:
				return {'Mensagem': 'Produtora não encontrada'}
			
		# filtro por gênero
		if 'genero' in filters:
			gen = get_genre_name(filters['genero'])
			if 'id' in gen:
				joins.append('JOIN filme_genero ON filme_genero.filme_id = filmes.id')
				conds.append('filme_genero.genero_id = %s')
				params.append(gen['id'])
			else:
				return {'Mensagem': 'Gênero não encontrado'}
			
		# filtro por ano
		if 'ano' in filters:
			conds.append('YEAR(filmes.lancamento) = %s')
			params.append(filters['ano'])

		# filtro por nota
		if 'nota' in filters:
			conds.append('filmes.nota_ctrlcine = %s')
			params.append(filters['nota'])
		
		# busca por título
		if 'titulo' in filters:
			conds.append('filmes.titulo COLLATE utf8mb4_unicode_ci LIKE %s')
			params.append(f'%{filters["titulo"]}%')

		# filmes em alta
		if 'em_alta' in filters:
			conds.append('filmes.em_alta = TRUE')

		# filmes não lançados
		if 'lancamento' in filters:
			conds.append('filmes.lancamento > CURRENT_DATE()')

		# query final
		if joins:
			query += ' ' + ' '.join(joins)
		if conds:
			query += ' WHERE ' + ' AND '.join(conds)
		query += ' ORDER BY filmes.lancamento DESC'

		cursor.execute(query, params)
		filmes = cursor.fetchall()

		# nenhum filme encontrado
		if not filmes:
			response = {'Mensagem': 'Nenhum filme encontrado'}

		else:
			# monta lista de filmes como dicionário
			response = []
			for f in filmes:
				response.append({
					'id': f[0],
					'titulo': f[1],
					'capa_vertical': f[3],
					'lancamento': f[4].isoformat(),
					'em_alta': f[9],
					'nota_ctrlcine': f[10]
				})

	except Exception as e:
		response = {"Erro": str(e)}

	finally:
		cursor.close()
		conn.close()

	return response

# ---------------------------------------------

# Pegar filme específico
def get_filme_por_id(filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# pega infos básicas do filme 
		cursor.execute('SELECT * FROM filmes WHERE id = %s', (filme_id,))
		filme = cursor.fetchone()

		if not filme:
			response = {'Erro': 'Filme não encontrado.'}
		else:
			atores = get_atores_por_filme(filme_id)  # pega atores do filme
			produtoras = get_produtoras_por_filme(filme_id) # pega prdutoras do filme
			diretor = get_diretores_por_filme(filme_id)  # pega diretor do filme
			generos = get_generos_por_filme(filme_id)  # pega gêneros do filme

			# monta a resposta
			response = {
				'id': filme[0],
				'titulo': filme[1],
				'capa_horizontal': filme[2],
				'capa_vertical': filme[3],
				'lancamento': filme[4].isoformat(),
				'duracao': filme[5],
				'sinopse': filme[6],
				'trailer': filme[7],
				'nota_imdb': filme[8],
				'atores': atores,
				'diretor': diretor,
				'produtoras': produtoras,
				'generos': generos
			}

	# erro
	except Exception as e:
		response = {'Erro': str(e)}

	# fecha conexão com banco e retorna o filme completo
	finally:
			cursor.close()
			conn.close()
			return response

# ---------------------------------------------

# Cadastrar novo filme
def cadastrar_filme(filme):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# salva novo filme no banco
		cursor.execute('''
			INSERT INTO filmes (titulo, capa_horizontal, capa_vertical, lancamento, duracao, sinopse, trailer, nota_imdb)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
		''', (filme['titulo'],
			filme['capa_horizontal'],
			filme['capa_vertical'],
			filme['lancamento'],
			filme['duracao'],
			filme['sinopse'],
			filme['trailer'],
			filme['nota_imdb']))
		conn.commit()

		# pega ID do filme inserido
		novo_filme = cursor.lastrowid

		# inserções nas tabelas intermediárias
		for ator in filme['atores']:
			cursor.execute('INSERT INTO filme_ator (filme_id, ator_id) VALUES (%s, %s)', (novo_filme, ator))

		for diretor in filme['diretor']:
			cursor.execute('INSERT INTO filme_diretor (filme_id, diretor_id) VALUES (%s, %s)', (novo_filme, diretor))
			
		for produtora in filme['produtoras']:
			cursor.execute('INSERT INTO filme_produtora (filme_id, produtora_id) VALUES (%s, %s)', (novo_filme, produtora))

		for genero in filme['generos']:
			cursor.execute('INSERT INTO filme_genero (filme_id, genero_id) VALUES (%s, %s)', (novo_filme, genero))
		
		conn.commit()

		# busca o nome do filme para retornar
		cursor.execute('SELECT titulo FROM filmes WHERE id = %s', (novo_filme,))
		filme = cursor.fetchone()

		# resposta
		response = {'Mensagem': f'Filme {filme[0]} cadastrado com sucesso!'}	

	except Exception as e:
		response = {'Erro': str(e)}

	finally:
		cursor.close()
		conn.close()
		return response
	
# ---------------------------------------------
	
# Edição de filme existente
def update_movie(filme, filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# atualiza o filme no banco
		cursor.execute('''
			UPDATE filmes
			SET titulo=%s, capa_horizontal=%s, capa_vertical=%s, lancamento=%s, duracao=%s, sinopse=%s, trailer=%s
			WHERE id=%s
		''', (filme['titulo'],
			filme['capa_horizontal'],
			filme['capa_vertical'],
			filme['lancamento'],
			filme['duracao'],
			filme['sinopse'],
			filme['trailer'],
			filme_id))
		conn.commit()

		# limpa as relações antigas e insere as novas
		cursor.execute('DELETE FROM filme_ator WHERE filme_id=%s', (filme_id,))
		cursor.execute('DELETE FROM filme_diretor WHERE filme_id=%s', (filme_id,))
		cursor.execute('DELETE FROM filme_produtora WHERE filme_id=%s', (filme_id,))
		cursor.execute('DELETE FROM filme_genero WHERE filme_id=%s', (filme_id,))

		for ator in filme['atores']:
			cursor.execute('INSERT INTO filme_ator (filme_id, ator_id) VALUES (%s, %s)', (filme_id, ator))

		for diretor in filme['diretor']:
			cursor.execute('INSERT INTO filme_diretor (filme_id, diretor_id) VALUES (%s, %s)', (filme_id, diretor))

		for produtora in filme['produtoras']:
			cursor.execute('INSERT INTO filme_produtora (filme_id, produtora_id) VALUES (%s, %s)', (filme_id, produtora))
			
		for genero in filme['generos']:
			cursor.execute('INSERT INTO filme_genero (filme_id, genero_id) VALUES (%s, %s)', (filme_id, genero))

		conn.commit()

		# busca o nome do filme para retornar
		cursor.execute('SELECT titulo FROM filmes WHERE id = %s', (filme_id,))
		filme = cursor.fetchone()

		# resposta
		response = {'Mensagem': f'Filme {filme[0]} atualizado com sucesso!'}

	except Exception as e:
		response = {'Erro': str(e)}

	finally:
		cursor.close()
		conn.close()
		return response
	
# ---------------------------------------------

# Deletar filme
def delete(filme_id):
	conn = get_connection()
	cursor = conn.cursor()

	try:
		# deleta filme do banco
		cursor.execute('DELETE FROM filmes WHERE id =  %s', (filme_id,))
		conn.commit()

        # retorno para o usuário
		if cursor.rowcount > 0:  # quantas linhas foram afetadas pela última execução de comando SQL
			response = {'Mensagem': 'Filme removida com sucesso'}
		else:
			response = {'Erro': 'Filme não encontrada'}
	
    # erro
	except Exception as e:
		response = {'Erro': str(e)}
	
    # ecerra conexão com o banco
	finally:
		cursor.close()
		conn.close()
		return response