// src/api/client.js
import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para redirecionar em caso de token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lab_api_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;