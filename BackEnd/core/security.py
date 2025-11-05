# Hash de senhas e token

from pwdlib import PasswordHash

pwd_context = PasswordHash.recommended() # ele decide sozinho como hashear

# Função para hashear uma senha
def get_password_hash(password: str):
    return pwd_context.hash(password)

# Função para validar uma senha passada com uma senha hasheada guardada no banco
def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)
