// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {
  console.log('ProtectedRoute renderizado:', { user, hasChildren: !!children });
  
  if (!user) {
    console.log('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Usuário autenticado, renderizando conteúdo');
  return children;
}