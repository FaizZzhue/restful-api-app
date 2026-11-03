// =========================================================
// Helper dasar untuk memanggil REST API backend dengan fetch()
// Dipakai oleh semua file service (fakultas, prodi, mahasiswa).
// =========================================================

// Nilai diambil dari file frontend/.env (lihat .env.example)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Mengirim request ke backend dan mengembalikan data JSON.
 * @param {string} path    contoh: '/mahasiswa?page=1'
 * @param {object} options { method, body }
 */
export async function request(path, { method = 'GET', body } = {}) {
  const headers = {};

  // Body dikirim dalam format JSON
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  // Backend mewajibkan header x-api-key untuk POST, PUT, dan DELETE
  if (method !== 'GET') {
    headers['x-api-key'] = API_KEY;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch() hanya gagal (throw) bila server tidak bisa dihubungi
    throw new Error(`Tidak dapat terhubung ke server (${API_URL}). Pastikan backend sudah berjalan.`);
  }

  // 204 No Content (contoh: DELETE mahasiswa) tidak memiliki body
  if (response.status === 204) return null;

  // Coba baca body sebagai JSON (bisa gagal bila body bukan JSON)
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Backend selalu mengirim error dalam bentuk { message: '...' }
    const message = data?.message || `Request gagal (HTTP ${response.status})`;
    throw new Error(message);
  }

  return data;
}

