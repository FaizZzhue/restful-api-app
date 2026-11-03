import { request } from './api';

// Endpoint backend: routes/mahasiswaRoutes.js
// Response mahasiswa: { _id, nama, nim, alamat: { jalan, kota }, prodiId, createdAt }

/**
 * GET /mahasiswa?page=&limit=&sort=&prodi=&kota=
 * Response: { data, page, limit, total, totalPages }
 * Parameter kosong tidak dikirim ke backend.
 */
export function getAllMahasiswa(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const qs = query.toString();
  return request(`/mahasiswa${qs ? `?${qs}` : ''}`);
}

// GET /mahasiswa/:id -> satu mahasiswa (prodiId ter-populate)
export function getMahasiswaById(id) {
  return request(`/mahasiswa/${id}`);
}

// POST /mahasiswa (butuh API key) -> mahasiswa baru
export function createMahasiswa(data) {
  return request('/mahasiswa', { method: 'POST', body: data });
}

// PUT /mahasiswa/:id (butuh API key) -> mahasiswa setelah diubah
export function updateMahasiswa(id, data) {
  return request(`/mahasiswa/${id}`, { method: 'PUT', body: data });
}

// DELETE /mahasiswa/:id (butuh API key) -> 204 tanpa body
export function deleteMahasiswa(id) {
  return request(`/mahasiswa/${id}`, { method: 'DELETE' });
}

