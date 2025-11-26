# Lógica das solicitações do usuários (edição/adição de filme)

import json
from core.database import get_connection

# Listar todas as solicitações
def listar_solicitacoes():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # pega nome e foto do usuário
        cursor.execute('''
            SELECT s.*, u.nome, u.foto
            FROM solicitacoes s
            JOIN usuarios u ON s.usuario_id = u.id
        ''')
        rows = cursor.fetchall()

        solicitacoes = []
        for row in rows:
            # converte JSON do filme se não for None
            filme_obj = json.loads(row[3]) if row[3] else None

            solicitacoes.append({
                'id': row[0],
                'usuario_id': row[1],
                'filme_id': row[2] if row[2] else None,
                'filme': filme_obj,
                'tipo': row[4],
                'aceito': row[5],
                'usuario_nome': row[6],
                'usuario_foto': row[7]
            })
        response = solicitacoes

    except Exception as e:
        response = {'Erro': str(e)}

    finally:
        cursor.close()
        conn.close()
        return response

# ---------------------------------------------

# Pegar solicitação específica
def get_solicitacao_por_id(solicitacao_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute('SELECT * FROM solicitacoes WHERE id = %s', (solicitacao_id,))
        solicitacao = cursor.fetchone()

        if not solicitacao:
            return {'Erro': 'Solicitação não encontrada.'}

        # carrega JSON do filme
        filme_data = json.loads(solicitacao['filme']) if solicitacao['filme'] else None

        # se existir JSON, transformar ids em objetos completos
        if filme_data:
            # atores
            if 'atores' in filme_data:
                cursor.execute(
                    'SELECT id, nome, foto FROM atores WHERE id IN (%s)' %
                    ','.join(['%s'] * len(filme_data['atores'])),
                    filme_data['atores']
                )
                filme_data['atores'] = cursor.fetchall()

            # diretor (vem como lista com um id)
            if 'diretor' in filme_data and len(filme_data['diretor']) > 0:
                cursor.execute(
                    'SELECT id, nome FROM diretores WHERE id = %s',
                    (filme_data['diretor'][0],)
                )
                filme_data['diretor'] = [cursor.fetchone()]

            # produtoras
            if 'produtoras' in filme_data:
                cursor.execute(
                    'SELECT id, nome FROM produtoras WHERE id IN (%s)' %
                    ','.join(['%s'] * len(filme_data['produtoras'])),
                    filme_data['produtoras']
                )
                filme_data['produtoras'] = cursor.fetchall()

            # generos
            if 'generos' in filme_data:
                cursor.execute(
                    'SELECT id, nome FROM generos WHERE id IN (%s)' %
                    ','.join(['%s'] * len(filme_data['generos'])),
                    filme_data['generos']
                )
                filme_data['generos'] = cursor.fetchall()

        response = {
            'id': solicitacao['id'],
            'usuario_id': solicitacao['usuario_id'],
            'filme_id': solicitacao['filme_id'],
            'filme': filme_data,
            'tipo': solicitacao['tipo'],
            'aceito': solicitacao['aceito']
        }

        return response

    except Exception as e:
        return {'Erro': str(e)}

    finally:
        cursor.close()
        conn.close()

# ---------------------------------------------

# Criar nova solicitação
def criar_solicitacao(usuario_id, filme_json, tipo, filme_id=None):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Só checa duplicidade se for 'novo filme'
        if tipo == 'novo filme':
            campos_unicos = {
                'titulo': filme_json.get('titulo'),
                'capa_horizontal': filme_json.get('capa_horizontal'),
                'capa_vertical': filme_json.get('capa_vertical'),
                'trailer': filme_json.get('trailer')
            }

            for campo, valor in campos_unicos.items():
                if valor:
                    cursor.execute(f'SELECT id FROM filmes WHERE {campo} = %s', (valor,))
                    existe = cursor.fetchone()
                    if existe:
                        return {'Erro': f'Já existe um filme cadastrado com o mesmo {campo}'}

        # Converte JSON para string
        filme_json_str = json.dumps(filme_json, ensure_ascii=False)

        # Inserir a solicitação
        cursor.execute('''
            INSERT INTO solicitacoes (usuario_id, filme_id, filme, tipo)
            VALUES (%s, %s, %s, %s)
        ''', (usuario_id, filme_id, filme_json_str, tipo))
        conn.commit()

        # Pega o ID gerado
        id_solicitacao = cursor.lastrowid
        if not id_solicitacao:
            return {'Erro': f'Não foi possível criar a solicitação para usuario_id={usuario_id}'}

        # Busca a solicitação recém-criada
        cursor.execute('SELECT * FROM solicitacoes WHERE id=%s', (id_solicitacao,))
        solicitacao = cursor.fetchone()
        if solicitacao is None:
            return {'Erro': f'Solicitação com id={id_solicitacao} não encontrada após inserção'}

        # Converte o JSON armazenado
        try:
            filme_obj = json.loads(solicitacao[3]) if solicitacao[3] else None
        except Exception as e:
            return {'Erro': f'Falha ao ler JSON do filme: {str(e)}'}

        # Retorno final
        response = {
            'Mensagem': 'Solicitação enviada com sucesso!',
            'id': solicitacao[0],
            'usuario_id': solicitacao[1],
            'filme_id': solicitacao[2],
            'filme': filme_obj,
            'tipo': solicitacao[4]
        }

    except Exception as e:
        # Retorna o erro real do banco ou do Python
        response = {'Erro': str(e)}

    finally:
        cursor.close()
        conn.close()
        return response

# ---------------------------------------------

# Recusar/deletar solicitação
def recusar_solicitacao(solicitacao_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Verifica se existe e se já foi aceita
        cursor.execute('SELECT aceito FROM solicitacoes WHERE id=%s', (solicitacao_id,))
        registro = cursor.fetchone()

        if not registro:
            return {'Erro': 'Solicitação não encontrada.'}

        if registro[0]:  # já aceita
            return {'Erro': 'Solicitação já foi aceita e não pode ser excluída.'}

        # Se ainda não aceita, deleta
        cursor.execute('DELETE FROM solicitacoes WHERE id=%s', (solicitacao_id,))
        conn.commit()

        if cursor.rowcount > 0:
            response = {'Mensagem': f'Solicitação {solicitacao_id} recusada e removida com sucesso.'}
        else:
            response = {'Erro': 'Falha ao recusar solicitação.'}

    except Exception as e:
        conn.rollback()
        response = {'Erro': str(e)}

    finally:
        cursor.close()
        conn.close()
        return response

# ---------------------------------------------

# Atualizar solicitações aceitas
def aceitar_solicitacao(solicitacao_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT aceito FROM solicitacoes WHERE id=%s', (solicitacao_id,))
        registro = cursor.fetchone()

        if not registro:
            return {'Erro': 'Solicitação não encontrada.'}
        if registro[0]:
            return {'Erro': 'Solicitação já foi aceita.'}

        cursor.execute('UPDATE solicitacoes SET aceito=TRUE WHERE id=%s', (solicitacao_id,))
        conn.commit()

        return {'Mensagem': f'Solicitação {solicitacao_id} marcada como aceita com sucesso!'}

    except Exception as e:
        conn.rollback()
        return {'Erro': str(e)}

    finally:
        cursor.close()
        conn.close()
