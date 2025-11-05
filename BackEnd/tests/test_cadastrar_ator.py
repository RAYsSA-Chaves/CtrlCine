# Teste do cadastro de atores (cadastro real no banco)

from BackEnd.api.logic.atores import cadastrar_ator

def test():
  nome = input("Nome do ator: ")
  foto = input("URL da foto: ")
  
  cadastrar_ator(nome, foto)

if __name__ == "__main__":
    test()
