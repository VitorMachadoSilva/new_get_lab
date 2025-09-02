const Labs = require('../models/Labs');

const labController = {
  async getAll(req, res) {
    try {
      const labs = await Labs.getAll();
      res.json(labs);
    } catch (error) {
      console.error('Erro ao buscar laboratórios:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const lab = await Labs.getById(id);
      
      if (!lab) {
        return res.status(404).json({ error: 'Laboratório não encontrado' });
      }
      
      res.json(lab);
    } catch (error) {
      console.error('Erro ao buscar laboratório:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async create(req, res) {
    try {
      // Apenas administradores podem criar laboratórios
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { name, location, description, capacity } = req.body;
      
      if (!name || !location || !capacity) {
        return res.status(400).json({ error: 'Nome, localização e capacidade são obrigatórios' });
      }

      const newLab = await Labs.create({ name, location, description, capacity });
      res.status(201).json(newLab);
    } catch (error) {
      console.error('Erro ao criar laboratório:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    try {
      // Apenas administradores podem atualizar laboratórios
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { id } = req.params;
      const { name, location, description, capacity, available } = req.body;
      
      const updatedLab = await Labs.update(id, { name, location, description, capacity, available });
      
      if (!updatedLab) {
        return res.status(404).json({ error: 'Laboratório não encontrado' });
      }
      
      res.json(updatedLab);
    } catch (error) {
      console.error('Erro ao atualizar laboratório:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async delete(req, res) {
    try {
      // Apenas administradores podem excluir laboratórios
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { id } = req.params;
      const deletedLab = await Labs.delete(id);
      
      if (!deletedLab) {
        return res.status(404).json({ error: 'Laboratório não encontrado' });
      }
      
      res.json({ message: 'Laboratório excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir laboratório:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = labController;