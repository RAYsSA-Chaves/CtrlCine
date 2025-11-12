# Hash de senhas e geração de token

from pwdlib import PasswordHash
import jwt
import datetime
from datetime import timezone, timedelta  # timedelta -> armazena quantidades de tempo


# Configurações para o hash
pwd_context = PasswordHash.recommended()  # ele decide sozinho como hashear

# Configurações para o token
SECRET_KEY = 'my_super_secret_key'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7


# Função para hashear uma senha
def get_password_hash(password: str):
    return pwd_context.hash(password)

# Função para validar uma senha passada com uma senha hasheada guardada no banco
def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)

# ------------------------------------

# Função para gerar um token
def create_access_token(user_id: int, role: str):
    now = datetime.datetime.now(timezone.utc)
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # informações para guardar sobre o token e o usuário:
    payload = {
        'sub': user_id,
        'role': role,
        'type': 'access',
        'exp': expire
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

# Função para gerar um token de refresh
def create_refresh_token(user_id: int):
    now = datetime.datetime.now(timezone.utc)
    expire = now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        'sub': user_id,
        'type': 'refresh',
        'exp': expire
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

# Centralizando função para decodificar o token
def decode_token(token: str):
    """
    Decodifica o token e retorna o payload -> dict
    Lança jwt.ExpiredSignatureError se expirou,
    lança jwt.InvalidTokenError se inválido
    """
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

# Centralizando formato para mensagens de erro
class TokenError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

# Função para validar o token (para realização de requisições)
def verify_access_token(token: str):
    try:
        payload = decode_token(token)
        if payload.get('type') != 'access':
            raise TokenError('Tipo de token inválido')
        
        return payload
    
    except jwt.ExpiredSignatureError:
        raise TokenError('Token expirado')
    except jwt.InvalidTokenError:
        raise TokenError('Token inválido')

# Função para validar o refresh token (para gerar novo token)
def verify_refresh_token(token: str):
    try:
        payload = decode_token(token)
        if payload.get('type') != 'refresh':
            raise TokenError('Tipo de token inválido')
        
        return payload
    
    except jwt.ExpiredSignatureError:
        raise TokenError('Token de atualização expirado')
    except jwt.InvalidTokenError:
        raise TokenError('Token de atualização inválido')
