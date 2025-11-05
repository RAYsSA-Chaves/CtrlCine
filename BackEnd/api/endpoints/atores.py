# Rotas para requisições de atores

from BackEnd.core.database import get_connection

import json

# Cadastro de ator
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
      return json.dumps(response, ensure_ascii, indent=4)
  
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
  
  return json.dumps(response, ensure_ascii=False, indent=4)

# ---------------------------------------------

# Pegar atores de um filme
def get_atores_por_filme(filme_id):
  conn = get_connection()
  cursor = conn.cursor()

  try:
    # busca todos os atores relacionados ao filme
    cursor.execute('''
      SELECT atores.id, atores.nome, atores.foto
      FROM filme_ator
      JOIN atores ON filme_ator.ator_id = atores.id
      WHERE filme_ator.filme_id = %s
    ''', (filme_id,))
    atores = cursor.fetchall()
    
    # se não tiver atores cadastrados para o filme
    if not atores:
      response = {'Mensagem': 'Nenhum ator encontrado para este filme.'}
    else:
      # monta a lista de atores como objetos JSON
      lista_atores = []
      for ator in atores:
        lista_atores.append({
          'id': ator[0],
          'nome': ator[1],
          'foto': ator[2]
        })

      # resposta
      response = {
        'filme_id': filme_id,
        'atores': lista_atores
      }

    # erro
    except Exception as e:
        response = {'Erro': str(e)}

    # printa o resultado e encerra conexão com banco
    finally:
        print(response)
        cursor.close()
        conn.close()
        return json.dumps(response, ensure_ascii=False, indent=4)
