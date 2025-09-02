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

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const labIdFromParams = params.get("lab_id");

  useEffect(() => {
    loadLabs();
  }, []);

  useEffect(() => {
    if (labIdFromParams) {
      setFormData(prev => ({ ...prev, lab_id: labIdFromParams }));
    }
  }, [labIdFromParams]);

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
      const data = await getReservationsByLabAndDate(formData.lab_id, formData.date);
      setExistingReservations(data);
    } catch (err) {
      console.error(err);
      // Não vamos mostrar erro aqui, apenas log
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // Se mudou laboratório ou data, buscar reservas existentes
    if (e.target.name === 'lab_id' || e.target.name === 'date') {
      // Usar setTimeout para evitar muitas chamadas durante digitação
      setTimeout(() => {
        if (newFormData.lab_id && newFormData.date) {
          loadExistingReservations();
        }
      }, 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Validações
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
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
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
            <TimeSlotCalendar
              reservations={existingReservations}
              selectedDate={formData.date}
              selectedTime={formData.time}
              selectedDuration={formData.duration}
              onTimeSelect={handleTimeSelect}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<Schedule />}
            sx={{ mt: 3 }}
            disabled={submitting}
          >
            {submitting ? "Criando reserva..." : "Fazer Reserva"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}