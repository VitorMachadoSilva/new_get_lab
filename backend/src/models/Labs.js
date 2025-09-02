// Model de laboratórios: operações CRUD na tabela labs.
const pool = require('../config/database');

class Labs {
  static async getAll() {
    const query = 'SELECT * FROM labs ORDER BY name';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM labs WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async create({ name, location, description, capacity }) {
    const query = `
      INSERT INTO labs (name, location, description, capacity) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [name, location, description, capacity];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id, { name, location, description, capacity, available }) {
    const query = `
      UPDATE labs 
      SET name = $1, location = $2, description = $3, capacity = $4, available = $5 
      WHERE id = $6 
      RETURNING *
    `;
    const values = [name, location, description, capacity, available, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM labs WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Labs;