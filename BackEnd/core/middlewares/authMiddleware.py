# Middleware de autenticação do token para autorizar (ou não) requisições

from core.security import verify_access_token, TokenError


def autenticar(handler):
    auth_header = handler.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None  # usuário não autenticado

    token = auth_header.split(' ')[1]
    try:
        payload = verify_access_token(token)
        return payload  # retorna o conteúdo do token (ex: id, nome, role)
    except TokenError as e:
        return {'Erro': e.message}  # erro do token → retorna erro específico
