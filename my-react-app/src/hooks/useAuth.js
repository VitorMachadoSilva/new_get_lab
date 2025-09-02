// Hook de autenticação: mantém usuário e estado de carregamento, faz leitura de /auth/me,
// expõe funções login/logout e persiste token no localStorage.
import { useState, useEffect } from "react";
import { getToken, removeToken } from "../utils/token";
import { me } from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    console.log('useAuth: loadUser chamado');
    const token = getToken();
    console.log('useAuth: token encontrado:', !!token);
    
    if (!token) {
      console.log('useAuth: sem token, definindo loading como false');
      setLoading(false);
      return;
    }
    
    try {
      console.log('useAuth: chamando API me()');
      const data = await me();
      console.log("useAuth: dados do usuário recebidos:", data);
      setUser(data);
    } catch (error) {
      console.error("useAuth: erro ao carregar usuário:", error);
      removeToken();
    } finally {
      console.log('useAuth: definindo loading como false');
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log('useAuth: useEffect executado');
    loadUser();
  }, []);

  console.log('useAuth: renderizando com:', { user, loading });

  const login = async (token) => {
    localStorage.setItem("lab_api_token", token);
    await loadUser();
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return { user, loading, login, logout };
}