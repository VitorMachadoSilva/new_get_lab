// API de laboratórios: consultas e operações administrativas.
import api from "./client";

export async function getLabs() {
  const res = await api.get("/labs");
  return res.data;
}

export async function getLab(id) {
  const res = await api.get(`/labs/${id}`);
  return res.data;
}

export async function createLab(lab) {
  const res = await api.post("/labs", lab);
  return res.data;
}

export async function updateLab(id, lab) {
  const res = await api.put(`/labs/${id}`, lab);
  return res.data;
}

export async function deleteLab(id) {
  const res = await api.delete(`/labs/${id}`);
  return res.data;
}