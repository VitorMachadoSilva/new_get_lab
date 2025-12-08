// Página de registro: cria usuário (FACULTY/ADMIN) e redireciona para login.
import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  MenuItem
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Lado esquerdo com imagem/logo - MANTIDO IGUAL AO LOGIN */}
      <div style={{
        flex: 1,
        backgroundColor: '#1a237e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <Typography variant="h2" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
            GetLab
          </Typography>
          <Typography variant="h6">
            Sistema de Gestão Laboratorial
          </Typography>
        </div>
      </div>

      {/* Lado direito com formulário de cadastro */}
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
              Criar Conta
            </Typography>
            <Typography variant="body2" style={{ color: '#666' }}>
              Cadastre-se para acessar o sistema
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" style={{ marginBottom: '20px' }}>
                {error}
              </Alert>
            )}

            {/* Campo Nome */}
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="name" style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Nome Completo:
              </label>
              <TextField
                fullWidth
                id="name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#f9f9f9' }}
                required
              />
            </div>

            {/* Campo Email */}
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
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#f9f9f9' }}
                required
              />
            </div>

            {/* Campo Senha */}
            <div style={{ marginBottom: '20px' }}>
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#f9f9f9' }}
                required
              />
            </div>

            {/* Campo Tipo de Usuário */}
            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="role" style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Tipo de Usuário:
              </label>
              <TextField
                fullWidth
                select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#f9f9f9' }}
                required
              >
                <MenuItem value="FACULTY">Docente</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
              </TextField>
            </div>

            {/* Botões */}
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
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
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

            {/* Link para login */}
            <Box textAlign="center">
              <Link 
                component={RouterLink} 
                to="/login" 
                style={{ 
                  color: '#1a237e',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Já possui uma conta? Faça login!
              </Link>
            </Box>
          </Box>
        </Paper>
      </div>
    </div>
  );
}