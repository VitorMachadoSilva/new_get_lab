import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export default function UserProfile() {
  const { user } = useAuth();
  
  console.log('UserProfile renderizado:', { user });

  // Verificação de segurança
  if (!user) {
    console.log('UserProfile: usuário não autenticado');
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Usuário não autenticado
        </Typography>
      </Box>
    );
  }

  console.log('UserProfile: usuário autenticado, renderizando perfil');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        👤 Meu Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Informações Pessoais */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  fontSize: '2rem',
                  bgcolor: 'primary.main',
                  mb: 2
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Chip 
                label={user.role === 'ADMIN' ? 'Administrador' : 'Docente'} 
                color={user.role === 'ADMIN' ? 'error' : 'primary'}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Membro desde:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </Typography>
          </Paper>
        </Grid>

        {/* Conteúdo da direita */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 Informações do Sistema
            </Typography>
            <Typography variant="body1">
              Esta é uma versão simplificada da página de perfil para teste.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Usuário logado: {user.name} ({user.role})
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
