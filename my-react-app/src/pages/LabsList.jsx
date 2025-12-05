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
} from "@mui/material";
import { Computer, Schedule } from "@mui/icons-material";
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {/* Título principal */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#1a237e",
        }}
      >
        Ambientes de Aula
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {labs.map((lab) => {
          const isSelected = selectedLab === lab.id;

          return (
            <Grid item xs={12} sm={6} md={4} key={lab.id}>
              <Card
                onClick={() => handleSelectLab(lab.id)}
                sx={{
                  background: "linear-gradient(180deg, #2e3a52 0%, #32405b 100%)",
                  color: "white",
                  borderRadius: "14px 14px 22px 22px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  border: isSelected ? "3px solid #a460f9" : "3px solid transparent",
                  transition: "0.2s",
                  "&:hover": { transform: "scale(1.015)" },
                }}
              >
                {/* Cabeçalho do card */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    <Computer sx={{ fontSize: 20, mr: 1 }} />
                    {lab.name}
                  </Typography>

                  {/* Badge Disponível/Reservado */}
                  <Box
                    sx={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      backgroundColor: lab.available ? "#64dd57" : "#d9534f",
                      color: "white",
                    }}
                  >
                    {lab.available ? "Disponível" : "Reservado"}
                  </Box>
                </Box>

                {/* Local */}
                <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
                  {lab.location} - Laboratório
                </Typography>

                {/* Informações */}
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {lab.capacity} computadores;
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Ar Condicionado;
                </Typography>

                {lab.name.includes("Lab 1") ? (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Projetos;
                  </Typography>
                ) : lab.name.includes("Lab 2") ? (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    iLab;
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Bar;
                  </Typography>
                )}

                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Quadro;
                </Typography>

                {/* Botão Reservar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    opacity: lab.available ? 1 : 0.4,
                  }}
                >
                  <Button
                    variant="text"
                    sx={{
                      color: "#c9d8ff",
                      textTransform: "none",
                      fontWeight: "bold",
                      minWidth: 0,
                      paddingRight: 0,
                      paddingLeft: 0,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.08)",
                      },
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (lab.available) navigate(`/reserve?lab_id=${lab.id}`);
                    }}
                    disabled={!lab.available}
                  >
                    Reservar
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        border: "2px solid #99a9d9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Schedule sx={{ fontSize: 16, color: "#99a9d9" }} />
                    </Box>
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}

        {labs.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", padding: "40px" }}>
            <Typography variant="h6" color="textSecondary">
              Nenhum laboratório cadastrado
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
}
