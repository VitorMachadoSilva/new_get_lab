import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Alert,
  Collapse
} from '@mui/material';
import { Schedule, Person } from '@mui/icons-material';

export default function TimeSlotConflict({ reservations, selectedDate, selectedTime, selectedDuration }) {
  if (!reservations || reservations.length === 0) {
    return null;
  }

  // Função para verificar se há conflito de horário
  const hasTimeConflict = (reservation) => {
    const reservationStart = new Date(`2000-01-01T${reservation.time}`);
    const reservationEnd = new Date(reservationStart.getTime() + reservation.duration * 60 * 60 * 1000);
    
    const selectedStart = new Date(`2000-01-01T${selectedTime}`);
    const selectedEnd = new Date(selectedStart.getTime() + selectedDuration * 60 * 60 * 1000);
    
    return (
      (selectedStart < reservationEnd && selectedEnd > reservationStart) ||
      (reservationStart < selectedEnd && reservationEnd > selectedStart)
    );
  };

  // Filtrar reservas que conflitam com o horário selecionado
  const conflictingReservations = reservations.filter(hasTimeConflict);

  if (conflictingReservations.length === 0) {
    return null;
  }

  return (
    <Collapse in={conflictingReservations.length > 0}>
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          ⚠️ Conflito de horário detectado!
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Já existem reservas nos seguintes horários:
        </Typography>
        
        {conflictingReservations.map((reservation) => (
          <Box key={reservation.id} sx={{ mt: 1, p: 1, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Schedule sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="body2" fontWeight="medium">
                {reservation.time} - {(() => {
                  const startTime = new Date(`2000-01-01T${reservation.time}`);
                  const endTime = new Date(startTime.getTime() + reservation.duration * 60 * 60 * 1000);
                  return endTime.toTimeString().slice(0, 5);
                })()}
              </Typography>
              <Chip 
                label={reservation.status} 
                size="small" 
                color={reservation.status === 'APPROVED' ? 'success' : 'warning'}
              />
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Person sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="textSecondary">
                Reservado por: {reservation.user?.name || 'Usuário'}
              </Typography>
            </Box>
          </Box>
        ))}
        
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          Escolha outro horário ou data para evitar conflitos.
        </Typography>
      </Alert>
    </Collapse>
  );
}
