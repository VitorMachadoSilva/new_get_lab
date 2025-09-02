// Model de reservas: consultas com JOINs (lab e user), criação, atualização,
// remoção e verificação de disponibilidade sem conflitos de horário.
const pool = require('../config/database');

class Reservation {
  static async getAll() {
    const query = `
      SELECT 
        r.*,
        json_build_object('id', l.id, 'name', l.name, 'location', l.location) as lab,
        json_build_object('id', u.id, 'name', u.name, 'email', u.email) as user
      FROM reservations r 
      JOIN users u ON r.user_id = u.id 
      JOIN labs l ON r.lab_id = l.id 
      ORDER BY r.date, r.time
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getByUserId(userId) {
    const query = `
      SELECT 
        r.*,
        json_build_object('id', l.id, 'name', l.name, 'location', l.location) as lab
      FROM reservations r 
      JOIN labs l ON r.lab_id = l.id 
      WHERE r.user_id = $1 
      ORDER BY r.date, r.time
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT 
        r.*,
        json_build_object('id', l.id, 'name', l.name, 'location', l.location) as lab,
        json_build_object('id', u.id, 'name', u.name, 'email', u.email) as user
      FROM reservations r 
      JOIN users u ON r.user_id = u.id 
      JOIN labs l ON r.lab_id = l.id 
      WHERE r.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async create({ lab_id, user_id, date, time, duration }) {
    const query = `
      INSERT INTO reservations (lab_id, user_id, date, time, duration) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [lab_id, user_id, date, time, duration];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id, { status }) {
    const query = 'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *';
    const values = [status, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM reservations WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getByLabAndDate(lab_id, date) {
    const query = `
      SELECT 
        r.*,
        json_build_object('id', u.id, 'name', u.name) as user
      FROM reservations r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.lab_id = $1 
      AND r.date = $2 
      AND r.status NOT IN ('CANCELLED', 'REJECTED')
      ORDER BY r.time
    `;
    const { rows } = await pool.query(query, [lab_id, date]);
    return rows;
  }

  static async checkAvailability(lab_id, date, time, duration) {
    const query = `
      SELECT * FROM reservations 
      WHERE lab_id = $1 
      AND date = $2 
      AND status NOT IN ('CANCELLED', 'REJECTED')
      AND (
        (time <= $3::time AND (time + INTERVAL '1 hour' * duration) > $3::time) OR
        (time < ($3::time + INTERVAL '1 hour' * $4) AND (time + INTERVAL '1 hour' * duration) > $3::time)
      )
    `;
    
    const { rows } = await pool.query(query, [lab_id, date, time, duration]);
    return rows.length === 0;
  }
}

module.exports = Reservation;