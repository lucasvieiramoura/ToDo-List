const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const toDoRoutes = require('./routes/ToDoRoutes');

//Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

//Conecta ao banco de dados MongoDB
connectDB();

const app = express();

//Middleware para habilitar CORS e parsear JSON
app.use(cors());
app.use(express.json()); // Permite que o Express entenda requisições com corpo JSON no corpo da requisição


app.use('/api/auth', authRoutes);
app.use('/api/todos', toDoRoutes);

//Rotas
app.use('/', (req, res) => {
  res.send('API ToDo List funcionando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});