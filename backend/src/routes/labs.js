const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', labController.getAll);
router.get('/:id', labController.getById);
router.post('/', labController.create);
router.put('/:id', labController.update);
router.delete('/:id', labController.delete);

module.exports = router;