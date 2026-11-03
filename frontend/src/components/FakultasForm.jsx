import { useState } from 'react';
import Alert from './Alert';
import { createFakultas } from '../services/fakultasService';

// Form tambah fakultas (POST /fakultas) dengan nama lengkap dan singkatan
function FakultasForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({ nama: '', singkatan: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function validate(values) {
    const hasil = {};
    if (!values.nama.trim()) {
      hasil.nama = 'Nama fakultas wajib diisi';
    } else if (values.nama.trim().length < 3) {
      hasil.nama = 'Nama fakultas minimal 3 karakter';
    }

    if (!values.singkatan.trim()) {
      hasil.singkatan = 'Singkatan fakultas wajib diisi';
    } else if (values.singkatan.trim().length > 10) {
      hasil.singkatan = 'Singkatan maksimal 10 karakter';
    }
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
    const validasi = validate(form);
    setErrors(validasi);
    if (Object.keys(validasi).length > 0) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        nama: form.nama.trim(),
        singkatan: form.singkatan.trim().toUpperCase(),
      };
      const baru = await createFakultas(payload);
      onSuccess(`Fakultas "${baru.nama}" (${baru.singkatan}) berhasil ditambahkan.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-card">
      <h2 className="mb-4">Tambah Fakultas</h2>

      <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="nama" className="form-label">
            Nama Fakultas Lengkap <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            className={`form-control ${errors.nama ? 'is-invalid' : ''}`}
            value={form.nama}
            onChange={handleChange}
            placeholder="Contoh: Fakultas Ilmu Komputer dan Rekayasa"
            disabled={saving}
            autoFocus
          />
          {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="singkatan" className="form-label">
            Singkatan <span className="required">*</span>
          </label>
          <input
            type="text"
            id="singkatan"
            name="singkatan"
            className={`form-control ${errors.singkatan ? 'is-invalid' : ''}`}
            value={form.singkatan}
            onChange={handleChange}
            placeholder="Contoh: FIKR"
            disabled={saving}
          />
          {errors.singkatan ? (
            <div className="invalid-feedback">{errors.singkatan}</div>
          ) : (
            <div className="form-text">Otomatis diubah menjadi huruf kapital.</div>
          )}
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

export default FakultasForm;
