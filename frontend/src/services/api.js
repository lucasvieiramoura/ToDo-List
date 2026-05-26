import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base do nosso backend
}); 

// Este "interceptor" roda antes de QUALQUER requisição sair do Front-end
api.interceptors.request.use((config) => {
    // Busca o usuário/token salvo no localStorage do navegador
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    // Se o token existir, injeta ele no cabeçalho Authorization (Bearer...)
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config; // Retorna a configuração da requisição (com ou sem token)
}, (error) => {
    return Promise.reject(error); // Rejeita a promessa em caso de erro
});

export default api;