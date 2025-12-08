// Controller de reservas: listagem, criação com verificação de disponibilidade,
// consulta por usuário, por ID e por laboratório/data, além de atualização de status.
const pool = require('../config/database'); // Adicione esta linha
const Reservation = require('../models/Reservation');

const reservationController = {
  async getAll(req, res) {
    try {
      const reservations = await Reservation.getAll();
      res.json(reservations);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // NOVO MÉTODO: Buscar reservas do dia atual
  async getReservasDoDia(req, res) {
    try {
      const { date } = req.query;
      const hoje = date || new Date().toISOString().split('T')[0];
      
      // Para ADMIN: todas as reservas do dia
      // Para FACULTY: suas reservas do dia
      let query = `
        SELECT 
          r.*,
          json_build_object('id', l.id, 'name', l.name, 'location', l.location) as lab,
          json_build_object('id', u.id, 'name', u.name, 'email', u.email) as user
        FROM reservations r 
        JOIN labs l ON r.lab_id = l.id 
        JOIN users u ON r.user_id = u.id 
        WHERE r.date = $1
        AND r.status NOT IN ('CANCELLED')
      `;
      
      const values = [hoje];
      
      if (req.user.role === 'FACULTY') {
        query += ' AND r.user_id = $2';
        values.push(req.user.id);
      }
      
      query += ' ORDER BY r.time';
      
      const { rows } = await pool.query(query, values);
      res.json(rows);
    } catch (error) {
      console.error('Erro ao buscar reservas do dia:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      
      // Usuários só podem ver suas próprias reservas, a menos que sejam administradores
      if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      const reservations = await Reservation.getByUserId(userId);
      res.json(reservations);
    } catch (error) {
      console.error('Erro ao buscar reservas do usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const reservation = await Reservation.getById(id);
      
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      
      // Usuários só podem ver suas próprias reservas, a menos que sejam administradores
      if (req.user.role !== 'ADMIN' && req.user.id !== reservation.user_id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      res.json(reservation);
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getByLabAndDate(req, res) {
    try {
      const { lab_id, date } = req.query;
      
      if (!lab_id || !date) {
        return res.status(400).json({ error: 'ID do laboratório e data são obrigatórios' });
      }
      
      const reservations = await Reservation.getByLabAndDate(lab_id, date);
      res.json(reservations);
    } catch (error) {
      console.error('Erro ao buscar reservas do laboratório:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async create(req, res) {
    try {
      const { lab_id, date, time, duration } = req.body;
      const user_id = req.user.id;
      
      if (!lab_id || !date || !time || !duration) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }
      
      // Verificar disponibilidade
      const isAvailable = await Reservation.checkAvailability(lab_id, date, time, duration);
      if (!isAvailable) {
        // Buscar reservas conflitantes para mostrar detalhes
        const conflictingReservations = await Reservation.getByLabAndDate(lab_id, date);
        const conflicts = conflictingReservations.filter(reservation => {
          const reservationStart = new Date(`2000-01-01T${reservation.time}`);
          const reservationEnd = new Date(reservationStart.getTime() + reservation.duration * 60 * 60 * 1000);
          
          const selectedStart = new Date(`2000-01-01T${time}`);
          const selectedEnd = new Date(selectedStart.getTime() + duration * 60 * 60 * 1000);
          
          return (
            (selectedStart < reservationEnd && selectedEnd > reservationStart) ||
            (reservationStart < selectedEnd && reservationEnd > selectedStart)
          );
        });
        
        return res.status(400).json({ 
          error: 'Laboratório não disponível no horário selecionado',
          conflicts: conflicts.map(r => ({
            time: r.time,
            duration: r.duration,
            user: r.user?.name || 'Usuário',
            status: r.status
          }))
        });
      }
      
      const newReservation = await Reservation.create({ lab_id, user_id, date, time, duration });
      res.status(201).json(newReservation);
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Apenas administradores podem atualizar o status das reservas
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      if (!['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }
      
      const updatedReservation = await Reservation.update(id, { status });
      
      if (!updatedReservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      
      res.json(updatedReservation);
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar a reserva para verificar permissões
      const reservation = await Reservation.getById(id);
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      
      // Apenas o proprietário da reserva ou administradores podem excluir
      if (req.user.role !== 'ADMIN' && req.user.id !== reservation.user_id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      const deletedReservation = await Reservation.delete(id);
      res.json({ message: 'Reserva excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = reservationController;