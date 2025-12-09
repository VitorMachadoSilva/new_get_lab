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
  Grid,
  Paper,
  Stack,
  Divider
} from "@mui/material";
import { Delete, CalendarToday, Schedule, AccessTime, Computer } from "@mui/icons-material";
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

  const getStatusText = (status) => {
    const statusMap = {
      "APPROVED": "Aprovada",
      "PENDING": "Pendente",
      "CANCELLED": "Cancelada",
      "REJECTED": "Rejeitada"
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200vw", p: { xs: 2, md: 3 } }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)"
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: "#1a237e"
          }}
        >
          Minhas Reservas
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Gerencie suas reservas de laboratório
        </Typography>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }} 
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {reservations.map((reservation) => (
          <Grid item xs={12} md={6} lg={4} key={reservation.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "all 0.3s ease",
                '&:hover': {
                  transform: "translateY(-4px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Computer color="primary" sx={{ fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {reservation.lab?.name || `Laboratório ${reservation.lab_id}`}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(reservation.status)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        fontSize: "0.75rem"
                      }}
                    />
                  </Box>

                  <Divider />

                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <CalendarToday sx={{ fontSize: 18, color: "primary.main" }} />
                      <Typography variant="body1">
                        {new Date(reservation.date).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Schedule sx={{ fontSize: 18, color: "primary.main" }} />
                      <Typography variant="body1">
                        {reservation.time} 
                        <Typography 
                          component="span" 
                          sx={{ 
                            ml: 1, 
                            px: 1, 
                            py: 0.5, 
                            bgcolor: "primary.light", 
                            color: "primary.contrastText",
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            fontWeight: 500
                          }}
                        >
                          {reservation.duration}h
                        </Typography>
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1.5}>
                      <AccessTime sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="body2" color="textSecondary">
                        Criada: {new Date(reservation.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>

              {(reservation.status === "PENDING" || reservation.status === "APPROVED") && (
                <>
                  <Divider />
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleCancel(reservation.id)}
                      sx={{ 
                        borderRadius: 2,
                        py: 1
                      }}
                    >
                      Cancelar Reserva
                    </Button>
                  </CardActions>
                </>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {reservations.length === 0 && !loading && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 8, 
            textAlign: "center",
            mt: 4,
            borderRadius: 2,
            bgcolor: "grey.50"
          }}
        >
          <Computer sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Nenhuma reserva encontrada
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Você ainda não possui reservas. Que tal fazer sua primeira?
          </Typography>
        </Paper>
      )}
    </Box>
  );
}