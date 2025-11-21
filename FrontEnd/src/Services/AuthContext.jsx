// Centralizando chamada da API para fazer login e pegar infos do usuário logado

// Context é uma forma de compartilhar dados entre vários componentes SEM precisar passar props para todos eles -> uma caixinha global que guarda informações e qualquer componente pode acessar

import { createContext, useState, useEffect } from 'react';
import api, { userUpdater } from './Api';
import LoadingModal from '../Components/LoadingModal/LoadingModal';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Loading global para páginas
    const [authLoading, setAuthLoading] = useState(true);

    // Registrar setUser dentro do interceptor para permitir que ele atualize o usuário
    useEffect(() => {
        userUpdater(setUser);

        // Impede que volte para Landing Page ao recarregar página
        const token = localStorage.getItem('access_token');
        if (token) {
            api.get('/usuarios/me')
                .then(res => {
                    setUser({ ...res.data, role: res.data.tipo_user });
                })
                .catch(err => {
                    console.error('Token inválido ou expirado', err);
                    localStorage.clear();
                })
                .finally(() => {
                    setAuthLoading(false);
                });
        } else {
            setAuthLoading(false); // sem token = libera render
        }
    }, []);


    // Função de login
    async function login(email, senha) {
        const res = await api.post('/usuarios/login', { email, senha });

        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);

        const userRes = await api.get('/usuarios/me');
        const userData = { ...userRes.data, role: userRes.data.tipo_user };
        setUser(userData); // ATUALIZA O CONTEXTO

        return true;
    }


    // Logout
    function logout() {
        localStorage.clear();
        setUser(null);
    }

    if (authLoading) {
        return <LoadingModal />;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}