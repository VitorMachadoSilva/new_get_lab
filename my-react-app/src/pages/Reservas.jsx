// Reservas.jsx - Página de visualização de reservas do dia atual
import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Paper,
  Tooltip,
  Alert,
  CircularProgress,
  Divider
} from "@mui/material";
import {
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Computer as ComputerIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import { getReservasDoDia } from "../api/reservationService"; // Importe da sua API existente

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [dataAtual, setDataAtual] = useState(new Date());

  // Formatar data para exibição
  const dataFormatada = format(dataAtual, "EEEE, dd 'de' MMMM 'de' yyyy");

  // Buscar reservas do dia atual
  useEffect(() => {
    const carregarReservas = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Formatar data para YYYY-MM-DD
        const dataParaAPI = format(dataAtual, "yyyy-MM-dd");
        
        // Usar a função da sua API existente
        const data = await getReservasDoDia(dataParaAPI);
        setReservas(data);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
        setError("Erro ao carregar reservas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    carregarReservas();
    
    // Atualizar a cada 5 minutos para mostrar reservas em tempo real
    const intervalo = setInterval(carregarReservas, 5 * 60 * 1000);
    
    return () => clearInterval(intervalo);
  }, [dataAtual]);

  // Alternar modo tela cheia
  const toggleFullscreen = () => {
    const header = document.querySelector("header");
    const nav = document.querySelector("nav");
    
    if (!fullscreenMode) {
      // Esconder elementos do layout
      if (header) header.style.display = "none";
      if (nav) nav.style.display = "none";
      document.body.style.overflow = "hidden";
    } else {
      // Restaurar elementos
      if (header) header.style.display = "block";
      if (nav) nav.style.display = "block";
      document.body.style.overflow = "auto";
    }
    setFullscreenMode(!fullscreenMode);
  };

  // Função para obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED": return "success";
      case "PENDING": return "warning";
      case "REJECTED": return "error";
      case "CANCELLED": return "default";
      default: return "info";
    }
  };

  // Traduzir status
  const getStatusTexto = (status) => {
    switch (status) {
      case "APPROVED": return "Confirmada";
      case "PENDING": return "Pendente";
      case "REJECTED": return "Rejeitada";
      case "CANCELLED": return "Cancelada";
      default: return status;
    }
  };

  // Formatar hora
  const formatarHora = (timeString, duration) => {
    if (!timeString) return "Horário não informado";
    
    const [hora, minutos] = timeString.split(":");
    const horaInicio = `${hora}:${minutos}`;
    
    // Calcular hora fim
    const horaFim = new Date(`2000-01-01T${horaInicio}`);
    horaFim.setHours(horaFim.getHours() + (duration || 1));
    
    return `${horaInicio} - ${format(horaFim, "HH:mm")}`;
  };

  // Função segura para acessar propriedades aninhadas
  const getLabName = (reserva) => {
    return reserva.lab && reserva.lab.name ? reserva.lab.name : "Laboratório";
  };

  const getLabLocation = (reserva) => {
    return reserva.lab && reserva.lab.location ? reserva.lab.location : "Local não informado";
  };

  const getUserName = (reserva) => {
    return reserva.user && reserva.user.name ? reserva.user.name : "Nome não disponível";
  };

  const getUserEmail = (reserva) => {
    return reserva.user && reserva.user.email ? reserva.user.email : "";
  };

  // Componente de card de reserva
  const ReservaCard = ({ reserva }) => (
    <Card 
      elevation={2} 
      sx={{ 
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1c286d" }}>
              {getLabName(reserva)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              <ComputerIcon fontSize="small" />
              {getLabLocation(reserva)}
            </Typography>
          </Box>
          <Chip
            label={getStatusTexto(reserva.status)}
            color={getStatusColor(reserva.status)}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon fontSize="small" />
            Professor
          </Typography>
          <Typography variant="body1">
            {getUserName(reserva)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getUserEmail(reserva)}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
            <ScheduleIcon fontSize="small" />
            Horário
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {formatarHora(reserva.time, reserva.duration)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Duração: {reserva.duration || 1} hora{reserva.duration !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {reserva.description && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
              <InfoIcon fontSize="small" />
              Observações
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {reserva.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Contar laboratórios únicos
  const contarLaboratoriosUnicos = () => {
    const nomes = reservas.map(r => getLabName(r));
    const unicos = new Set(nomes);
    return unicos.size;
  };

  // Contar reservas por status
  const contarReservasPorStatus = (status) => {
    return reservas.filter(r => r.status === status).length;
  };

  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: fullscreenMode ? "#f5f5f5" : "transparent",
      p: fullscreenMode ? 3 : 0
    }}>
      {/* Barra de controle - visível apenas quando não em fullscreen */}
      {!fullscreenMode && (
        <Container maxWidth="xl" sx={{ mb: 4 }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            mb: 3,
            p: 2,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1c286d", display: "flex", alignItems: "center", gap: 1 }}>
                
                Reservas do Dia
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {dataFormatada}
              </Typography>
            </Box>
            
            <Tooltip title={fullscreenMode ? "Sair do modo telão" : "Modo telão (oculta menu)"}>
              <Button
                variant="contained"
                startIcon={fullscreenMode ? <MinimizeIcon /> : <MaximizeIcon />}
                onClick={toggleFullscreen}
                sx={{
                  backgroundColor: "#1c286d",
                  "&:hover": { backgroundColor: "#0d1b5a" }
                }}
              >
                {fullscreenMode ? "Sair do Telão" : "Modo Telão"}
              </Button>
            </Tooltip>
          </Box>
        </Container>
      )}

      {/* Conteúdo principal */}
      <Container maxWidth={fullscreenMode ? false : "xl"} sx={{ 
        px: fullscreenMode ? 4 : 2,
        width: fullscreenMode ? "100%" : "auto"
      }}>
        {/* Header em modo fullscreen */}
        {fullscreenMode && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: "#1c286d",
              color: "white",
              borderRadius: 2
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                  
                  Reservas do Dia
                </Typography>
                <Typography variant="h5">
                  {dataFormatada}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MinimizeIcon />}
                onClick={toggleFullscreen}
                size="large"
                sx={{ backgroundColor: "white", color: "#1c286d", "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                Sair do Telão
              </Button>
            </Box>
          </Paper>
        )}

        {/* Loading/Error */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : reservas.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Nenhuma reserva para hoje
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Não há reservas agendadas para o dia de hoje.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Contador de reservas */}
            {fullscreenMode && (
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Chip 
                  label={`${reservas.length} reserva${reservas.length !== 1 ? 's' : ''} hoje`}
                  color="primary" 
                  size="large"
                  sx={{ fontSize: "1.1rem", p: 2 }}
                />
              </Box>
            )}

            {/* Grid de cards */}
            <Grid container spacing={3}>
              {reservas
                .sort((a, b) => {
                  // Ordenar por horário
                  if (a.time && b.time) {
                    return a.time.localeCompare(b.time);
                  }
                  return 0;
                })
                .map((reserva) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={reserva.id}>
                    <ReservaCard reserva={reserva} />
                  </Grid>
                ))}
            </Grid>

            {/* Resumo em modo fullscreen */}
            {fullscreenMode && reservas.length > 0 && (
              <Paper sx={{ mt: 4, p: 3, backgroundColor: "#f8f9fa" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Resumo do Dia
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, backgroundColor: "white", borderRadius: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
                        {contarReservasPorStatus("APPROVED")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confirmadas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, backgroundColor: "white", borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: "bold", color: "orange" }}>
                        {contarReservasPorStatus("PENDING")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pendentes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, backgroundColor: "white", borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1c286d" }}>
                        {reservas.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: "center", p: 2, backgroundColor: "white", borderRadius: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: "bold", color: "green" }}>
                        {contarLaboratoriosUnicos()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Laboratórios
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Atualização automática em modo telão */}
      {fullscreenMode && (
        <Box sx={{ 
          position: "fixed", 
          bottom: 16, 
          right: 16, 
          backgroundColor: "rgba(0,0,0,0.7)", 
          color: "white",
          p: 1,
          borderRadius: 2,
          fontSize: "0.8rem"
        }}>
          Atualizado em: {format(new Date(), "HH:mm:ss")}
        </Box>
      )}
    </Box>
  );
}