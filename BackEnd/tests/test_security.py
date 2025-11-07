from BackEnd.core.security import get_password_hash, verify_password


# --------- Testes da geração e validação de senhas hasheadas  ---------

# Teste de senha correta
def test_correct_password():
    senha = '123'

    # gera hash
    hashed = get_password_hash(senha)
    print('Hash gerado:', hashed)

    # valida senha passada com senha hasheada
    assert verify_password('123', hashed) == True

# Teste de senha incorreta
def test_incorrect_password():
    senha = '123'
    hashed = get_password_hash(senha)
    print('Hash gerado:', hashed)
    
    assert verify_password('senhaErrada', hashed) == False
