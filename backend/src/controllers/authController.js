const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validar entrada
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }
      
      // Buscar usuário
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Gerar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ access_token: token });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;
      
      // Verificar se usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      
      // Criar usuário
      const newUser = await User.create({ name, email, password, role });
      
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: newUser
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  
  async getUsers(req, res) {
    try {
      // Apenas administradores podem ver todos os usuários
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
      }
      
      // Buscar usuário
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar senha atual
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Senha atual incorreta' });
      }
      
      // Atualizar senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(userId, hashedPassword);
      
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = authController;