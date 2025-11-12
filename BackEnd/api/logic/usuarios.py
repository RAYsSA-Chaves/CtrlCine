# Lógica das requisições de usuário

import datetime

from core.database import get_connection
from core.security import get_password_hash, verify_password, create_access_token,  create_refresh_token, verify_access_token, verify_refresh_token


# ---------- helpers ----------
def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()

    try:
		# busca o usuário no banco
        cursor.execute('SELECT * FROM usuarios WHERE email = %s', (email,)) 
        user = cursor.fetchone()

		# usuário não encontrado
        if not user:
            response = {'Mensagem': 'Usuário não encontrado'}
            return response

		# resposta com os dados do usuário
        response = {
			'id': user[0], 
			'nome': user[1],  
            'sobrenome': user[2],
            'email': user[3],
            'senha': user[4],
            'foto': user[5],
            'tipo_user': user[6],
            'data_cadastro': user[7]
		}
	
	# erro
    except Exception as e:
        response = {'Erro': str(e)}
	
	# encerra conexão com banco
    finally:
        cursor.close()
        conn.close()

    return response


def get_user_by_id(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    try:
		# busca o usuário no banco
        cursor.execute('SELECT * FROM usuarios WHERE id = %s', (user_id,)) 
        user = cursor.fetchone()

		# usuário não encontrado
        if not user:
            response = {'Mensagem': 'Usuário não encontrado'}
            return response

		# res´psta com os dados do usuário
        response = {
			'id': user[0], 
			'nome': user[1],  
            'sobrenome': user[2],
            'email': user[3],
            'senha': user[4],
            'foto': user[5],
            'tipo_user': user[6],
            'data_cadastro': user[7]
		}
	
	# erro
    except Exception as e:
        response = {'Erro': str(e)}
	
	# encerra conexão com banco
    finally:
        cursor.close()
        conn.close()

    return response

# ---------------------------------------------

# Cadastro de novo usuário
def cadastrar_usuario(data):
    # data -> dict com keys: nome, sobrenome (opt), email, senha, foto (opt), tipo_user (opt)
    
    # validações mínimas
    if 'email' not in data or 'senha' not in data or 'nome' not in data:
        return {'Erro': 'Nome, email e senha são obrigatórios'}

    # checar se já existe
    if get_user_by_email(data['email']):
        return {'Erro': 'Email já cadastrado!'}

    # hashear senha
    senha_hash = get_password_hash(data['senha'])

    conn = get_connection()
    cursor = conn.cursor()
    try:
        # guarda novo usuário no banco
        cursor.execute('''
            INSERT INTO usuarios (nome, sobrenome, email, senha, foto, tipo_user, data_cadastro)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        ''' (
            data['nome'],
            data.get('sobrenome', None),
            data['email'],
            senha_hash,
            data.get('foto', None),
            data.get('tipo_user', 'comum'),
            datetime.date.today()
        ))
        conn.commit()

        novo_id = cursor.lastrowid  # pega id do novo usuário cadastrado

    # erro
    except Exception as e:
        cursor.close()
        conn.close()
        return {'Erro': str(e)}
    
    finally:
        cursor.close()
        conn.close()

    # pega o novo usuário para retornar
    user = get_user_by_id(novo_id)
    return {'Mensagem': 'Usuário cadastrado com sucesso!', 'Usuário': user}

# ---------------------------------------------

# Login e geração de tokens
def login_usuario(email, senha):
    # verifica se tem cadastro com o email
    user = get_user_by_email(email)
    if not user:
        return {'Erro': 'Email e/ou senha incorretos'}

    # valida a senha
    if not verify_password(senha, user['senha']):
        return {'Erro': 'Email e/ou senha incorretos'}

    # gera tokens
    access = create_access_token(user_id=user['id'], role=user['tipo_user'])
    refresh = create_refresh_token(user_id=user['id'])

    return {
        'access_token': access,
        'refresh_token': refresh,
        'token_type': 'bearer',
        'role': user['tipo_user'],
        'id': user['id']
    }

# ---------------------------------------------

# Gerar novo token (função do refresh)
def refresh_tokens(refresh_token_str):
    try:
        # valida o token de refresh
        payload = verify_refresh_token(refresh_token_str)

        # verifica se usuário ainda existe
        user_id = payload.get('sub')
        user = get_user_by_id(user_id)
        if not user or 'Erro' in user:
            return {'Erro': 'Usuário do token não encontrado'}

        # gera novos tokens
        new_access = create_access_token(user_id=user['id'], role=user['tipo_user'])
        new_refresh = create_refresh_token(user_id=user['id'])

        return {
            'access_token': new_access,
            'refresh_token': new_refresh,
            'token_type': 'bearer',
            'role': user['tipo_user'],
            'id': user['id']
        }

    except Exception as e:
        return {'Erro': str(e)}
    
# ---------------------------------------------

# Pegar infos do usuário logado (através do token)
def get_me_from_token(access_token_str):
    # valida o token
    payload = verify_access_token(access_token_str)
    if not payload:
        return {'Erro': 'Token inválido ou expirado'}

    # pega infos do usuário no banco
    user_id = payload.get('id')
    user = get_user_by_id(user_id)
    if not user:
        return {'Erro': 'Usuário não encontrado'}
    return {user}

# ---------------------------------------------

# Editar conta (apenas o próprio user)
def edit_user(requester_payload, user_id_to_edit, data):
    """
    requester_payload: dict do token decodificado (tem id)
    user_id_to_edit: id passado na url da requisição
    data: dict com nome, sobrenome, foto (apenas esses serão permitidos)
    """

    # verifica se é realmente o usuário
    requester_id = requester_payload.get('id')
    if requester_id != int(user_id_to_edit):
        return {'Erro': 'Permissões insuficientes'}

    # atualiza somente os campos permitidos
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            UPDATE usuarios 
            SET nome=%s, sobrenome=%s, foto=%s WHERE id=%s
        ''' (data.get('nome'), data.get('sobrenome'), data.get('foto'), user_id_to_edit))
        conn.commit()

    except Exception as e:
        cursor.close()
        conn.close()
        return {'Erro': str(e)}
    
    finally:
        cursor.close()
        conn.close()

    # retorna o usuário atualizado
    user = get_user_by_id(user_id_to_edit)
    return {'Usuário atualizado': user}

# ---------------------------------------------

# Deletar usuario (apenas o próprio user)
def delete_user(requester_payload, user_id_to_delete):
    # verifica se realmente é o usuário
    requester_id = requester_payload.get('id')
    if requester_id != int(user_id_to_delete):
        return {'Erro': 'Permissões insuficientes'}

    conn = get_connection()
    cursor = conn.cursor()
    try:
        # deleta o usuário do banco
        cursor.execute('DELETE FROM usuarios WHERE id = %s', (user_id_to_delete,))
        conn.commit()
        if cursor.rowcount > 0:
            response = {'Mensagem': 'Usuário deletado com sucesso'}
        else:
            response = {'Erro': 'Usuário não encontrado'}

    except Exception as e:
        response = {'Erro': str(e)}

    finally:
        cursor.close()
        conn.close()

    return response
