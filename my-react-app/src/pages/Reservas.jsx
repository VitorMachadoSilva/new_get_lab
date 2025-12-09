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
  Divider,
  Avatar,
  Stack
} from "@mui/material";
import {
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Computer as ComputerIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  AccessTime as AccessTimeIcon,
  MeetingRoom as MeetingRoomIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getReservasDoDia } from "../api/reservationService";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [dataAtual, setDataAtual] = useState(new Date());

  // Formatar data para exibição
  const dataFormatada = format(dataAtual, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Buscar reservas do dia atual
  useEffect(() => {
    const carregarReservas = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Formatar data para YYYY-MM-DD
        const dataParaAPI = format(dataAtual, "yyyy-MM-dd");
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
    
    // Atualizar a cada 2 minutos em modo telão, 5 minutos normal
    const intervalo = setInterval(carregarReservas, fullscreenMode ? 2 * 60 * 1000 : 5 * 60 * 1000);
    
    return () => clearInterval(intervalo);
  }, [dataAtual, fullscreenMode]);

  // Alternar modo tela cheia
  const toggleFullscreen = () => {
    if (!fullscreenMode) {
      const header = document.querySelector("header");
      const nav = document.querySelector("nav");
      const footer = document.querySelector("footer");
      
      if (header) header.style.display = "none";
      if (nav) nav.style.display = "none";
      if (footer) footer.style.display = "none";
      document.body.style.overflow = "hidden";
      document.documentElement.style.backgroundColor = "#f0f2f5";
    } else {
      const header = document.querySelector("header");
      const nav = document.querySelector("nav");
      const footer = document.querySelector("footer");
      
      if (header) header.style.display = "block";
      if (nav) nav.style.display = "block";
      if (footer) footer.style.display = "block";
      document.body.style.overflow = "auto";
      document.documentElement.style.backgroundColor = "";
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

  // Formatar hora de forma compacta
  const formatarHoraCompacta = (timeString, duration) => {
    if (!timeString) return "---";
    
    const [hora, minutos] = timeString.split(":");
    const horaInicio = `${hora}:${minutos}`;
    
    // Calcular hora fim
    const horaFim = new Date(`2000-01-01T${horaInicio}`);
    horaFim.setHours(horaFim.getHours() + (duration || 1));
    
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <AccessTimeIcon sx={{ fontSize: 14 }} />
        <Typography component="span" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
          {horaInicio} - {format(horaFim, "HH:mm")}
        </Typography>
      </Box>
    );
  };

  // Funções seguras para acessar propriedades aninhadas
  const getLabName = (reserva) => {
    return reserva.lab?.name || `Lab ${reserva.lab_id}`;
  };

  const getLabLocation = (reserva) => {
    return reserva.lab?.location || "Local não informado";
  };

  const getUserName = (reserva) => {
    const nome = reserva.user?.name || "Professor";
    return nome.split(" ")[0]; // Retorna apenas o primeiro nome em modo telão
  };

  const getUserInitials = (reserva) => {
    const nome = getUserName(reserva);
    return nome.charAt(0).toUpperCase();
  };

  // Componente de card de reserva COMPACTO
  const ReservaCard = ({ reserva }) => (
    <Card 
      elevation={fullscreenMode ? 1 : 2} 
      sx={{ 
        height: "100%",
        transition: "all 0.2s ease",
        borderLeft: `4px solid ${
          reserva.status === "APPROVED" ? "#4caf50" :
          reserva.status === "PENDING" ? "#ff9800" :
          reserva.status === "REJECTED" ? "#f44336" : "#9e9e9e"
        }`,
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: fullscreenMode ? 2 : 4
        },
        ...(fullscreenMode && {
          minHeight: 190,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        })
      }}
    >
      <CardContent sx={{ p: fullscreenMode ? 1.5 : 2, pb: fullscreenMode ? 1.5 : 2 }}>
        <Stack spacing={fullscreenMode ? 0.8 : 1.5}>
          {/* Cabeçalho compacto */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            gap: 1
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {fullscreenMode ? (
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: "#1c286d",
                    fontSize: "0.875rem"
                  }}
                >
                  {getUserInitials(reserva)}
                </Avatar>
              ) : (
                <ComputerIcon sx={{ fontSize: 20, color: "#1c286d" }} />
              )}
              
              <Box>
                <Typography 
                  variant={fullscreenMode ? "subtitle2" : "subtitle1"} 
                  sx={{ 
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: "#1c286d"
                  }}
                >
                  {getLabName(reserva)}
                </Typography>
                {!fullscreenMode && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <MeetingRoomIcon sx={{ fontSize: 12 }} />
                    {getLabLocation(reserva)}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Chip
              label={fullscreenMode ? getStatusTexto(reserva).substring(0, 3) : getStatusTexto(reserva)}
              color={getStatusColor(reserva.status)}
              size="small"
              sx={{ 
                height: 24,
                fontSize: fullscreenMode ? "0.7rem" : "0.75rem",
                fontWeight: 500
              }}
            />
          </Box>

          {!fullscreenMode && <Divider sx={{ my: 1 }} />}

          {/* Corpo compacto */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: fullscreenMode ? "column" : "row",
            justifyContent: "space-between",
            alignItems: fullscreenMode ? "flex-start" : "center",
            gap: fullscreenMode ? 0.5 : 1,
            flexWrap: "wrap"
          }}>
            {/* Professor */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: fullscreenMode ? 14 : 16, color: "text.secondary" }} />
              <Typography 
                variant={fullscreenMode ? "caption" : "body2"} 
                sx={{ fontWeight: fullscreenMode ? 500 : 400 }}
              >
                {getUserName(reserva)}
              </Typography>
            </Box>

            {/* Horário */}
            <Box>
              {formatarHoraCompacta(reserva.time, reserva.duration)}
              {!fullscreenMode && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2.5 }}>
                  {reserva.duration || 1}h
                </Typography>
              )}
            </Box>
          </Box>

          {/* Observações (apenas se houver e não em fullscreen) */}
          {!fullscreenMode && reserva.description && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}>
                <InfoIcon sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.5 }} />
                {reserva.description}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  // Contadores para resumo
  const contarReservasPorStatus = (status) => {
    return reservas.filter(r => r.status === status).length;
  };

  // Organizar reservas por horário
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    return 0;
  });

  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: fullscreenMode ? "#f0f2f5" : "transparent",
      p: fullscreenMode ? 2 : 0
    }}>
      {/* Barra de controle - visível apenas quando não em fullscreen */}
      {!fullscreenMode && (
        <Container maxWidth="xl" sx={{ mb: 3}}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              backgroundColor: "white",
              borderRadius: 2
            }}
          >
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#1c286d", mb: 0.5 }}>
                  Reservas do Dia
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ScheduleIcon fontSize="small" />
                  {dataFormatada}
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip 
                  label={`${reservas.length} reserva${reservas.length !== 1 ? 's' : ''}`}
                  color="primary"
                  size="small"
                />
                <Tooltip title="Modo telão (oculta menu e footer)">
                  <Button
                    variant="outlined"
                    startIcon={<MaximizeIcon />}
                    onClick={toggleFullscreen}
                    size="small"
                    sx={{
                      borderColor: "#1c286d",
                      color: "#1c286d",
                      "&:hover": { 
                        borderColor: "#0d1b5a",
                        backgroundColor: "rgba(28, 40, 109, 0.04)"
                      }
                    }}
                  >
                    Telão
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Container>
      )}

      {/* Header em modo fullscreen */}
      {fullscreenMode && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 2, 
            backgroundColor: "#1c286d",
            color: "white",
            borderRadius: 1
          }}
        >
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                RESERVAS DO DIA
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {dataFormatada.toUpperCase()}
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ 
                display: "flex", 
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center"
              }}>
                <Chip 
                  label={`${contarReservasPorStatus("APPROVED")} CONFIRMADAS`}
                  sx={{ 
                    backgroundColor: "#4caf50", 
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.75rem"
                  }}
                  size="small"
                />
                <Chip 
                  label={`${reservas.length} TOTAL`}
                  sx={{ 
                    backgroundColor: "white", 
                    color: "#1c286d",
                    fontWeight: 600,
                    fontSize: "0.75rem"
                  }}
                  size="small"
                />
              </Box>
              
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MinimizeIcon />}
                onClick={toggleFullscreen}
                size="small"
                sx={{ 
                  backgroundColor: "white", 
                  color: "#1c286d",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#f5f5f5" }
                }}
              >
                SAIR
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Conteúdo principal */}
      <Container 
        maxWidth={fullscreenMode ? false : "xl"} 
        disableGutters={fullscreenMode}
        sx={{ 
          px: fullscreenMode ? 3 : 2,
          width: "100%"
        }}
      >
        {/* Loading/Error */}
        {loading ? (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "50vh" 
          }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        ) : reservas.length === 0 ? (
          <Paper sx={{ 
            p: 4, 
            textAlign: "center",
            borderRadius: 2
          }}>
            <ComputerIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma reserva para hoje
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Não há reservas agendadas para o dia de hoje.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Grid de cards - MAIS COMPACTO em modo telão */}
            <Grid container spacing={fullscreenMode ? 1.5 : 3}>
              {reservasOrdenadas.map((reserva) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={fullscreenMode ? 6 : 6} 
                  md={fullscreenMode ? 4 : 4} 
                  lg={fullscreenMode ? 3 : 3} 
                  xl={fullscreenMode ? 2 : 3}
                  key={reserva.id}
                  sx={{
                    // Ajuste de altura mínima
                    minHeight: fullscreenMode ? "auto" : "180px"
                  }}
                >
                  <ReservaCard reserva={reserva} />
                </Grid>
              ))}
            </Grid>

            {/* Status bar em modo fullscreen */}
            {fullscreenMode && reservas.length > 0 && (
              <Paper 
                elevation={0}
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 1,
                  border: "1px solid #e0e0e0"
                }}
              >
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon fontSize="small" />
                    Atualizado: {format(new Date(), "HH:mm:ss")}
                  </Typography>
                  
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#4caf50" }}>
                        {contarReservasPorStatus("APPROVED")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Confirmadas
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#ff9800" }}>
                        {contarReservasPorStatus("PENDING")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pendentes
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1c286d" }}>
                        {reservas.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Indicador de atualização automática em modo telão */}
      {fullscreenMode && (
        <Box sx={{ 
          position: "fixed", 
          bottom: 8, 
          right: 8,
          display: "flex",
          alignItems: "center",
          gap: 0.5
        }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: "50%", 
            backgroundColor: "#4caf50",
            animation: "pulse 2s infinite"
          }} />
          <Typography variant="caption" sx={{ 
            color: "rgba(0,0,0,0.6)",
            fontWeight: 500
          }}>
            ATUALIZANDO AUTOMATICAMENTE
          </Typography>
        </Box>
      )}

      {/* Estilo para animação de pulse */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}