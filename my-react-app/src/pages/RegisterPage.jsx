// Página de registro: cria usuário (FACULTY/ADMIN) e redireciona para login.
import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  MenuItem
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import CustomTextField from "../components/CustomTextField";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FACULTY"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validação básica
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      await signup(formData);
      navigate("/login", { 
        state: { message: "Conta criada com sucesso! Faça login para continuar." } 
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3}sx={{ padding: 4, width: "100%", backgroundColor: '#dce0f3ff', borderRadius: 8, boxShadow: '12px 24px 100px rgba(0, 0, 0, 0.1)',  }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <PersonAdd sx={{ fontSize: 40, mb: 2 }} color="primary" />
            <Typography component="h1" variant="h5">
              Criar Conta
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <CustomTextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <CustomTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <CustomTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <CustomTextField
              margin="normal"
              required
              fullWidth
              select
              name="role"
              label="Tipo de Usuário"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="FACULTY">Docente</MenuItem>
              <MenuItem value="ADMIN">Administrador</MenuItem>
            </CustomTextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Já tem uma conta? Faça login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}