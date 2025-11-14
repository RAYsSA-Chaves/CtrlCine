// Centralizando todas as chamadas axios e interceptando erros de autenticação no BackEnd para deslogar usuário

import axios from 'axios';


// Guardar função do AuthContext para que o interceptor possa atualizar o setUser()
let updateUserCallback = null;

export function userUpdater(funcaoDoSetUser) {
    updateUserCallback = funcaoDoSetUser;
}


// Centralizando o axios
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

/* 
Interceptor de requisição (antes de enviar qualquer requisição)
-> Coloca o token automaticamente
*/
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});


/*
Interceptor de resposta do BackEnd
-> Se o back retornar 401 (token expirou);
-> tenta gerar um novo token (refresh);
-> atualiza usuário no AuthContext;
-> reenvia a requisição original
*/
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config;

        // se o token expirou e ainda não tentou refresh
        if (error.response?.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;  // evita loop

            const refreshToken = localStorage.getItem('refresh_token');

            // se não tem refresh → desloga
            if (!refreshToken) {
                localStorage.clear();
                window.location.reload();
                return Promise.reject(error);
            }

            try {
                // tenta pedir novos tokens
                const refreshResponse = await axios.post(
                    'http://localhost:8000/api/usuarios/refresh',
                    { refresh_token: refreshToken }
                );

                const newAccess = refreshResponse.data.access_token;
                const newRefresh = refreshResponse.data.refresh_token;

                // salva os tokens novos
                localStorage.setItem('access_token', newAccess);
                localStorage.setItem('refresh_token', newRefresh);

                // atualiza o header da requisição original
                originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

                // atualiza o usuário no AuthContext usando a função enviada
                if (updateUserCallback) {
                    try {
                        const userRes = await api.get('/usuarios/me');
                        updateUserCallback(userRes.data); // ATUALIZA O CONTEXTO
                    } catch (e) {
                        console.warn('Não foi possível atualizar o usuário após refresh:' + e);
                    }
                }


                // reenvia a requisição original com o novo token
                return api(originalRequest);

            } catch (refreshError) {
                // refresh falhou -> logout
                localStorage.clear();
                window.location.reload();
                return Promise.reject(refreshError);
            }
        }

        // Qualquer outro erro
        return Promise.reject(error);
    }
);

export default api;
