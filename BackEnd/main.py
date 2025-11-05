# Lógica principal de todas as rotas

from api.endpoints.filmes import listar_filmes
from api.endpoints.users import listar_usuarios

from http.server import SimpleHTTPRequestHandler, HTTPServer
import json

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Cabeçalhos comuns
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        # Rotas GET
        if self.path == '/api/filmes':
            filmes = listar_filmes()
            self.wfile.write(json.dumps(filmes, ensure_ascii=False).encode())

        elif self.path == '/api/usuarios':
            usuarios = listar_usuarios()
            self.wfile.write(json.dumps(usuarios, ensure_ascii=False).encode())

        else:
            self.send_response(404)
            self.wfile.write(json.dumps({"erro": "Rota não encontrada"}).encode())

# Servidor
def run():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, MyHandler)
    print("Servidor rodando em http://localhost:8000")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
