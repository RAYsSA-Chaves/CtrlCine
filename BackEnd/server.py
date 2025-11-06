# Servidor das rotas da api
from core.configs import Settings
from api.logic.filmes import listar_filmes
from api.logic.atores import cadastrar_ator

from http.server import SimpleHTTPRequestHandler, HTTPServer
import json

API = Settings.API_STR

class MyHandler(SimpleHTTPRequestHandler):
    # Centralizando função de retorno dos endpoints
    def enviar_json(self, status, conteudo):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(conteudo).encode())

    # Rotas GET
    def do_GET(self):
        if self.path == f'{API}/filmes':
            filmes = listar_filmes()
            self.wfile.write(json.dumps(filmes, ensure_ascii=False).encode())

        else if self.path == f'{API}/filmes/{filme_id}':
            

        else:
            self.send_response(404)
            self.wfile.write(json.dumps({"erro": "Rota não encontrada"}).encode())

    # Rotas POST
    def do_POST(self):
        # Cadastro de ator
        if self.path == f'{API}/atores':
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length)
            dados = json.loads(body)

            nome = dados.get("nome")
            foto = dados.get("foto")

            response = cadastrar_ator(nome, foto)

            print(response)
            if "Erro" in response:
                self.enviar_json(400, response)
            else:
                self.enviar_json(200, response)


# Servidor
def run():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, MyHandler)
    print("Servidor rodando em http://localhost:8000")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
