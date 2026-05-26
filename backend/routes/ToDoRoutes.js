const express = require('express');
const { createToDo, getToDos, updateToDo, deleteToDo } = require('../controllers/toDoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Como todas as rotas aqui precisam de proteção, podemos aplicar o middleware diretamente nelas
router.route('/')
    .get(protect, getToDos) // GET /api/todos
    .post(protect, createToDo); // POST /api/todos

router.route('/:id')
    .put(protect, updateToDo) // PUT /api/todos/:id
    .delete(protect, deleteToDo); // DELETE /api/todos/:id

module.exports = router;