const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referência ao modelo User
        required: true
    },
    title: {
        type: String,
        required: [true, 'Por favor, insira o título da tarefa'],
        trim: true // Remove espaços em branco no início e no final
    },
    description: {
        type: String,
        trim: true // Remove espaços em branco no início e no final
    },
    completed: {
        type: Boolean,
        default: false // Por padrão, toda tarefa nova inicia como não concluída
    }
}, {
    timestamps: true // Adiciona campos createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('ToDo', ToDoSchema);