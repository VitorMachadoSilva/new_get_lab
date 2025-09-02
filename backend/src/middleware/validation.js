// Middlewares de validação com express-validator.
// Use os arrays exportados nas rotas para validar o corpo das requisições.
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUser = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  handleValidationErrors
];

const validateReservation = [
  body('lab_id').isInt().withMessage('ID do laboratório deve ser um número'),
  body('date').isDate().withMessage('Data deve ser válida'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário deve estar no formato HH:MM'),
  body('duration').isInt({ min: 1, max: 24 }).withMessage('Duração deve ser entre 1 e 24 horas'),
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateLogin,
  validateReservation,
  handleValidationErrors
};