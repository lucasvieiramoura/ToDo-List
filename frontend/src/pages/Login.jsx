import {useState, useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importa o contexto de autenticação

const navigate = useNavigate();
const { login, user } = useContext(AuthContext); // Usa a função de login e o estado do usuário do contexto

useEffect(() => {
    if (user) 
        navigate('/'); // Se o usuário já estiver logado, redireciona para a página principal
}, [user, navigate]);


const Login = () => {
    const [email, setEmail] = useState(''); // Estado para armazenar o email do usuário
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para armazenar mensagens de erro

    const { login } = useContext(AuthContext); // Usa a função de login do contexto

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        setError(''); // Limpa mensagens de erro anteriores

        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        const result = await login(email, password); // Chama a função de login do contexto
        if (!result.success) {
            setError(result.message || 'Erro ao fazer login');
        } else 
        {
            // Login bem-sucedido, o usuário já está salvo no contexto e localStorage
            // Você pode redirecionar para a página principal ou mostrar uma mensagem de sucesso aqui
            navigate('/'); // Redireciona para a página principal após login bem-sucedido
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Entrar no To-Do List</h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>E-mail:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="seuemail@exemplo.com"
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Digite sua senha"
                        />
                    </div>
                    <button type="submit" style={styles.button}>Entrar</button>
                </form>

                <p style={styles.footerText}>
                    Não tem uma conta? <Link to="/register" style={styles.link}>Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
};

// Estilos básicos InLine para deixar a interface apresentável
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '24px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', outline: 'none' },
  button: { padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' },
  error: { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', border: '1px solid #f5c6cb' },
  footerText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;
