const ToDo = require('../models/ToDo');

// @desc    Criar uma nova tarefa
// @route   POST /api/todos
// @access  Privado (requer autenticação)
const createToDo = async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'O título é obrigatório' });
    }

    try {
        // O req.user._id vem do middleware de proteção (authMiddleware)
        const todo = await ToDo.create({
            title,
            description,
            user: req.user._id
        });

        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar tarefa' });
    }
};

// @desc    Obter todas as tarefas do usuário autenticado
// @route   GET /api/todos
// @access  Privado (requer autenticação)
const getToDos = async (req, res) => {
    try {
        // Busca apenas tarefas onde o campo 'user' é igual ao ID do usuário autenticado
        const todos = await ToDo.find({ user: req.user._id }).sort({ createdAt: -1 }); // Traz as mais recentes primeiro
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao obter tarefas' });
    }
};

// @desc    Atualizar uma tarefa (editar texto ou marcar como concluída)
// @route   PUT /api/todos/:id
// @access  Privado (requer autenticação)
const updateToDo = async (req, res) => {
    const { title, description, completed } = req.body;

    try {
        // Encontra a tarefa pelo ID enviado na URL
        let todo = await ToDo.findById(req.params.id);

        if(!todo) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        // Segurança crucial: Verifica se a tarefa realamente pertence ao usuário logado
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Não autorizado a editar esta tarefa' });
        }

        // Atualiza os campos se eles forem enviados na requisição
        todo.title = title !== undefined ? title : todo.title;
        todo.description = description !== undefined ? description : todo.description;
        todo.completed = completed !== undefined ? completed : todo.completed;

        const updatedToDo = await todo.save();
        res.json(updatedToDo);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }   
};

// @desc    Deletar uma tarefa
// @route   DELETE /api/todos/:id
// @access  Privado (requer autenticação)
const deleteToDo = async (req, res) => {
    try {
        const todo = await ToDo.findById(req.params.id);

        if(!todo) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        
        // Segurança: Verifica se a tarefa pertence ao usuário antes de deletar
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Acesso não autorizado para esta tarefa' });
        }

        await todo.deleteOne();
        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar tarefa' });
    }
};

module.exports = { createToDo, getToDos, updateToDo, deleteToDo };