import {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importa o contexto de autenticação

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext); // Acessa o estado de autenticação do contexto

    // Se ainda estiver carregando a checagem do localStorage, exibe aviso
    if (loading) {
        return <div style={{textInterAlign : 'center', marginTop: '50px'}}>Carregando...</div>;
    }

    // Se o usário exisitir, renderiza a página filha. Se não, joga pra o Login
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;