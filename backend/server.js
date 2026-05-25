const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

//Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

//Conecta ao banco de dados MongoDB
connectDB();

const app = express();

//Middleware para habilitar CORS e parsear JSON
app.use(cors());
app.use(express.json()); // Permite que o Express entenda requisições com corpo JSON no corpo da requisição

//Rotas
app.use('/', (req, res) => {
  res.send('API ToDo List funcionando!');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});