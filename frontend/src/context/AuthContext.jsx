import {createContext, useState, useEffect} from 'react';
import api from '../services/api';

// Cria o contecto propriamente dito
export const AuthContext = createContext();

// Cria o Provider, que é o componente que vai envelopar nosso app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para armazenar os dados do usuário autenticado
    const  [loading, setLoading] = useState(true); // Estado para controlar o carregamento do usuário

    // Efeito para verificar se já exisite um usuário logado salvo no navegador
    useEffect(() => {
        const storeUser = localStorage.getItem('userInfo'); // Busca o item 'userInfo' no localStorage
        if (storeUser) {
            setUser(JSON.parse(storeUser)); // Se existir, converte de volta para objeto e salva no estado 'user'
        }
        setLoading(false); // Após verificar, define loading como false
    }, []);

    // Função para dar login
    const login = async (email, password) => {
        try {
            // Faz a chamada para a rota do backend
            const response = await api.post('/auth/login', { email, password });

            // Se der certo, a API retorna {_ id, name, email, token}
            setUser(response.data); // Salva os dados do usuário no estado
            // Salva no localStorage em formato string para persistir o login
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            return { success: true }; // Retorna sucesso para o componente que chamou a função
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            return { success: false, message: 'Erro ao fazer login' };
        }
    };

    // Função para Cadastrar Novo Usuário
    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });

            setUser(response.data); // Salva os dados do usuário no estado
            localStorage.setItem('userInfo', JSON.stringify(response.data)); // Salva no localStorage
            return { success: true };
        } catch (err) {
            console.error('Erro ao registrar usuário:', err);
            return { success: false, message: 'Erro ao registrar usuário' };
        }
    };

    // Função para fazer Logout
    const logout = () => {
        setUser(null); // Limpa o estado do usuário
        localStorage.removeItem('userInfo'); // Remove os dados do usuário do localStorage
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children} {/* Renderiza os componentes filhos que estão dentro do Provider */}
        </AuthContext.Provider>
    );
}