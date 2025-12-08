// API de reservas: listagem geral, por lab/data, por usuário, CRUD e status.
import api from "./client";

export async function getReservations() {
  const res = await api.get("/reservations");
  return res.data;
}

// NOVA FUNÇÃO: Reservas do dia
export async function getReservasDoDia(date) {
  const res = await api.get(`/reservations/dia${date ? `?date=${date}` : ''}`);
  return res.data;
}

export async function getReservationsByLabAndDate(labId, date) {
  const res = await api.get(`/reservations/lab-date?lab_id=${labId}&date=${date}`);
  return res.data;
}

export async function getReservationsByUserId(userId) {
  const res = await api.get(`/reservations/user/${userId}`);
  return res.data;
}

export async function getReservation(id) {
  const res = await api.get(`/reservations/${id}`);
  return res.data;
}

export async function createReservation(reservation) {
  const res = await api.post("/reservations", reservation);
  return res.data;
}

export async function updateReservation(id, reservation) {
  const res = await api.put(`/reservations/${id}`, reservation);
  return res.data;
}

export async function deleteReservation(id) {
  const res = await api.delete(`/reservations/${id}`);
  return res.data;
}