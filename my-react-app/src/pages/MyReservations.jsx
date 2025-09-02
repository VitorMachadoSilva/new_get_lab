// Minhas reservas: lista apenas as reservas do usuário atual e permite cancelar.
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Grid
} from "@mui/material";
import { Delete, CalendarToday, Schedule } from "@mui/icons-material";
import { getReservations, deleteReservation } from "../api/reservationService";
import { useAuth } from "../hooks/useAuth";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      // Filtrar apenas as reservas do usuário atual
      if (user && user.id) {
        const userReservations = data.filter(r => r.user_id === user.id);
        setReservations(userReservations);
      } else {
        setReservations([]);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      loadReservations();
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      return;
    }

    try {
      await deleteReservation(id);
      await loadReservations();
    } catch (err) {
      console.error(err);
      setError("Erro ao cancelar reserva");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "success";
      case "PENDING": return "warning";
      case "CANCELLED": return "error";
      case "REJECTED": return "error";
      default: return "default";
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
      <Typography variant="h4" gutterBottom>
        Minhas Reservas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {reservations.map((reservation) => (
          <Grid item xs={12} md={6} key={reservation.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6">
                    {reservation.lab?.name || `Laboratório ${reservation.lab_id}`}
                  </Typography>
                  <Chip
                    label={reservation.status}
                    color={getStatusColor(reservation.status)}
                    size="small"
                  />
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    {new Date(reservation.date).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Schedule sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="body2">
                    {reservation.time} (duração: {reservation.duration}h)
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Criada em: {new Date(reservation.created_at).toLocaleString('pt-BR')}
                </Typography>
              </CardContent>

              {(reservation.status === "PENDING" || reservation.status === "APPROVED") && (
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleCancel(reservation.id)}
                  >
                    Cancelar
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {reservations.length === 0 && !loading && (
        <Box className="empty-state">
          <Typography variant="h6" color="textSecondary">
            Você não possui reservas
          </Typography>
        </Box>
      )}
    </Box>
  );
}