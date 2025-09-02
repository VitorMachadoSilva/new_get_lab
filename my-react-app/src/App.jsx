// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/RegisterPage";
import LabsList from "./pages/LabsList";
import ReservationForm from "./pages/ReservationForm";
import MyReservations from "./pages/MyReservations";
import AdminDashboard from "./pages/AdminDashboardPage";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default function App() {
  const auth = useAuth();
  
  console.log('App renderizado:', { user: auth.user, loading: auth.loading });

  if (auth.loading) {
    console.log('App: carregando, mostrando spinner');
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="loading-spinner">
          <p>Carregando...</p>
        </div>
      </ThemeProvider>
    );
  }

  console.log('App: não está carregando, renderizando rotas');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!auth.user ? <Login onLogin={auth.login} /> : <Navigate to="/" />} />
          <Route path="/register" element={!auth.user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={
            <ProtectedRoute user={auth.user}>
              <Layout user={auth.user} onLogout={auth.logout}>
                <LabsList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reserve" element={
            <ProtectedRoute user={auth.user}>
              <Layout user={auth.user} onLogout={auth.logout}>
                <ReservationForm />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-reservations" element={
            <ProtectedRoute user={auth.user}>
              <Layout user={auth.user} onLogout={auth.logout}>
                <MyReservations />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute user={auth.user}>
              <Layout user={auth.user} onLogout={auth.logout}>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute user={auth.user}>
              <Layout user={auth.user} onLogout={auth.logout}>
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}