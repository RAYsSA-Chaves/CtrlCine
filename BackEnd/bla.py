from core.database import get_connection
from controllers.atores import get_actor_name
from controllers.diretores import get_director_name
from controllers.produtoras import get_producer_name
from controllers.generos import get_genre_name

def get_filmes_filtrados(filters):
	conn = get_connection()
	cursor = conn.cursor(dictionary=True)

	try:
		query = "SELECT DISTINCT filmes.* FROM filmes"
		joins = []
		conds = []
		params = []

		# ---- FILTRO POR ATOR ----
		if "ator" in filters:
			ator = get_actor_name(filters["ator"])
			if "id" in ator:
				joins.append("JOIN filme_ator ON filmes.id = filme_ator.filme_id")
				conds.append("filme_ator.ator_id = %s")
				params.append(ator["id"])
			else:
				return {"Mensagem": "Ator não encontrado"}

		# ---- FILTRO POR DIRETOR ----
		if "diretor" in filters:
			diretor = get_director_name(filters["diretor"])
			if "id" in diretor:
				joins.append("JOIN filme_diretor ON filmes.id = filme_diretor.filme_id")
				conds.append("filme_diretor.diretor_id = %s")
				params.append(diretor["id"])
			else:
				return {"Mensagem": "Diretor não encontrado"}

		# ---- FILTRO POR PRODUTORA ----
		if "produtora" in filters:
			prod = get_producer_name(filters["produtora"])
			if "id" in prod:
				joins.append("JOIN filme_produtora ON filmes.id = filme_produtora.filme_id")
				conds.append("filme_produtora.produtora_id = %s")
				params.append(prod["id"])
			else:
				return {"Mensagem": "Produtora não encontrada"}

		# ---- FILTRO POR GÊNERO ----
		if "genero" in filters:
			gen = get_genre_name(filters["genero"])
			if "id" in gen:
				joins.append("JOIN filme_genero ON filmes.id = filme_genero.filme_id")
				conds.append("filme_genero.genero_id = %s")
				params.append(gen["id"])
			else:
				return {"Mensagem": "Gênero não encontrado"}

		# ---- FILTRO POR ANO ----
		if "ano" in filters:
			conds.append("YEAR(filmes.lancamento) = %s")
			params.append(filters["ano"])

		# ---- FILTRO POR NOTA ----
		if "nota" in filters:
			conds.append("filmes.nota_ctrlcine >= %s")
			params.append(filters["nota"])

		# ---- FILTRO POR TÍTULO ----
		if "titulo" in filters:
			conds.append("filmes.titulo LIKE %s")
			params.append(f"%{filters['titulo']}%")

		# Monta query final
		if joins:
			query += " " + " ".join(joins)
		if conds:
			query += " WHERE " + " AND ".join(conds)
		query += " ORDER BY filmes.lancamento DESC"

		cursor.execute(query, params)
		filmes = cursor.fetchall()

		if not filmes:
			response = {"Mensagem": "Nenhum filme encontrado com esses filtros"}
		else:
			response = filmes

	except Exception as e:
		response = {"Erro": str(e)}

	finally:
		cursor.close()
		conn.close()

	return response
