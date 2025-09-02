const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const labRoutes = require('./routes/labs');
const reservationRoutes = require('./routes/reservation');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/labs', labRoutes);
app.use('/api/v1/reservations', reservationRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Sistema de Reserva de Laboratórios',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      labs: '/api/v1/labs',
      reservations: '/api/v1/reservations'
    }
  });
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Rota para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: 'Use /health para verificar o status do servidor'
  });
});

// Manipulador de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});