const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // O token gerlamente vem no formato "Bearer <TOKEN>"
    if (req.headers.authorizatiion && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Pega apenas token (ignora a palavra "Bearer")
            token = req.headers.authorization.split(' ')[1];

            //Decodifica o token usando a chave secreta do .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Busca o usuário no banco pelo ID do token e adiciona ao objeto 'req' (sem a senha)
            req.user = await User.findById(decoded.id);

            next(); // Autorizado! Segue para a rota/controller
        } catch (err) {
            console.error('Erro de autenticação:', err);
            res.status(401).json({ message: 'Não autorizado, token inválido ou expirado' });
        }
    } else {
        res.status(401).json({ message: 'Não autorizado, token não encontrado' });
    }   

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, token não encontrado' });
    }
};

module.exports = { protect };