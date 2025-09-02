// scripts/migrate.js
// Script de migração simples: cria tabelas necessárias e insere dados iniciais.
const pool = require('../config/database');

const createTables = async () => {
  try {
    // Tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'FACULTY',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de laboratórios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS labs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        description TEXT,
        capacity INTEGER NOT NULL,
        available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de reservas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        lab_id INTEGER REFERENCES labs(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time TIME NOT NULL,
        duration INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tabelas criadas com sucesso!');
    
    // Inserir dados iniciais
    await pool.query(`
      INSERT INTO labs (name, location, description, capacity) 
      VALUES 
        ('Lab de Informática 1', 'Bloco A, Sala 101', 'Laboratório com 20 computadores', 20),
        ('Lab de Informática 2', 'Bloco A, Sala 102', 'Laboratório com 25 computadores', 25),
        ('Lab de Robótica', 'Bloco B, Sala 201', 'Laboratório equipado com kits de robótica', 15)
      ON CONFLICT DO NOTHING
    `);

    console.log('Dados iniciais inseridos!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  } finally {
    pool.end();
  }
};

createTables();