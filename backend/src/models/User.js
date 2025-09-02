const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, password, role = 'FACULTY' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, email, role, created_at
    `;
    const values = [name, email, hashedPassword, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getAll() {
    const query = 'SELECT id, name, email, role, created_at FROM users';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async updatePassword(id, hashedPassword) {
    const query = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id';
    const { rows } = await pool.query(query, [hashedPassword, id]);
    return rows[0];
  }
}

module.exports = User;