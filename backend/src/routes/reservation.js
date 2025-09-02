const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', reservationController.getAll);
router.get('/lab-date', reservationController.getByLabAndDate);
router.get('/user/:userId', reservationController.getByUserId);
router.get('/:id', reservationController.getById);
router.post('/', reservationController.create);
router.put('/:id', reservationController.update);
router.delete('/:id', reservationController.delete);

module.exports = router;