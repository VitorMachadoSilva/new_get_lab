// Painel administrativo: lista todas as reservas e permite aprovar/rejeitar.
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  ButtonGroup,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { getReservations, updateReservation } from "../api/reservationService";

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReservation(id, { status });
      await loadReservations();
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar reserva");
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Painel Administrativo</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadReservations}
        >
          Atualizar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Laboratório</TableCell>
              <TableCell>Usuário</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.lab?.name || `Lab ${reservation.lab_id}`}</TableCell>
                <TableCell>{reservation.user?.name || `User ${reservation.user_id}`}</TableCell>
                <TableCell>{new Date(reservation.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.duration}h</TableCell>
                <TableCell>
                  <Chip
                    label={reservation.status}
                    color={getStatusColor(reservation.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {reservation.status === "PENDING" && (
                    <ButtonGroup size="small">
                      <Button
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => handleStatusChange(reservation.id, "APPROVED")}
                      >
                        Aprovar
                      </Button>
                      <Button
                        color="error"
                        startIcon={<CloseIcon />}
                        onClick={() => handleStatusChange(reservation.id, "REJECTED")}
                      >
                        Rejeitar
                      </Button>
                    </ButtonGroup>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {reservations.length === 0 && !loading && (
        <Box className="empty-state">
          <Typography variant="h6" color="textSecondary">
            Nenhuma reserva encontrada
          </Typography>
        </Box>
      )}
    </Box>
  );
}