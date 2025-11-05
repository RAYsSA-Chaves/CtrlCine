# Testes da geração e validação de senhas hasheadas

from BackEnd.core.security import get_password_hash, verify_password

def test():
    senha = input('Senha: ')

    # gera hash
    hashed = get_password_hash(senha)
    print("Hash gerado:", hashed)

    # valida senha com senha hasheada
    tentativa = input('Confirme a senha: ')
    ok = verify_password(tentativa, hashed)
    print("Verificação ->", ok)

if __name__ == "__main__":
    test()