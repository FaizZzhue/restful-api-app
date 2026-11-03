import { useState, useEffect } from 'react';
import Alert from './Alert';
import { createProdi } from '../services/prodiService';
import { getAllFakultas } from '../services/fakultasService';

const FORM_KOSONG = { kode: '', nama: '', fakultasId: '' };

// Form tambah program studi dengan ID Fakultas dari select dropdown
function ProdiForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(FORM_KOSONG);
  const [fakultasList, setFakultasList] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingFakultas, setLoadingFakultas] = useState(true);

  // Ambil data fakultas yang tersedia untuk opsi dropdown
  useEffect(() => {
    async function loadFakultas() {
      try {
        setLoadingFakultas(true);
        const data = await getAllFakultas();
        setFakultasList(data);
      } catch (err) {
        setError(`Gagal memuat daftar fakultas: ${err.message}`);
      } finally {
        setLoadingFakultas(false);
      }
    }
    loadFakultas();
  }, []);

  function validate(data) {
    const hasil = {};
    if (!data.kode.trim()) hasil.kode = 'Kode prodi wajib diisi';
    else if (!/^[A-Za-z0-9]{2,10}$/.test(data.kode.trim()))
      hasil.kode = 'Kode 2–10 karakter, hanya huruf/angka tanpa spasi';

    if (!data.nama.trim()) hasil.nama = 'Nama prodi wajib diisi';
    else if (data.nama.trim().length < 3) hasil.nama = 'Nama prodi minimal 3 karakter';

    if (!data.fakultasId) hasil.fakultasId = 'Fakultas wajib dipilih';

    return hasil;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const baru = { ...form, [name]: value };
    setForm(baru);
    if (errors[name]) setErrors(validate(baru));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasil = validate(form);
    setErrors(hasil);
    if (Object.keys(hasil).length > 0) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        kode: form.kode.trim().toUpperCase(),
        nama: form.nama.trim(),
        fakultasId: Number(form.fakultasId),
      };
      const baru = await createProdi(payload);
      onSuccess(`Program studi "${baru.nama}" (${baru.kode}) berhasil ditambahkan.`);
    } catch (err) {
      setError(err.message.includes('duplicate') ? 'Kode prodi sudah digunakan.' : err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-card">
      <h2 className="mb-4">Tambah Program Studi</h2>

      <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>

      {fakultasList.length === 0 && !loadingFakultas && (
        <Alert type="warning">
          Belum ada data fakultas. Silakan tambahkan fakultas terlebih dahulu.
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="kode" className="form-label">
            Kode / Singkatan Prodi <span className="required">*</span>
          </label>
          <input
            type="text"
            id="kode"
            name="kode"
            className={`form-control ${errors.kode ? 'is-invalid' : ''}`}
            value={form.kode}
            onChange={handleChange}
            placeholder="Contoh: SI"
            disabled={saving}
            autoFocus
          />
          {errors.kode ? (
            <div className="invalid-feedback">{errors.kode}</div>
          ) : (
            <div className="form-text">Otomatis diubah menjadi huruf kapital.</div>
          )}
        </div>

        <div className="form-row">
          <label htmlFor="nama" className="form-label">
            Nama Prodi <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            className={`form-control ${errors.nama ? 'is-invalid' : ''}`}
            value={form.nama}
            onChange={handleChange}
            placeholder="Contoh: Sistem Informasi"
            disabled={saving}
          />
          {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="fakultasId" className="form-label">
            Fakultas <span className="required">*</span>
          </label>
          <select
            id="fakultasId"
            name="fakultasId"
            className={`form-select ${errors.fakultasId ? 'is-invalid' : ''}`}
            value={form.fakultasId}
            onChange={handleChange}
            disabled={saving || loadingFakultas}
          >
            <option value="">
              {loadingFakultas ? 'Memuat daftar fakultas...' : '-- Pilih Fakultas --'}
            </option>
            {fakultasList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.singkatan ? `${f.singkatan} - ` : ''}{f.nama}
              </option>
            ))}
          </select>
          {errors.fakultasId && <div className="invalid-feedback">{errors.fakultasId}</div>}
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="spinner"></span>}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProdiForm;
