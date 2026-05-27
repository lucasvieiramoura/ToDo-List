import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo ao seu To-Do List, {user?.name}! 🎉</h1>
      <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>Sair (Logout)</button>
    </div>
  );
};
export default Dashboard;