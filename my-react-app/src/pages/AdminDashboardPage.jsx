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
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  Done as DoneIcon,
  History as HistoryIcon
} from "@mui/icons-material";
import { getReservations, updateReservation } from "../api/reservationService";

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    past: 0
  });

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data);
      
      // Calcular estatísticas
      const now = new Date();
      const stats = {
        total: data.length,
        pending: data.filter(r => r.status === "PENDING").length,
        approved: data.filter(r => r.status === "APPROVED").length,
        rejected: data.filter(r => r.status === "REJECTED").length,
        cancelled: data.filter(r => r.status === "CANCELLED").length,
        past: data.filter(r => isReservationPast(r, now)).length
      };
      setStats(stats);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar se a reserva já passou
  const isReservationPast = (reservation, now = new Date()) => {
    try {
      const reservationDate = new Date(reservation.date);
      const [hours, minutes] = reservation.time.split(':');
      reservationDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      // Adicionar duração da reserva
      const endTime = new Date(reservationDate);
      endTime.setHours(endTime.getHours() + reservation.duration);
      
      return now > endTime;
    } catch (error) {
      console.error("Erro ao verificar data da reserva:", error);
      return false;
    }
  };

  // Função para verificar se a reserva está em andamento
  const isReservationInProgress = (reservation, now = new Date()) => {
    try {
      const reservationDate = new Date(reservation.date);
      const [hours, minutes] = reservation.time.split(':');
      reservationDate.setHours(parseInt(hours), parseInt(minutes), 0);
      
      // Adicionar duração da reserva
      const endTime = new Date(reservationDate);
      endTime.setHours(endTime.getHours() + reservation.duration);
      
      return now >= reservationDate && now <= endTime;
    } catch (error) {
      console.error("Erro ao verificar reserva em andamento:", error);
      return false;
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

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED": return "Aprovada";
      case "PENDING": return "Pendente";
      case "CANCELLED": return "Cancelada";
      case "REJECTED": return "Rejeitada";
      default: return status;
    }
  };

  // Função para obter o status da reserva com base no tempo
  const getReservationTimeStatus = (reservation) => {
    if (isReservationPast(reservation)) {
      return "past";
    } else if (isReservationInProgress(reservation)) {
      return "in-progress";
    } else {
      return "upcoming";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <AdminIcon sx={{ fontSize: 40, color: "#1c286d" }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1c286d" }}>
              Painel Administrativo
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie todas as reservas do sistema
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Atualizar lista">
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={loadReservations}
            sx={{
              backgroundColor: "#1c286d",
              "&:hover": { backgroundColor: "#0d1b5a" }
            }}
          >
            Atualizar
          </Button>
        </Tooltip>
      </Box>

      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ backgroundColor: "#f5f5f5", height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1c286d" }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ backgroundColor: "#fff3e0", height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "orange" }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ backgroundColor: "#e8f5e9", height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "green" }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aprovadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ backgroundColor: "#ffebee", height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "red" }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejeitadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ backgroundColor: "#f5f5f5", height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "gray" }}>
                {stats.cancelled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Canceladas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ backgroundColor: "#e3f2fd", height: "100%" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                {stats.past}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Concluídas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mensagem de erro */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError("")}
          action={
            <Button color="inherit" size="small" onClick={loadReservations}>
              Tentar novamente
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Tabela de reservas */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#1c286d" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Laboratório</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Professor</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Data</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Horário</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <ViewIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Nenhuma reserva encontrada
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Não há reservas cadastradas no sistema.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((reservation) => {
                  const timeStatus = getReservationTimeStatus(reservation);
                  const isPast = timeStatus === "past";
                  const isInProgress = timeStatus === "in-progress";
                  
                  return (
                    <TableRow 
                      key={reservation.id}
                      hover
                      sx={{ 
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: isPast ? '#fafafa' : 'inherit',
                        opacity: isPast ? 0.8 : 1
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                          #{reservation.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {reservation.lab?.name || `Lab ${reservation.lab_id}`}
                          </Typography>
                          {reservation.lab?.location && (
                            <Typography variant="caption" color="text.secondary">
                              {reservation.lab.location}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {reservation.user?.name || `User ${reservation.user_id}`}
                          </Typography>
                          {reservation.user?.email && (
                            <Typography variant="caption" color="text.secondary">
                              {reservation.user.email}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {new Date(reservation.date).toLocaleDateString('pt-BR')}
                          </Typography>
                          {isInProgress && (
                            <Chip 
                              label="EM ANDAMENTO" 
                              size="small" 
                              color="info"
                              sx={{ mt: 0.5, fontSize: '0.7rem' }}
                            />
                          )}
                          {isPast && (
                            <Chip 
                              icon={<HistoryIcon />}
                              label="CONCLUÍDA" 
                              size="small" 
                              color="default"
                              variant="outlined"
                              sx={{ mt: 0.5, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {reservation.time}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reservation.duration}h
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={getStatusText(reservation.status)}
                            color={getStatusColor(reservation.status)}
                            size="small"
                            sx={{ fontWeight: "bold", minWidth: 100 }}
                          />
                          {isPast && (
                            <Tooltip title="Reserva já concluída">
                              <DoneIcon fontSize="small" color="action" />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {isPast ? (
                          <Tooltip title="Reserva já concluída - sem ações disponíveis">
                            <Typography variant="caption" color="text.secondary" fontStyle="italic">
                              Concluída
                            </Typography>
                          </Tooltip>
                        ) : reservation.status === "PENDING" ? (
                          <ButtonGroup size="small" variant="outlined">
                            <Tooltip title="Aprovar reserva">
                              <Button
                                color="success"
                                onClick={() => handleStatusChange(reservation.id, "APPROVED")}
                                sx={{ minWidth: 40 }}
                              >
                                <CheckIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Rejeitar reserva">
                              <Button
                                color="error"
                                onClick={() => handleStatusChange(reservation.id, "REJECTED")}
                                sx={{ minWidth: 40 }}
                              >
                                <CloseIcon />
                              </Button>
                            </Tooltip>
                          </ButtonGroup>
                        ) : reservation.status === "APPROVED" ? (
                          <Tooltip title="Cancelar reserva">
                            <Button
                              size="small"
                              color="warning"
                              startIcon={<CancelIcon />}
                              onClick={() => handleStatusChange(reservation.id, "CANCELLED")}
                            >
                              Cancelar
                            </Button>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Sem ações
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      

      {/* Rodapé da tabela */}
      {reservations.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {reservations.length} reserva{reservations.length !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </Typography>
        </Box>
      )}

      
    </Box>
  );
}