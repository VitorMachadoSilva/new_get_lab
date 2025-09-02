// Exemplo de routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.signup);
router.get('/me', authMiddleware, authController.getMe);
router.get('/users', authMiddleware, authController.getUsers);
router.put('/password', authMiddleware, authController.updatePassword);

module.exports = router;