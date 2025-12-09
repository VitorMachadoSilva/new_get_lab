// Lista de laboratórios disponíveis: exibe cards visualmente iguais ao protótipo.
import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Container,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Divider,
  alpha,
} from "@mui/material";
import { 
  Computer, 
  Schedule, 
  LocationOn, 
  People, 
  AcUnit, 
  Videocam,
  LocalBar,
  Dashboard,
  CheckCircle,
  Block
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getLabs } from "../api/labService";

export default function LabsList() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedLab, setSelectedLab] = useState(null);

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setLoading(true);
      const data = await getLabs();
      setLabs(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar laboratórios");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLab = (labId) => {
    setSelectedLab(labId === selectedLab ? null : labId);
  };

  // Função para determinar ícones baseados no nome do lab
  const getLabFeatures = (labName) => {
    const features = [
      { icon: <People />, text: "Computadores", value: labName.includes("Lab") ? "20" : "15" },
      { icon: <AcUnit />, text: "Ar Condicionado" },
      { icon: <Dashboard />, text: "Quadro Digital" }
    ];

    if (labName.includes("Lab 1")) {
      features.push({ icon: <Videocam />, text: "Projetor Multimídia" });
    } else if (labName.includes("Lab 2")) {
      features.push({ icon: <Computer />, text: "iLab - Software Especializado" });
    } else {
      features.push({ icon: <LocalBar />, text: "Espaço Colaborativo" });
    }

    return features;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          background: "linear-gradient(135deg, #f5f7ff 0%, #eef1ff 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#1c286d" }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Cabeçalho */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: "linear-gradient(45deg, #1c286d 30%, #3a4a9d 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          Laboratórios Disponíveis
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            maxWidth: "600px",
            mx: "auto",
            mb: 4,
          }}
        >
          Selecione um dos ambientes abaixo para realizar sua reserva. Todos equipados com tecnologia de ponta.
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(28, 40, 109, 0.1)"
          }} 
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {labs.map((lab) => {
          const isSelected = selectedLab === lab.id;
          const features = getLabFeatures(lab.name);
          const isAvailable = lab.available;

          return (
            <Grid item xs={12} sm={6} md={4} key={lab.id}>
              <Card
                onClick={() => handleSelectLab(lab.id)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isSelected 
                    ? "0 20px 40px rgba(28, 40, 109, 0.3)"
                    : "0 8px 24px rgba(28, 40, 109, 0.15)",
                  border: isSelected 
                    ? `2px solid #1c286d`
                    : "2px solid transparent",
                  backgroundColor: isSelected 
                    ? alpha("#1c286d", 0.03) 
                    : "background.paper",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 32px rgba(28, 40, 109, 0.25)",
                    borderColor: alpha("#1c286d", 0.3),
                  },
                  position: "relative",
                }}
              >
                {/* Indicador de status */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 2,
                  }}
                >
                  <Chip
                    icon={isAvailable ? <CheckCircle /> : <Block />}
                    label={isAvailable ? "Disponível" : "Indisponível"}
                    size="small"
                    sx={{
                      backgroundColor: isAvailable 
                        ? alpha("#4caf50", 0.15) 
                        : alpha("#f44336", 0.15),
                      color: isAvailable ? "#2e7d32" : "#d32f2f",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      px: 1,
                      border: `1px solid ${isAvailable ? alpha("#4caf50", 0.3) : alpha("#f44336", 0.3)}`,
                    }}
                  />
                </Box>

                {/* Cabeçalho com gradiente */}
                <Box
                  sx={{
                    background: "linear-gradient(90deg, #1c286d 0%, #3a4a9d 100%)",
                    color: "white",
                    p: 3,
                    pb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha("#fff", 0.2),
                        mr: 2,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <Computer sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.5rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {lab.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          display: "flex",
                          alignItems: "center",
                          mt: 0.5,
                        }}
                      >
                        <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                        {lab.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Capacidade */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha("#1c286d", 0.05),
                    }}
                  >
                    <People sx={{ color: "#1c286d", mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1c286d" }}>
                        Capacidade
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {lab.capacity} computadores
                      </Typography>
                    </Box>
                  </Box>

                  {/* Recursos */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "#1c286d" }}>
                    Recursos disponíveis:
                  </Typography>
                  <Grid container spacing={1}>
                    {features.map((feature, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: alpha("#1c286d", 0.03),
                            transition: "0.2s",
                            "&:hover": {
                              backgroundColor: alpha("#1c286d", 0.08),
                            },
                          }}
                        >
                          <Box
                            sx={{
                              color: "#1c286d",
                              mr: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                            {feature.text}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>

                <Divider sx={{ opacity: 0.2 }} />

                <CardActions sx={{ p: 3, pt: 2 }}>
                  <Button
                    fullWidth
                    variant={isSelected ? "contained" : "outlined"}
                    startIcon={<Schedule />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAvailable) navigate(`/reserve?lab_id=${lab.id}`);
                    }}
                    disabled={!isAvailable}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      backgroundColor: isSelected ? "#1c286d" : "transparent",
                      color: isSelected ? "white" : "#1c286d",
                      borderColor: "#1c286d",
                      "&:hover": {
                        backgroundColor: isSelected ? alpha("#1c286d", 0.9) : alpha("#1c286d", 0.08),
                        boxShadow: "0 4px 12px rgba(28, 40, 109, 0.2)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: alpha("#1c286d", 0.05),
                        color: alpha("#1c286d", 0.3),
                        borderColor: alpha("#1c286d", 0.1),
                      },
                    }}
                  >
                    {isAvailable ? "Reservar Agora" : "Indisponível"}
                  </Button>
                </CardActions>

                {/* Efeito de seleção */}
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: "linear-gradient(90deg, #1c286d 0%, #3a4a9d 100%)",
                    }}
                  />
                )}
              </Card>
            </Grid>
          );
        })}

        {labs.length === 0 && !loading && (
          <Grid item xs={12}>
            <Card
              sx={{
                textAlign: "center",
                p: 8,
                borderRadius: 3,
                backgroundColor: alpha("#1c286d", 0.02),
                border: `2px dashed ${alpha("#1c286d", 0.2)}`,
              }}
            >
              <Computer sx={{ fontSize: 64, color: alpha("#1c286d", 0.3), mb: 3 }} />
              <Typography variant="h5" sx={{ color: "#1c286d", mb: 2, fontWeight: 600 }}>
                Nenhum laboratório cadastrado
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
                Aguarde enquanto os laboratórios são configurados no sistema.
              </Typography>
              <Button
                variant="outlined"
                onClick={loadLabs}
                sx={{
                  color: "#1c286d",
                  borderColor: "#1c286d",
                  "&:hover": {
                    backgroundColor: alpha("#1c286d", 0.08),
                    borderColor: alpha("#1c286d", 0.8),
                  },
                }}
              >
                Tentar novamente
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Footer informativo */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          Todos os laboratórios possuem suporte técnico especializado
        </Typography>
        <Typography variant="caption" sx={{ color: alpha("#1c286d", 0.6) }}>
          Sistema de Reservas • v2.0
        </Typography>
      </Box>
    </Container>
  );
}