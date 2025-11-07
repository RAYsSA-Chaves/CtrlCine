# Servidor das rotas da api
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

from core.configs import Settings
from api.logic.filmes import get_filme_por_id
from api.logic.atores import cadastrar_ator, list_all_actors

API = Settings.API_STR

class MyHandler(BaseHTTPRequestHandler):
    # Centralizando função de leitura do body da requisição (para POST e PUT)
    def read_body(self):
        content_length = int(self.headers["Content-Length"])  # lê o tamanho do corpo da requisição e converte bytes -> int
        body = self.rfile.read(content_length)  # lê o arquivo onde o python guarda o corpo da requisição recebida até onde ele termina (content_length)
        dados = json.loads(body)  # converte JSON recebido em um objeto python
        return dados

# ---------------------------------------------
        
    # Centralizando função de retorno dos endpoints
    def enviar_json(self, status, conteudo):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(conteudo, ensure_ascii=False).encode('utf-8'))  # converte objeto python em JSON

# ---------------------------------------------

    # Rotas GET
    def do_GET(self):
        # Sempre redireciona para '/api'
        if self.path == '/':
            self.send_response(302) # status code de redirecionamento temporário = o recurso solicitado foi movido para outra URL por um período
            self.send_header('Location', API)
            self.end_headers()

# ---------------------------------------------

        # Página inicial
        elif self.path == f'{API}':
            self.enviar_json(200, {'Menssagem': 'Olá, mundo! Estou funcionando :)'})

# ---------------------------------------------

        # Listagem de filmes
        elif self.path.startswith(f'{API}/filmes'):
            partes = self.path.split("/")

            # /api/filmes -> listar todos os filmes
            if len(partes) == 3:
                ...
            # /api/filmes/id -> pefa filme específico
            elif len(partes) == 4:
                try:
                    filme_id = int(partes[-1])
                except ValueError:
                    self.enviar_json(400, {"Erro": "ID inválido"})
                    return
                    
                filme = get_filme_por_id(filme_id)
                self.enviar_json(200, filme)
                
            else:
                self.enviar_json(404, {"Erro": "Rota não encontrada"})

# ---------------------------------------------

        # Listagem de atores
        elif self.path == f'{API}/atores':
            atores = list_all_actors()
            self.enviar_json(200, atores)

# ---------------------------------------------
            
        # Rota inválida
        else:
            self.enviar_json(404, {'Erro': 'Rota não encontrada'})


    # Rotas POST
    def do_POST(self):
        # Cadastro de ator
        if self.path == f'{API}/atores':
            dados = self.read_body()
            nome = dados["nome"]
            foto = dados["foto"]

            response = cadastrar_ator(nome, foto)

            if "Erro" in response:
                self.enviar_json(400, response)
            else:
                self.enviar_json(200, response)

# ---------------------------------------------
                
        # Rota inválida
        else:
            self.enviar_json(404, {'Erro': 'Rota não encontrada'})


# Iniciar servidor
def run():
    server_address = ('', 8000)  # define endereço e porta do servidor
    httpd = HTTPServer(server_address, MyHandler)  # cria o servidor HTTP usando a classe MyHandler
    print("Server Running in http://localhost:8000")  # exibe URL do server
    httpd.serve_forever()  # inicia o servidor e mantém rodando

run()
