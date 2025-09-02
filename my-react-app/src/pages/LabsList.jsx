// src/pages/LabsList.jsx
import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import { Computer, Schedule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getLabs } from "../api/labService";

export default function LabsList() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        Laboratórios Disponíveis
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {labs.map((lab) => (
          <Grid item xs={12} sm={6} md={4} key={lab.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Computer sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    {lab.name}
                  </Typography>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {lab.location}
                </Typography>
                <Typography variant="body2" paragraph>
                  {lab.description}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Chip label={`Capacidade: ${lab.capacity}`} variant="outlined" size="small" />
                  <Chip 
                    label={lab.available ? "Disponível" : "Indisponível"} 
                    color={lab.available ? "success" : "error"} 
                    size="small" 
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Schedule />}
                  onClick={() => navigate(`/reserve?lab_id=${lab.id}`)}
                  disabled={!lab.available}
                >
                  Reservar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {labs.length === 0 && !loading && (
        <Box className="empty-state">
          <Typography variant="h6" color="textSecondary">
            Nenhum laboratório cadastrado
          </Typography>
        </Box>
      )}
    </Box>
  );
}