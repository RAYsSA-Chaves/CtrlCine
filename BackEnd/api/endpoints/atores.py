# Rotas para requisições de atores

from BackEnd.core.database import get_connection

import json

def cadastrar_ator(nome, foto):
  conn = get_connection()
  cursor = conn.cursor()

  try:
    # verifica se o ator já existe
    cursor.execute('SELECT * FROM atores WHERE nome = %s', (nome,))
    ator_existente = cursor.fetchone()

    # se já existe retorna erro
    if ator_existente:
      response = {'Erro': 'Ator já cadastrado'}
      return json.dumps(response)
  
    # insere novo ator
    cursor.execute('''
      INSERT INTO atores (nome, foto) 
      VALUES (%s, %s)
    ''', (nome, foto))
    conn.commit()
    
    # pega ID do ator inserido
    id_ator = cursor.lastrowid

    # busca o ator para retornar
    cursor.execute('SELECT * FROM atores WHERE id = %s', (id_ator,))
    ator = cursor.fetchone()

    # resposta com os dados do ator
    response = {
      'Mensagem': 'Ator cadastrado com sucesso!',
      'id': ator[0], 
      'nome': ator[1],  
      'foto': ator[2]  
    }

  # erro
  except Exception as e:
    response = {'Erro': str(e)}

  # printa o resultado e encerra conexão com banco
  finally:
    print(response)
    cursor.close()
    conn.close()
  
  return json.dumps(response)
