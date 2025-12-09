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
import { Link as RouterLink } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import GetLabIcon from '../assets/GetLab-Branco-Png.png';
// Nota: Removi o CustomTextField pois vou usar TextField padrão com estilos personalizados

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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Lado esquerdo com imagem/logo */}
      <div style={{
        flex: 1,
        backgroundColor: '#1a237e', // Azul escuro similar ao protótipo
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: "20px" }}>
  <img 
    src={GetLabIcon}
    alt="GetLab Logo"
    style={{ width: 80 }}
  />

  <Typography variant="h2" sx={{ fontWeight: "bold" }}>
    GetLab
  </Typography>
</Box>

          <Typography variant="h6">
            Sistema de Gestão Laboratorial
          </Typography>
        </div>
      </div>

      {/* Lado direito com formulário */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <Paper elevation={0} style={{ 
          padding: '40px', 
          width: '100%', 
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <Box style={{ marginBottom: '30px', textAlign: 'center' }}>
            <Typography component="h1" variant="h4" style={{ 
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#1a237e'
            }}>
              Login
            </Typography>
            <Typography variant="body2" style={{ color: '#666' }}>
              Entre com suas credenciais para acessar o sistema
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" style={{ marginBottom: '20px' }}>
                {error}
              </Alert>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                E-mail:
              </label>
              <TextField
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#f9f9f9' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Senha:
              </label>
              <TextField
                fullWidth
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#f9f9f9' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: '#1a237e',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '10px',
                  textTransform: 'none'
                }}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <Button
                variant="outlined"
                style={{
                  flex: 1,
                  borderColor: '#ccc',
                  color: '#666',
                  fontWeight: 'bold',
                  padding: '10px',
                  textTransform: 'none'
                }}
              >
                Cancelar
              </Button>
            </div>

            <Box textAlign="center">
              <Link 
                component={RouterLink} 
                to="/register" 
                style={{ 
                  color: '#1a237e',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Não possui uma conta? Cadastre-se!
              </Link>
            </Box>
          </Box>
        </Paper>
      </div>
    </div>
  );
}