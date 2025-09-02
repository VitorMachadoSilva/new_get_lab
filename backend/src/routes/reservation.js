// Rotas de reservas: listagem, criação, consulta por usuário, por lab/data e manutenção de status.
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar todas as reservas (ADMIN vê todas, demais filtram via controller)
router.get('/', reservationController.getAll);
// Consultar reservas de um lab em uma data específica
router.get('/lab-date', reservationController.getByLabAndDate);
// Reservas por usuário (somente o próprio usuário ou ADMIN)
router.get('/user/:userId', reservationController.getByUserId);
// Detalhe por ID (somente dono ou ADMIN)
router.get('/:id', reservationController.getById);
// Criar nova reserva
router.post('/', reservationController.create);
// Atualizar status (ADMIN)
router.put('/:id', reservationController.update);
// Excluir reserva (dono ou ADMIN)
router.delete('/:id', reservationController.delete);

module.exports = router;