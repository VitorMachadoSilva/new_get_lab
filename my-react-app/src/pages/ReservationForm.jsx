// Página de criação de reserva: seleciona lab, data, hora e duração, exibe conflitos
// e envia para a API criar a reserva.
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { Schedule, ArrowBack } from "@mui/icons-material";
import { createReservation } from "../api/reservationService";
import { getLabs } from "../api/labService";
import { getReservationsByLabAndDate } from "../api/reservationService";
import TimeSlotCalendar from "../components/TimeSlotCalendar";

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    lab_id: "",
    date: "",
    time: "",
    duration: 1
  });
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingReservations, setExistingReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const labIdFromParams = params.get("lab_id");

  // Função para normalizar tempo (remove segundos se existirem)
  const normalizeTime = (timeString) => {
    if (!timeString) return '';
    // Se tiver segundos (08:00:00), remove os segundos
    if (timeString.includes(':') && timeString.split(':').length === 3) {
      return timeString.substring(0, 5); // Pega apenas HH:MM
    }
    return timeString;
  };

  useEffect(() => {
    loadLabs();
  }, []);

  useEffect(() => {
    if (labIdFromParams) {
      setFormData(prev => ({ ...prev, lab_id: labIdFromParams }));
    }
  }, [labIdFromParams]);

  // Efeito para carregar reservas quando lab ou data mudam
  useEffect(() => {
    loadExistingReservations();
  }, [formData.lab_id, formData.date]);

  // Efeito para verificar se o horário digitado manualmente está ocupado
  useEffect(() => {
    if (formData.time && formData.lab_id && formData.date && formData.duration) {
      const isOccupied = isSelectedTimeOccupied();
      if (isOccupied) {
        setError("Atenção: Este horário está ocupado. Por favor, selecione um horário disponível no calendário abaixo.");
      } else if (error && error.includes("ocupado")) {
        setError(""); // Limpa o erro se o usuário corrigir
      }
    }
  }, [formData.time, formData.duration, existingReservations]); // Adicionado existingReservations como dependência

  const loadLabs = async () => {
    try {
      setLoading(true);
      const data = await getLabs();
      setLabs(data.filter(lab => lab.available));
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar laboratórios");
    } finally {
      setLoading(false);
    }
  };

  const loadExistingReservations = async () => {
    if (!formData.lab_id || !formData.date) {
      setExistingReservations([]);
      return;
    }

    try {
      setLoadingReservations(true);
      const data = await getReservationsByLabAndDate(formData.lab_id, formData.date);
      setExistingReservations(data || []);
    } catch (err) {
      console.error(err);
      setExistingReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, time }));
    // Limpa erro se estiver selecionando do calendário
    if (error && error.includes("ocupado")) {
      setError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para criar Date objects consistentes
  const createTimeDate = (time) => {
    const normalizedTime = normalizeTime(time);
    return new Date(`1970-01-01T${normalizedTime}:00`);
  };

  // Função para verificar se o horário selecionado está ocupado
  const isSelectedTimeOccupied = () => {
    if (!formData.time || !formData.lab_id || !formData.date || !formData.duration) return false;
    if (!existingReservations || existingReservations.length === 0) return false;
    
    const selectedStart = createTimeDate(formData.time);
    const selectedEnd = new Date(selectedStart.getTime() + formData.duration * 60 * 60 * 1000);
    
    return existingReservations.some(reservation => {
      if (!reservation.time || !reservation.duration) return false;
      
      const reservationStart = createTimeDate(reservation.time);
      const reservationEnd = new Date(reservationStart.getTime() + reservation.duration * 60 * 60 * 1000);
      
      // Verifica se os intervalos se sobrepõem
      return (selectedStart < reservationEnd && selectedEnd > reservationStart);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Validação: verificar se o horário está ocupado
    if (isSelectedTimeOccupied()) {
      setError("Este horário já está ocupado. Por favor, selecione outro horário no calendário abaixo.");
      setSubmitting(false);
      return;
    }

    // Validações de data
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Não é possível reservar para datas passadas");
      setSubmitting(false);
      return;
    }

    try {
      await createReservation(formData);
      setSuccess("Reserva criada com sucesso! Aguarde aprovação.");
      setTimeout(() => {
        navigate("/my-reservations");
      }, 2000);
    } catch (err) {
      console.error(err);
      let errorMessage = "Erro ao criar reserva";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        
        // Se há conflitos, mostrar informações detalhadas
        if (err.response.data.conflicts) {
          const conflicts = err.response.data.conflicts;
          errorMessage += `\n\nConflitos encontrados:\n${conflicts.map(c => 
            `• ${c.time} - ${c.duration}h (${c.user}) - Status: ${c.status}`
          ).join('\n')}`;
        }
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box className="loading-spinner">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Voltar
      </Button>

      <Typography variant="h4" gutterBottom>
        Nova Reserva
      </Typography>

      <Paper elevation={2} sx={{ p: 3, maxWidth: 600 }}>
        {error && (
          <Alert severity={error.includes("ocupado") ? "warning" : "error"} sx={{ mb: 2 }} onClose={() => setError("")}>
            {error.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Laboratório</InputLabel>
            <Select
              name="lab_id"
              value={formData.lab_id}
              label="Laboratório"
              onChange={handleChange}
              required
            >
              {labs.map((lab) => (
                <MenuItem key={lab.id} value={lab.id}>
                  {lab.name} - {lab.location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            name="date"
            label="Data"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
            inputProps={{
              min: new Date().toISOString().split('T')[0] // Não permite datas passadas
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="time"
            label="Horário"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formData.time}
            onChange={handleChange}
            error={isSelectedTimeOccupied()}
            helperText={isSelectedTimeOccupied() ? "Horário ocupado - selecione no calendário abaixo" : ""}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Duração (horas)</InputLabel>
            <Select
              name="duration"
              value={formData.duration}
              label="Duração (horas)"
              onChange={handleChange}
            >
              {[1, 2, 3, 4].map((hour) => (
                <MenuItem key={hour} value={hour}>
                  {hour} {hour === 1 ? "hora" : "horas"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Mostrar calendário de horários */}
          {formData.lab_id && formData.date && (
            <>
              {loadingReservations ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <TimeSlotCalendar
                  reservations={existingReservations}
                  selectedDate={formData.date}
                  selectedTime={formData.time}
                  selectedDuration={formData.duration}
                  onTimeSelect={handleTimeSelect}
                />
              )}
            </>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<Schedule />}
            sx={{ mt: 3 }}
            disabled={submitting || isSelectedTimeOccupied() || loadingReservations}
          >
            {submitting ? "Criando reserva..." : "Fazer Reserva"}
          </Button>
          
          {isSelectedTimeOccupied() && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              ⚠️ Selecione um horário disponível no calendário acima para continuar.
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
}