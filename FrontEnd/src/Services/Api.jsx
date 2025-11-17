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

        console.error('🚨 ERRO:', error);

        const originalRequest = error.config;

        // erro no login -> não tenta dar refresh no token nem dá reload na página
        if (originalRequest.url.includes("/usuarios/login")) {
            return Promise.reject(error);
        }

        // se o token expirou e ainda não tentou refresh
        if (error.response?.status === 401 && !originalRequest._retry) {

            console.warn('⚠️ TOKEN EXPIRADO — tentando refresh...');

            originalRequest._retry = true;  // evita loop

            const refreshToken = localStorage.getItem('refresh_token');

            // se não tem refresh → desloga
            if (!refreshToken) {
                console.error('❌ Sem refresh token — usuário será deslogado');
                localStorage.clear();
                window.location.reload();
                return Promise.reject(error);
            }

            try {
                console.log('🔄 Pedindo tokens novos...');
                
                // tenta pedir novos tokens
                const refreshResponse = await axios.post(
                    'http://localhost:8000/api/usuarios/refresh',
                    { refresh_token: refreshToken }
                );

                console.log('✅ Refresh funcionou!', refreshResponse.data);

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
                        console.log('👤 Atualizando usuário com novo token...');

                        const userRes = await api.get('/usuarios/me');
                        updateUserCallback(userRes.data); // ATUALIZA O CONTEXTO
                    } catch (e) {
                        console.error('❌ Falha ao atualizar usuário:', e);
                    }
                }

                console.log('📤 Reenviando requisição original...');

                // reenvia a requisição original com o novo token
                return api(originalRequest);

            } catch (refreshError) {
                console.error('❌ Refresh falhou!', refreshError);
                
                // refresh falhou -> logout
                localStorage.clear();
                window.location.reload();
                return Promise.reject(refreshError);
            }
        }

        // qualquer outro erro
        return Promise.reject(error);
    }
);

export default api;
