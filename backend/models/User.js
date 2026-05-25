const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor, insira seu nome']
    },
    email: {
        type: String,
        required: [true, 'Por favor, insira seu email'],
        unique: true, // Garante que cada email seja único no banco de dados
        match: [/\S+@\S+\.\S+/, 'Por favor, insira um email válido'] // Valida o formato do email
    },
    password: {
        type: String,
        required: [true, 'Por favor, insira sua senha'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
        select: false // Impede que a senha seja retornada em consultas por padrão
    }
}, {
    timestamps: true // Adiciona campos createdAt e updatedAt automaticamente
});

// Middleware do Mongoose: Criptografa a senha ANTES de salvar o usuário
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
       next(); // Se a senha não foi modificada, continua sem criptografar
    }
    const salt = await bcrypt.genSalt(10); // Gera um salt com 10 rodadas
    this.password = await bcrypt.hash(this.password, salt);
});

// Método auxiliar para comparar a senha na hora do login
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);