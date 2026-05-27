import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Importa a instância do Axios configurada

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);

    // Estado para as tarefas e para o formulário
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    //1. Listar Tarefas ( Busca as tarefas do usuário assim qeu o componente carrega)
    const fetchTodos = async () => {
        try {
            const response = await api.get('/todos'); // Faz a requisição para listar as tarefas
            setTodos(response.data); // Salva as tarefas no estado
        } catch (err) {
            console.error('Erro ao buscar tarefas:', err);
            setError('Erro ao buscar tarefas');
        }
    };

    useEffect(() => {
        fetchTodos(); // Chama a função para buscar as tarefas quando o componente carrega
    }, []);

    // 2. Criar Tarefa
    const handleCreateTodo = async (e) => {
        e.preventDefault();
        if(!title.trim())  return;

        try {
            const response = await api.post('/todos', { title, description }); // Faz a requisição para criar uma nova tarefa
            //  Adiciona a nova tarefa no topo da lista local imediatamente
            setTodos([response.data, ...todos]);
            setTitle(''); // Limpa o campo de título
            setDescription(''); // Limpa o campo de descrição
        } catch (err) {
            console.error('Erro ao criar tarefa:', err);
            setError('Erro ao criar tarefa');
        }
    };

    //3. Atualizar Status (Marcar como Concluída / Pendente)
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const response = await api.patch(`/todos/${id}`, { completed: !currentStatus }); // Faz a requisição para atualizar o status da tarefa
            // Atualiza o estado local com a tarefa modificada
            setTodos(todos.map(todo => todo._id === id ? response.data : todo));
        } catch (err) {
            setError('Erro ao atualizar status da tarefa');
            console.error('Erro ao atualizar status da tarefa:', err);
        }
    };

    //4. Deletar Tarefa
    const handleDeleteTodo = async (id) => {
        if(!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        try {
            await api.delete(`/todos/${id}`); // Faz a requisição para deletar a tarefa
            // Remove a tarefa do estado local
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            setError('Erro ao deletar tarefa');
            console.error('Erro ao deletar tarefa:', err);
        }
    };

  return (
    <div style={styles.container}>
      {/*Header do App*/}
        <header style={styles.header}>
            <h2>Olá, {user?.name}! 👋</h2>
            <button onClick={logout} style={styles.logoutButton}>Sair</button>
        </header>

        <div style={styles.content}>
            {error && <div style={styles.error}>{error}</div>}

            {/* Formulário de Criação de Tarefas */}
            <form onSubmit={handleCreateTodo} style={styles.form}>
                <h3>Nova Tarefa</h3>
                <input
                    type="text"
                    placeholder="Título da tarefa..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Descrição (opcional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.addBtn}>
                    Criar Tarefa
                </button>
            </form>

            {/* Lista de Tarefas */}
            <div style={styles.todoList}>
                <h3>Suas Tarefas ({todos.length})</h3>

                {todos.length === 0 ? (
                   <p style={styles.emptyText}>Nenhuma tarefa por aqui. Comece criando uma acima! 🎯</p>
                ) : (
                    todos.map((todo) => (
                        <div key={todo._id} style={styles.todoItem}>
                            <div style={styles.todoData}>
                                <span
                                    style={{
                                        ...styles.todoTitle,
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                        color: todo.completed ? '#888' : '#333'
                                    }}
                                >
                                    {todo.title}
                                </span>
                                {todo.description && (
                                    <small style={styles.todoDesc }>{todo.description}</small>
                                )}
                            </div>
                            
                            <div style={styles.actions}>
                                <button
                                    onClick={() => handleToggleStatus(todo._id, todo.completed)}
                                    style={{
                                        ...styles.actionBtn,
                                        backgroundColor: todo.completed ?'#6c757d' : '#28a745'
                                    }}
                                >
                                    {todo.completed ? 'Marcar como Pendente' : 'Concluir'}
                                </button>
                                <button
                                    onClick={() => handleDeleteTodo(todo._id)}
                                    style={{ ...styles.actionBtn, backgroundColor: '#dc3545' }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

// Estilos para organizar o layout do Dashboard
const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  content: { display: 'flex', flexDirection: 'column', gap: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
  addBtn: { padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  todoList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  todoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '6px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  todoData: { display: 'flex', flexDirection: 'column', gap: '4px' },
  todoTitle: { fontSize: '18px', fontWeight: 'bold' },
  todoDesc: { color: '#666', fontSize: '14px' },
  actions: { display: 'flex', gap: '8px' },
  actionBtn: { color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  error: { backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', border: '1px solid #f5c6cb' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: '20px' }
};

export default Dashboard;