const jwt = require('jsonwebtoken');

// Função para gerar um token JWT para um usuário autenticado
const generateToken = (id) => {
    //Assina o token com o Id do usuário e a chave secreta do .env Expira em 2 dias
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });
};

module.exports = generateToken;