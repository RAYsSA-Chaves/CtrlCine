# Middleware de autenticação do token para autorizar (ou não) requisições

from security import verify_access_token


def autenticar(handler):
    auth_header = handler.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None  # usuário não autenticado

    token = auth_header.split(' ')[1]
    payload = verify_access_token(token)
    if not payload:
        return None

    return payload  # retorna o conteúdo do token (ex: id, nome, role)
