const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Registrar um novo usuário
// @route   POST /api/auth/register
// @access  Público
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Este e-mail ja está cadastrado' });
        }

        // Cria um novo usuário ( a senha criptografada automaticamente pelo Model)
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id) // Gera um token JWT para o usuário recém-registrado
            });
        } else {
            res.status(400).json({ message: 'Dados inválidos' });
        }
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ message: 'Erro do servidor' });
    }
};

// @desc    Autenticar usuário e obter token (Login)
// @route   POST /api/auth/login
// @access  Público
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca o usuário e força a selação do campo 'password' (que configuramos como oculto no Model)
        const user = await User.findOne({ email }).select('+password');

        //Verifica se o usuário existe e se a senha bate (usando método do Model)
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id) // Gera um token JWT para o usuário autenticado
            });
        } else {
            res.status(401).json({ message: 'E-mail ou senha inválidos' });
        }
    } catch (err) {
        console.error('Erro ao autenticar usuário:', err);
        res.status(500).json({ message: 'Erro do servidor' });
    }
};

module.exports = { registerUser, loginUser };