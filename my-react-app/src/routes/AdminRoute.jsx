// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

export default function AdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
