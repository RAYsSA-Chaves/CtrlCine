// Centralizando chamada da API para fazer login e pegar infos do usuário logado

// Context é uma forma de compartilhar dados entre vários componentes SEM precisar passar props para todos eles -> uma caixinha global que guarda informações e qualquer componente pode acessar

import { createContext, useState, useEffect } from 'react';
import api, { userUpdater } from './Api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Registrar setUser dentro do interceptor para permitir que ele atualize o usuário
    useEffect(() => {
        userUpdater(setUser);
    }, []);


    // Função de login
    async function login(email, senha) {
        const res = await api.post('/usuarios/login', { email, senha });

        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);

        const userRes = await api.get('/usuarios/me');
        setUser(userRes.data); // ATUALIZA O CONTEXTO

        return true;
    }


    // Logout
    function logout() {
        localStorage.clear();
        setUser(null);
    }


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
