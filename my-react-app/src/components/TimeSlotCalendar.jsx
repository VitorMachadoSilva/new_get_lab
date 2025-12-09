// Calendário de horários: mostra slots de 08:00-17:00 com estado (ocupado/selecionado/conflito)
// e permite selecionar um horário disponível.
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import { Schedule, CheckCircle, Cancel, Warning } from '@mui/icons-material';
import { formatBrazilianDateFromYmd } from '../utils/date';

export default function TimeSlotCalendar({ reservations, selectedDate, selectedTime, selectedDuration, onTimeSelect }) {
  // Horários disponíveis (8h às 18h)
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Função para normalizar tempo (remove segundos se existirem)
  const normalizeTime = (timeString) => {
    if (!timeString) return '';
    // Se tiver segundos (08:00:00), remove os segundos
    if (timeString.includes(':') && timeString.split(':').length === 3) {
      return timeString.substring(0, 5); // Pega apenas HH:MM
    }
    return timeString;
  };

  // Função auxiliar para criar Date objects consistentes
  const createTimeDate = (time) => {
    const normalizedTime = normalizeTime(time);
    // Garante que temos HH:MM:SS para o Date object
    return new Date(`1970-01-01T${normalizedTime}:00`);
  };

  // Função para verificar se um horário está ocupado
  const isTimeSlotOccupied = (time) => {
    if (!reservations || reservations.length === 0) return false;
    
    const slotStart = createTimeDate(time);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1 hora
    
    return reservations.some(reservation => {
      if (!reservation.time || !reservation.duration) return false;
      
      const normalizedReservationTime = normalizeTime(reservation.time);
      const reservationStart = createTimeDate(normalizedReservationTime);
      const reservationEnd = new Date(reservationStart.getTime() + reservation.duration * 60 * 60 * 1000);
      
      // Verifica se os intervalos se sobrepõem
      return (slotStart < reservationEnd && slotEnd > reservationStart);
    });
  };

  // Função para verificar se um horário está selecionado
  const isTimeSlotSelected = (time) => {
    if (!selectedTime || !selectedDuration) return false;
    
    const normalizedSelectedTime = normalizeTime(selectedTime);
    const selectedStart = createTimeDate(normalizedSelectedTime);
    const selectedEnd = new Date(selectedStart.getTime() + selectedDuration * 60 * 60 * 1000);
    
    const slotStart = createTimeDate(time);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
    
    return (slotStart >= selectedStart && slotStart < selectedEnd);
  };

  // Função para obter informações da reserva em um horário
  const getReservationInfo = (time) => {
    if (!reservations || reservations.length === 0) return null;
    
    const slotStart = createTimeDate(time);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
    
    return reservations.find(reservation => {
      if (!reservation.time || !reservation.duration) return false;
      
      const normalizedReservationTime = normalizeTime(reservation.time);
      const reservationStart = createTimeDate(normalizedReservationTime);
      const reservationEnd = new Date(reservationStart.getTime() + reservation.duration * 60 * 60 * 1000);
      
      return (slotStart < reservationEnd && slotEnd > reservationStart);
    });
  };

  // Função para verificar se o horário selecionado conflita
  const hasConflict = (time) => {
    if (!selectedTime || !selectedDuration) return false;
    
    const normalizedSelectedTime = normalizeTime(selectedTime);
    const selectedStart = createTimeDate(normalizedSelectedTime);
    const selectedEnd = new Date(selectedStart.getTime() + selectedDuration * 60 * 60 * 1000);
    
    const slotStart = createTimeDate(time);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
    
    // Verifica se há sobreposição
    const hasOverlap = (selectedStart < slotEnd && selectedEnd > slotStart);
    
    return hasOverlap && isTimeSlotOccupied(time);
  };

  const handleTimeClick = (time) => {
    if (onTimeSelect && !isTimeSlotOccupied(time)) {
      onTimeSelect(time);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        📅 Horários para {selectedDate ? formatBrazilianDateFromYmd(selectedDate) : 'Data selecionada'}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle color="success" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Disponível</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Cancel color="error" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Ocupado</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Warning color="warning" sx={{ fontSize: 20 }} />
            <Typography variant="caption">Conflito</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={1}>
        {timeSlots.map((time) => {
          const isOccupied = isTimeSlotOccupied(time);
          const isSelected = isTimeSlotSelected(time);
          const hasTimeConflict = hasConflict(time);
          const reservationInfo = getReservationInfo(time);
          
          let chipColor = 'default';
          let chipVariant = 'outlined';
          let icon = null;
          let tooltipText = time;
          
          if (isOccupied) {
            chipColor = 'error';
            chipVariant = 'filled';
            icon = <Cancel sx={{ fontSize: 16 }} />;
            tooltipText = `${time} - Ocupado por ${reservationInfo?.user?.name || 'Usuário'} (${reservationInfo?.duration}h)`;
          } else if (isSelected) {
            chipColor = 'primary';
            chipVariant = 'filled';
            icon = <CheckCircle sx={{ fontSize: 16 }} />;
            tooltipText = `${time} - Selecionado`;
          } else if (hasTimeConflict) {
            chipColor = 'warning';
            chipVariant = 'filled';
            icon = <Warning sx={{ fontSize: 16 }} />;
            tooltipText = `${time} - Conflito com horário selecionado`;
          } else {
            chipColor = 'success';
            chipVariant = 'outlined';
            icon = <Schedule sx={{ fontSize: 16 }} />;
            tooltipText = `${time} - Disponível`;
          }

          return (
            <Grid item xs={6} sm={4} md={3} key={time}>
              <Tooltip title={tooltipText} arrow>
                <Box
                  sx={{
                    cursor: !isOccupied ? 'pointer' : 'default',
                    '&:hover': !isOccupied ? { opacity: 0.8 } : {}
                  }}
                  onClick={() => handleTimeClick(time)}
                >
                  <Chip
                    icon={icon}
                    label={time}
                    color={chipColor}
                    variant={chipVariant}
                    fullWidth
                    size="medium"
                    sx={{ 
                      height: '40px',
                      fontSize: '0.875rem',
                      pointerEvents: 'none'
                    }}
                  />
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>

      {reservations && reservations.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            📋 Reservas existentes:
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {reservations.map((reservation) => {
              const normalizedTime = normalizeTime(reservation.time);
              const startTime = createTimeDate(normalizedTime);
              const endTime = new Date(startTime.getTime() + reservation.duration * 60 * 60 * 1000);
              const endTimeFormatted = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
              
              return (
                <Box key={reservation.id} sx={{ 
                  p: 1, 
                  mb: 1, 
                  bgcolor: 'rgba(244, 67, 54, 0.1)', 
                  borderRadius: 1,
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}>
                  <Typography variant="body2" fontWeight="medium">
                    🕐 {normalizedTime} - {endTimeFormatted} ({reservation.duration}h)
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    👤 {reservation.user?.name || 'Usuário'} | 📊 {reservation.status}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Paper>
  );
}