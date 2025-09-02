// Rotas de laboratórios: listagem pública autenticada e operações administrativas.
const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar todos os labs e obter por id
router.get('/', labController.getAll);
router.get('/:id', labController.getById);
// Operações restritas a ADMIN: criar, atualizar e deletar
router.post('/', labController.create);
router.put('/:id', labController.update);
router.delete('/:id', labController.delete);

module.exports = router;