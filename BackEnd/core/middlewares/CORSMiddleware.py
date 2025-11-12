# CORS Headers

def aplicar_cors(handler):
    handler.send_header('Access-Control-Allow-Origin', 'http://localhost:3000')
    handler.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    handler.send_header('Access-Control-Allow-Credentials', 'true')  # permite o server receber cookies, tokens ou credenciais de domínios diferentes
