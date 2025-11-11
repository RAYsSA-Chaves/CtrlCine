# Lógica das requisições de usuário

import datetime

from core.database import get_connection
from core.security import get_password_hash, verify_password, create_access_token,  create_refresh_token, verify_access_token, verify_refresh_token, decode_token


# ---------- helpers ----------
def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor

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
    cursor = conn.cursor

    try:
		# busca o usuário no banco
        cursor.execute('SELECT * FROM usuarios WHERE id = %s', (user_id,)) 
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

# ---------------------------------------------

# Cadastro de novo usuário
def cadastrar_usuario(data):
    # data -> dict com keys: nome, sobrenome (opt), email, senha, foto (opt), tipo_user (opt)
    
    # validações mínimas
    if 'email' not in data or 'senha' not in data or 'nome' not in data:
        return {'Erro': 'Nome, email e senha são obrigatórios'}

    # checar se já existe
    if get_user_by_email(data['email']):
        return {'Erro': 'Email já cadastrado'}

    senha_hash = get_password_hash(data['senha'])

    conn = get_connection()
    cursor = conn.cursor()
    try:
        # guarda novo usuário no banco
        cursor.execute("""
            INSERT INTO usuarios (nome, sobrenome, email, senha, foto, tipo_user, data_cadastro)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
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

    except Exception as e:
        cursor.close()
        conn.close()
        return {'Erro': str(e)}
    
    finally:
        cursor.close()
        conn.close()

    # pega o novo usuário para retornar
    user = get_user_by_id(novo_id)
    return {'Mensagem': 'Usuário cadastrado com sucesso!\n' + user}

# ---------------------------------------------

# ---------- login ----------
def login_usuario(email, senha):
    user = get_user_by_email(email)
    if not user:
        return {'status': HTTPStatus.UNAUTHORIZED, 'json': {'Erro': 'Email e/ou senha incorretos'}}

    if not verify_password(senha, user['senha']):
        return {'status': HTTPStatus.UNAUTHORIZED, 'json': {'Erro': 'Email e/ou senha incorretos'}}

    access = create_access_token(user_id=user['id'], email=user['email'], role=user['tipo_user'], nome=user['nome'])
    refresh = create_refresh_token(user_id=user['id'], email=user['email'])

    return {
        'status': HTTPStatus.OK,
        'json': {
            'access_token': access,
            'refresh_token': refresh,
            'token_type': 'bearer',
            'role': user['tipo_user'],
            'id': user['id'],
            'nome': user['nome']
        }
    }


# ---------- refresh ----------
def refresh_tokens(refresh_token_str):
    payload = verify_refresh_token(refresh_token_str)
    if not payload:
        return {'status': HTTPStatus.UNAUTHORIZED, 'json': {'Erro': 'Refresh token inválido ou expirado'}}

    user = get_user_by_id(payload.get('id'))
    if not user:
        return {'status': HTTPStatus.UNAUTHORIZED, 'json': {'Erro': 'Usuário do token não encontrado'}}

    new_access = create_access_token(user_id=user['id'], email=user['email'], role=user['tipo_user'], nome=user['nome'])
    new_refresh = create_refresh_token(user_id=user['id'], email=user['email'])

    return {'status': HTTPStatus.OK, 'json': {'access_token': new_access, 'refresh_token': new_refresh, 'token_type': 'bearer', 'role': user['tipo_user'], 'id': user['id'], 'nome': user['nome']}}


# ---------- pegar infos do token (me) ----------
def get_me_from_token(access_token_str):
    payload = verify_access_token(access_token_str)
    if not payload:
        return {'status': HTTPStatus.UNAUTHORIZED, 'json': {'Erro': 'Token inválido ou expirado'}}

    user_id = payload.get('id')
    user = get_user_by_id(user_id)
    if not user:
        return {'status': HTTPStatus.NOT_FOUND, 'json': {'Erro': 'Usuário não encontrado'}}

    # retornar os campos solicitados: nome, sobrenome, foto, email, data_cadastro
    return {'status': HTTPStatus.OK, 'json': user}


# ---------- editar conta (apenas próprio user) ----------
def editar_usuario(requester_payload, user_id_to_edit, data):
    """
    requester_payload: dict do token decodificado (tem id)
    user_id_to_edit: int
    data: dict com nome, sobrenome, foto (apenas esses serão permitidos)
    """
    requester_id = requester_payload.get('id')
    if requester_id != int(user_id_to_edit):
        return {'status': HTTPStatus.FORBIDDEN, 'json': {'Erro': 'Permissões insuficientes'}}

    # atualiza somente os campos permitidos
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE usuarios SET nome=%s, sobrenome=%s, foto=%s WHERE id=%s
        """, (data.get('nome'), data.get('sobrenome'), data.get('foto'), user_id_to_edit))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return {'status': HTTPStatus.INTERNAL_SERVER_ERROR, 'json': {'Erro': str(e)}}
    finally:
        cursor.close()
        conn.close()

    user = get_user_by_id(user_id_to_edit)
    return {'status': HTTPStatus.ACCEPTED, 'json': user}


# ---------- deletar usuario (apenas o proprio) ----------
def deletar_usuario(requester_payload, user_id_to_delete):
    requester_id = requester_payload.get('id')
    if requester_id != int(user_id_to_delete):
        return {'status': HTTPStatus.FORBIDDEN, 'json': {'Erro': 'Permissões insuficientes'}}

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (user_id_to_delete,))
        conn.commit()
        if cursor.rowcount > 0:
            resp = {'Mensagem': 'Usuário deletado com sucesso'}
            status = HTTPStatus.OK
        else:
            resp = {'Erro': 'Usuário não encontrado'}
            status = HTTPStatus.NOT_FOUND
    except Exception as e:
        conn.rollback()
        resp = {'Erro': str(e)}
        status = HTTPStatus.INTERNAL_SERVER_ERROR
    finally:
        cursor.close()
        conn.close()

    return {'status': status, 'json': resp}
