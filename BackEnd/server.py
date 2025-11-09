# Servidor das rotas da api 

from http.server import BaseHTTPRequestHandler, HTTPServer 
import json 
from urllib.parse import urlparse, parse_qs 

from core.configs import Settings 
from api.logic.filmes import get_filme_por_id, get_movies, cadastrar_filme, update_movie, delete_movie 
from api.logic.atores import cadastrar_ator, list_all_actors 
from api.logic.produtoras import list_all_producers, cadastrar_produtora 
from api.logic.generos import list_all_genres 
from api.logic.diretores import list_all_directors, cadastrar_diretor 
from api.logic.solicitacoes import listar_solicitacoes, criar_solicitacao, recusar_solicitacao, aceitar_solicitacao, get_solicitacao_por_id 
from api.logic.avaliacoes import listar_avaliacoes_filme, adicionar_avaliacao, get_avaliacao_usuario 

''' 
Exemplos de retornos: 
- urlparse (partes da url): 
ParseResult( 
	path='/filmes', 
    params='', 
    query='ano=2000&lang=pt&lang=en', 
    fragment='' 
) 

- parse_qs (transforma algo em dicionáario python com valores sempre como listas): 
{'ano': ['2000'], 'lang': ['pt', 'en']} 
''' 


API = Settings.API_STR 

