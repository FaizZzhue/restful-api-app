import { request } from './api';

// Endpoint backend: routes/fakultasRoutes.js
// Response fakultas: { id, nama, singkatan }

// GET /fakultas -> array fakultas
export function getAllFakultas() {
  return request('/fakultas');
}

// GET /fakultas/:id -> satu fakultas
export function getFakultasById(id) {
  return request(`/fakultas/${id}`);
}

// POST /fakultas (butuh API key) -> fakultas baru
export function createFakultas(data) {
  return request('/fakultas', { method: 'POST', body: data });
}

// DELETE /fakultas/:id (butuh API key) -> 204
export function deleteFakultas(id) {
  return request(`/fakultas/${id}`, { method: 'DELETE' });
}
