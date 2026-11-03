import { request } from './api';

// Endpoint backend: routes/prodiRoutes.js
// Response prodi: { _id, kode, nama, fakultasId }

// GET /prodi -> array prodi
export function getAllProdi() {
  return request('/prodi');
}

// POST /prodi (butuh API key) -> prodi baru
export function createProdi(data) {
  return request('/prodi', { method: 'POST', body: data });
}

// DELETE /prodi/:id (butuh API key) -> 204
export function deleteProdi(id) {
  return request(`/prodi/${id}`, { method: 'DELETE' });
}
