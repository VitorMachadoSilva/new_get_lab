// Página de login: autentica usuário e propaga token via onLogin.
import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link
} from "@mui/material";
// import { Login as LoginIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import GetLabIcon from '../assets/GetLab-png.png';
import CustomTextField from "../components/CustomTextField";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      const token = await apiLogin(formData.email, formData.password);
      onLogin(token);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-login-gradient">
      <Container className="body_login" component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        > 
          <Paper elevation={3} sx={{ padding: 4, width: "100%", backgroundColor: '#dce0f3ff', borderRadius: 8, boxShadow: '12px 24px 100px rgba(0, 0, 0, 0.1)',  }}>
            <Box 
              sx={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
              }}
            >
              <img
                src={GetLabIcon}
                alt="GetLab Logo"
                style={{ width: 70, marginBottom: 16 }}
              />

              <Typography component="h1" variant="h5">
                Entrar no GetLab
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
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <Box textAlign="center">
                <Link component={RouterLink} to="/register" variant="body2">
                  Sem conta? Faça seu cadastro
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}