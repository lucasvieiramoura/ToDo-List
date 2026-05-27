import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext'; // Importa o contexto de autenticação

const Dashboard = () => {
    const { user } = useContext(AuthContext); // Usa o estado do usuário do contexto
    return (
        <div style={{padding: '20px', textAlign: 'center'}}>
            <h1>Bem-vindo ao seu To-Do List, {user ? user.name : 'Usuário'}!</h1>
            <button onClick={logout} style={{padding:'8px 16px', cursor:'pointer'}}>Sair (Logout)</button>
        </div>
    );
};

export default Dashboard;