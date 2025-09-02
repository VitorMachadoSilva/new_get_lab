// Rotas de autenticação: login, cadastro, informações do usuário e troca de senha.
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Login e registro não exigem autenticação prévia
router.post('/login', authController.login);
router.post('/register', authController.signup);
// A partir daqui, exige token JWT válido
router.get('/me', authMiddleware, authController.getMe);
router.get('/users', authMiddleware, authController.getUsers);
router.put('/password', authMiddleware, authController.updatePassword);

module.exports = router;