import {useState, useContext, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext'; // Importa o contexto de autenticação
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
    const [name, setName] = useState(''); // Estado para armazenar o nome do usuário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para armazenar mensagens de erro

    const {register, user} = useContext(AuthContext);  // Usa a função de registro do contexto
    const navigate = useNavigate();
    useEffect(() => {
        if (user) 
            navigate('/');
    }, [user, navigate]); // Se o usuário já estiver logado, redireciona para a página principal


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpa mensagens de erro anteriores

        if (!name || !email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        const result = await register(name, email, password); // Chama a função de registro do contexto
        if (!result.success) {
            setError(result.message || 'Erro ao registrar usuário');
        } else {
            // Registro bem-sucedido, o usuário já está salvo no contexto e localStorage
            // Você pode redirecionar para a página principal ou mostrar uma mensagem de sucesso aqui
            navigate('/'); // Redireciona para a página de login após registro bem-sucedido
        }
        };

        return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Criar Conta</h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome Completo:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                            placeholder="Digite seu nome"
                        />
                    </div>

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
                            placeholder="Mínimo 6 Caracteres"
                        />
                    </div>

                    <button type="submit" style={styles.button}>Registrar</button>
                </form>

                <p style={styles.footerText}>
                    Já tem uma conta? <Link to="/login" style={styles.link}>Faça login</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '24px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', outline: 'none' },
  button: { padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  error: { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px', border: '1px solid #f5c6cb' },
  footerText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }
};

export default Register;