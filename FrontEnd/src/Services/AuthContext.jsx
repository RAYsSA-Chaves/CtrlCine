// Centralizando chamada da API para pegar infos do usuário logado

// Context é uma forma de compartilhar dados entre vários componentes SEM precisar passar props para todos eles -> uma caixinha global que guarda informações e qualquer componente pode acessar

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get("http://localhost:8000/api/usuarios/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setUser(res.data);
        })
        .catch(() => {
            setUser(null);
            localStorage.removeItem("access_token");
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    function logout() {
        localStorage.removeItem("access_token");
        window.location.reload();
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
