// src/api/auth.js
import api from "./client";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data.access_token;
}

export async function signup(user) {
  const res = await api.post("/auth/register", user);
  return res.data;
}

export async function me() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function getUsers() {
  const res = await api.get("/auth/users");
  return res.data;
}

export async function updatePassword(currentPassword, newPassword) {
  const res = await api.put("/auth/password", { currentPassword, newPassword });
  return res.data;
}