class MyHandler(BaseHTTPRequestHandler): 
    # Centralizando função de leitura do body da requisição (para POST e PUT) 
	def read_body(self): 
		content_length = int(self.headers['Content-Length']) # lê o tamanho do corpo da requisição e converte bytes -> int 
		body = self.rfile.read(content_length) # lê o arquivo onde o python guarda o corpo da requisição recebida até onde ele termina (content_length) 
		dados = json.loads(body) # converte JSON recebido em um objeto python 
		return dados 
	
	# --------------------------------------------- 
	
	# Centralizando função de retorno dos endpoints 
	def enviar_json(self, status, conteudo): 
		self.send_response(status) 
		self.send_header('Content-Type', 'application/json') 
		self.end_headers() 
		self.wfile.write(json.dumps(conteudo, ensure_ascii=False).encode('utf-8')) # converte objeto python em JSON 
		

	# ==================== Rotas GET ==================== 
	def do_GET(self): 
		# Sempre redireciona para '/api' 
		if self.path == '/': 
			self.send_response(301) # status code de redirecionamento permanente = o recurso solicitado foi movido para outra URL
			self.send_header('Location', API) 
			self.end_headers() 
			
		# --------------------------------------------- 
		
		# Página inicial 
		elif self.path == f'{API}': 
			self.enviar_json(200, {'Mensagem': 'Olá, mundo! Estou funcionando :)'}) 
			
		# --------------------------------------------- 
		
		# Listagem de filmes 
		elif self.path.startswith(f'{API}/filmes'): 
			partes = self.path.split('/') 
			
			# /api/filmes -> listar todos os filmes ou filtrados 
			if len(partes) == 3: 
				# extrair query params 
				url_info = urlparse(self.path) 
				query_params = parse_qs(url_info.query) 
				
				# dicionário de filtros possíveis 
				filters = { 
					'ator': query_params.get('ator', [None])[0], 
					'diretor': query_params.get('diretor', [None])[0], 
					'produtora': query_params.get('produtora', [None])[0], 
					'genero': query_params.get('genero', [None])[0], ''
					'ano': query_params.get('ano', [None])[0], 
					'nota': query_params.get('nota', [None])[0], 
					'titulo': query_params.get('titulo', [None])[0], 
					'em_alta': query_params.get('em_alta', [None])[0], 
					'lancamento': query_params.get('lancamento', [None])[0] } 
				
				# remover filtros None (não informados) 
				novo_dict = {} 
				for k, v in filters.items(): 
					if v is not None: 
						novo_dict[k] = v 
				filters = novo_dict 
				
				# busca filmes 
				filmes = get_movies(filters) 
				self.enviar_json(200, filmes) 
			
			
			# /api/filmes/id -> filme específico 
			elif len(partes) == 4: 
				try: 
					filme_id = int(partes[-1]) # -1 = último item 
				except ValueError: 
					self.enviar_json(400, {'Erro': 'ID inválido'}) 
					return 
				
				filme = get_filme_por_id(filme_id) 
				self.enviar_json(200, filme) 
			
			
			else: self.enviar_json(404, {'Erro': 'Rota não encontrada'}) 
			
		# --------------------------------------------- 

		# Listagem de atores 
		elif self.path == f'{API}/atores': 
			atores = list_all_actors() 
			self.enviar_json(200, atores) 
			
		# ---------------------------------------------
		 
		# Listagem de produtoras 
		elif self.path == f'{API}/produtoras': 
			produtoras = list_all_producers() 
			self.enviar_json(200, produtoras) 
			
		# --------------------------------------------- 
		
		# Listagem de gêneros 
		elif self.path == f'{API}/generos': 
			generos = list_all_genres() 
			self.enviar_json(200, generos) 
			
		# --------------------------------------------- 
		
		# Listagem de diretores 
		elif self.path == f'{API}/diretores': 
			diretores = list_all_directors() 
			self.enviar_json(200, diretores) 
			
		# --------------------------------------------- 
		
		# Listagem de solicitações 
		elif self.path.startswith(f'{API}/solicitacoes'): 
			partes = self.path.split('/') 
			
			# /api/solicitacoes -> listar todas as solicitações 
			if len(partes) == 3: 
				solicitacoes = listar_solicitacoes() 
				self.enviar_json(200, solicitacoes) 
				
			# /api/solicitacoes/id -> solicitação específica 
			elif len(partes) == 4: 
				try: 
					solicitacao_id = int(partes[-1]) 
				except ValueError: 
					self.enviar_json(400, {'Erro': 'ID inválido'}) 
					return 
				
				solicitacao = get_solicitacao_por_id(solicitacao_id) 
				self.enviar_json(200, solicitacao) 

			else: self.enviar_json(404, {'Erro': 'Rota não encontrada'}) 
			
		# --------------------------------------------- 
		
		# Listagem de avaliações por filme 
		elif self.path.startswith(f'{API}/avaliacoes/filme/'): 
			try: 
				filme_id = int(self.path.split('/')[-1]) 
			except ValueError: 
				self.enviar_json(400, {'Erro': 'ID inválido'}) 
				return 
			
			response = listar_avaliacoes_filme(filme_id) 
			
			if 'Erro' in response: 
				self.enviar_json(400, response) 
			else: 
				self.enviar_json(200, response) 
		
		# --------------------------------------------- 
		
		# Avaliação de usuário específico para um filme 
		elif self.path.startswith(f'{API}/avaliacoes/usuario/'): 
			try: 
				usuario_id = int(self.path.split('/')[-2]) 
				filme_id = int(self.path.split('/')[-1]) 
			except ValueError: 
				self.enviar_json(400, {'Erro': 'ID inválido'}) 
				return 
			
			response = get_avaliacao_usuario(usuario_id, filme_id) 
			
			if 'Erro' in response: 
				self.enviar_json(400, response) 
			else: 
				self.enviar_json(200, response) 
		
		# --------------------------------------------- 
		
		# Rota inválida 
		else: 
			self.enviar_json(404, {'Erro': 'Rota não encontrada'}) 
			

	# ==================== Rotas POST ==================== 
	def do_POST(self): 
		# Cadastro de filme 
		if self.path == f'{API}/filmes': 
			dados = self.read_body() 
			filme = dados['filme'] 
			solicitacao_id = dados.get('solicitacao_id', None) 

			response = cadastrar_filme(filme) 
			
			# se for uma solicitação de usuário -> marcar como aceita 
			if solicitacao_id: 
				aceitar_solicitacao(solicitacao_id) 
				
			if 'Erro' in response: 
				self.enviar_json(400, response) 
			else: 
				self.enviar_json(201, response) 
				
		# --------------------------------------------- 
		
		# Cadastro de ator 
		elif self.path == f'{API}/atores': 
			dados = self.read_body() 
			nome = dados['nome'] 
			foto = dados['foto'] 

			response = cadastrar_ator(nome, foto) 
			
			if 'Erro' in response: 
				self.enviar_json(400, response) 
			else: 
				self.enviar_json(201, response) 
				
		# --------------------------------------------- 
		
		# Cadastro de diretor 
		elif self.path == f'{API}/diretores': 
			dados = self.read_body() 
			nome = dados['nome'] 
			
			response = cadastrar_diretor(nome) 
			
			if 'Erro' in response: 
				self.enviar_json(400, response) 
			else: self.enviar_json(201, response) 
			
		# --------------------------------------------- 
		
		# Cadastro de produtora 
		elif self.path == f'{API}/produtoras': 
			dados = self.read_body() 
			nome = dados['nome'] 
			
			response = cadastrar_produtora(nome) 
			
			if 'Erro' in response: 
				self.enviar_json(400, response) 
			else: self.enviar_json(201, response) 
		
		# --------------------------------------------- 
		
		# Nova solicitação 
		elif self.path == f'{API}/solicitacoes': 
			dados = self.read_body() 
			usuario_id = dados['usuario_id'] 
			filme_json = dados['filme'] 
			tipo = dados['tipo'] 
			filme_id = dados.get('filme_id', None) 
			
			response = criar_solicitacao(usuario_id, filme_json, tipo, filme_id) 
			
			if 'Erro' in response:
				self.enviar_json(400, response) 
			else: 
				self.enviar_json(201, response) 
				
		# --------------------------------------------- 
		
		# Nova avaliação de filme 
		elif self.path == f'{API}/avaliacoes': 
			dados = self.read_body() 
			usuario_id = dados['usuario_id'] 
			filme_id = dados['filme_id'] 
			nota = dados['nota'] 
			resenha = dados.get('resenha', None) 

			response = adicionar_avaliacao(usuario_id, filme_id, nota, resenha) 
			
			if 'Erro' in response: 
				self.enviar_json(400, response) 
			else: 
				self.enviar_json(201, response) 
			
		# --------------------------------------------- 

		# Rota inválida 
		else: 
			self.enviar_json(404, {'Erro': 'Rota não encontrada'}) 
			

		# ==================== Rotas PUT ==================== 
		def do_PUT(self): 
			# Edição de filme 
			if self.path.startswith(f'{API}/filmes'): 
				try: 
					filme_id = int(self.path.split('/')[-1]) 
				except ValueError: 
					self.enviar_json(400, {'Erro': 'ID inválido'}) 
					return 
				
				dados = self.read_body() 
				filme = dados['filme'] 
				solicitacao_id = dados.get('solicitacao_id', None) 
				
				response = update_movie(filme, filme_id) 
				
				# se for uma solicitação de usuário -> marcar como aceita 
				if solicitacao_id: 
					aceitar_solicitacao(solicitacao_id) 
					
				if 'Erro' in response: 
					self.enviar_json(400, response) 
				else: 
					self.enviar_json(201, response)

			# --------------------------------------------- 

			# Rota inválida 
			else: 
				self.enviar_json(404, {'Erro': 'Rota não encontrada'})  


		# ==================== Rotas DELETE ==================== 
		def do_DELETE(self): 
			# Deletar filme 
			if self.path.startswith(f'{API}/filmes/'): 
				id_str = self.path.split('/')[-1] 
				try: 
					id_int = int(id_str) 
				except ValueError: 
					self.enviar_json(400, {'Erro': 'ID inválido'}) 
					return 
				
				deletado = delete_movie(id_int)
				self.enviar_json(200, deletado) 
		
			# --------------------------------------------- 
			
			# Solicitação recusada 
			elif self.path.startswith(f'{API}/solicitacoes/'): 
				id_str = self.path.split('/')[-1] 
				try: 
					id_int = int(id_str) 
				except ValueError: 
					self.enviar_json(400, {'Erro': 'ID inválido'}) 
					return 
				
				deletado = recusar_solicitacao(id_int) 
				self.enviar_json(200, deletado) 
				
			# --------------------------------------------- 
			
			# Rota inválida 
			else: self.enviar_json(404, {'Erro': 'Rota não encontrada'}) 
			

# Iniciar servidor 
def run():
	server_address = ('', 8000) # define endereço e porta do servidor 
	httpd = HTTPServer(server_address, MyHandler) # cria o servidor HTTP usando a classe MyHandler
	print('Server Running in http://localhost:8000') # exibe URL do server 
	httpd.serve_forever() # inicia o servidor e mantém rodando 

run()