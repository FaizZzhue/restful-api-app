import { useState } from 'react';
import Alert from './Alert';
import { createMahasiswa, updateMahasiswa } from '../services/mahasiswaService';

function formatTglInput(val) {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

/**
 * Form tambah & edit mahasiswa.
 * - mahasiswa = null  -> mode tambah (POST /mahasiswa)
 * - mahasiswa = objek -> mode edit   (PUT /mahasiswa/:id)
 */
function MahasiswaForm({ mahasiswa, prodiList, onSuccess, onCancel }) {
  const isEdit = Boolean(mahasiswa);

  // Isi awal form. Tempat lahir & tanggal lahir mendukung baik camelCase maupun snake_case
  const [form, setForm] = useState({
    nim: mahasiswa?.nim || mahasiswa?.npm || '',
    nama: mahasiswa?.nama || '',
    tempatLahir: mahasiswa?.tempatLahir || mahasiswa?.tempat_lahir || '',
    tanggalLahir: formatTglInput(mahasiswa?.tanggalLahir || mahasiswa?.tanggal_lahir),
    jalan: mahasiswa?.alamat?.jalan || '',
    kota: mahasiswa?.alamat?.kota || '',
    prodiId: mahasiswa?.prodiId?._id || mahasiswa?.prodiId || mahasiswa?.prodi_id?._id || mahasiswa?.prodi_id || '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function validate(data) {
    const hasil = {};
    if (!data.nim.trim()) hasil.nim = 'NIM / NPM wajib diisi';
    else if (!/^\d{5,15}$/.test(data.nim.trim())) hasil.nim = 'NIM / NPM harus berupa angka (5–15 digit)';

    if (!data.nama.trim()) hasil.nama = 'Nama lengkap wajib diisi';
    else if (data.nama.trim().length < 3) hasil.nama = 'Nama minimal 3 karakter';

    if (!data.tempatLahir.trim()) hasil.tempatLahir = 'Tempat lahir wajib diisi';
    if (!data.tanggalLahir) hasil.tanggalLahir = 'Tanggal lahir wajib diisi';

    if (!data.prodiId) hasil.prodiId = 'Program studi wajib dipilih';

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

    // Payload dikirim lengkap mencakup tempat & tanggal lahir serta id prodi
    const body = {
      nim: form.nim.trim(),
      nama: form.nama.trim(),
      tempatLahir: form.tempatLahir.trim(),
      tanggalLahir: form.tanggalLahir,
      tempat_lahir: form.tempatLahir.trim(),
      tanggal_lahir: form.tanggalLahir,
      alamat: {
        jalan: form.jalan.trim(),
        kota: form.kota.trim(),
      },
      prodiId: form.prodiId,
    };

    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        const hasilUpdate = await updateMahasiswa(mahasiswa._id, body);
        onSuccess(`Data mahasiswa "${hasilUpdate.nama}" berhasil diperbarui.`);
      } else {
        const baru = await createMahasiswa(body);
        onSuccess(`Mahasiswa "${baru.nama}" berhasil ditambahkan.`);
      }
    } catch (err) {
      if (err.message.includes('duplicate')) {
        setError(`NIM / NPM ${body.nim} sudah digunakan mahasiswa lain.`);
      } else if (isEdit && err.message === 'Terjadi kesalahan pada server') {
        setError('Terjadi kesalahan pada server. Periksa apakah NIM / NPM sudah digunakan mahasiswa lain.');
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-card">
      <h2 className="mb-4">{isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</h2>

      <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>
      {prodiList.length === 0 && (
        <Alert type="warning">Belum ada program studi. Tambahkan prodi terlebih dahulu.</Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="nim" className="form-label">
              NIM / NPM <span className="required">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="nim"
              name="nim"
              className={`form-control ${errors.nim ? 'is-invalid' : ''}`}
              value={form.nim}
              onChange={handleChange}
              placeholder="Contoh: 2301026"
              disabled={saving}
              autoFocus
            />
            {errors.nim && <div className="invalid-feedback">{errors.nim}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="nama" className="form-label">
              Nama Lengkap <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              className={`form-control ${errors.nama ? 'is-invalid' : ''}`}
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Andi Saputra"
              disabled={saving}
            />
            {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="tempatLahir" className="form-label">
              Tempat Lahir <span className="required">*</span>
            </label>
            <input
              type="text"
              id="tempatLahir"
              name="tempatLahir"
              className={`form-control ${errors.tempatLahir ? 'is-invalid' : ''}`}
              value={form.tempatLahir}
              onChange={handleChange}
              placeholder="Contoh: Palembang"
              disabled={saving}
            />
            {errors.tempatLahir && <div className="invalid-feedback">{errors.tempatLahir}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="tanggalLahir" className="form-label">
              Tanggal Lahir <span className="required">*</span>
            </label>
            <input
              type="date"
              id="tanggalLahir"
              name="tanggalLahir"
              className={`form-control ${errors.tanggalLahir ? 'is-invalid' : ''}`}
              value={form.tanggalLahir}
              onChange={handleChange}
              disabled={saving}
            />
            {errors.tanggalLahir && <div className="invalid-feedback">{errors.tanggalLahir}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="jalan" className="form-label">Alamat (Jalan)</label>
            <input
              type="text"
              id="jalan"
              name="jalan"
              className="form-control"
              value={form.jalan}
              onChange={handleChange}
              placeholder="Contoh: Jl. Merdeka No. 10"
              disabled={saving}
            />
          </div>

          <div className="form-row">
            <label htmlFor="kota" className="form-label">Kota</label>
            <input
              type="text"
              id="kota"
              name="kota"
              className="form-control"
              value={form.kota}
              onChange={handleChange}
              placeholder="Contoh: Palembang"
              disabled={saving}
            />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="prodiId" className="form-label">
            ID / Program Studi <span className="required">*</span>
          </label>
          <select
            id="prodiId"
            name="prodiId"
            className={`form-select ${errors.prodiId ? 'is-invalid' : ''}`}
            value={form.prodiId}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="">-- Pilih Program Studi --</option>
            {prodiList.map((p) => (
              <option key={p._id} value={p._id}>
                {p.kode} - {p.nama}
              </option>
            ))}
          </select>
          {errors.prodiId && <div className="invalid-feedback">{errors.prodiId}</div>}
        </div>

        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="spinner"></span>}
            {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default MahasiswaForm;
