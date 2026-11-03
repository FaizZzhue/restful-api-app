import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import MahasiswaForm from '../components/MahasiswaForm';
import { getAllMahasiswa, deleteMahasiswa } from '../services/mahasiswaService';
import { getAllProdi } from '../services/prodiService';

const LIMIT = 10; // jumlah data per halaman

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Terbaru' },
  { value: 'createdAt', label: 'Terlama' },
  { value: 'nama', label: 'Nama (A–Z)' },
  { value: '-nama', label: 'Nama (Z–A)' },
  { value: 'nim', label: 'NIM (kecil–besar)' },
  { value: '-nim', label: 'NIM (besar–kecil)' },
];

function formatTgl(tglStr) {
  if (!tglStr) return '-';
  try {
    const d = new Date(tglStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [prodiList, setProdiList] = useState([]);

  // Filter & pagination
  const [page, setPage] = useState(1);
  const [filterProdi, setFilterProdi] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [reloadKey, setReloadKey] = useState(0);

  // Status UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mode, setMode] = useState('list'); // "list" | "form"
  const [editing, setEditing] = useState(null);

  // Hapus
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getAllProdi()
      .then(setProdiList)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllMahasiswa({ page, limit: LIMIT, sort, prodi: filterProdi });
        if (res.data.length === 0 && page > 1) {
          setPage(page - 1);
          return;
        }
        setMahasiswa(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [page, sort, filterProdi, reloadKey]);

  function openForm(data = null) {
    setSuccess(null);
    setEditing(data);
    setMode('form');
  }

  function handleSaved(message) {
    setSuccess(message);
    setMode('list');
    setEditing(null);
    setReloadKey((k) => k + 1);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteMahasiswa(toDelete._id);
      setSuccess(`Mahasiswa "${toDelete.nama}" berhasil dihapus.`);
      setToDelete(null);
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  if (mode === 'form') {
    return (
      <MahasiswaForm
        mahasiswa={editing}
        prodiList={prodiList}
        onSuccess={handleSaved}
        onCancel={() => setMode('list')}
      />
    );
  }

  const nomorAwal = (page - 1) * LIMIT;

  return (
    <div>
      <h1>Data Mahasiswa</h1>
      <p className="page-subtitle">Kelola data mahasiswa lengkap: NIM, tempat/tanggal lahir, alamat, dan prodi.</p>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Tambah Mahasiswa
        </button>

        <div className="toolbar-filters">
          <div>
            <label htmlFor="filterProdi">Program Studi</label>
            <select
              id="filterProdi"
              className="form-select"
              value={filterProdi}
              onChange={(e) => {
                setFilterProdi(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Prodi</option>
              {prodiList.map((p) => (
                <option key={p._id} value={p.kode}>
                  {p.kode} - {p.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort">Urutkan</label>
            <select
              id="sort"
              className="form-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
      {error && <Alert type="danger" onClose={() => setError(null)}>Error: {error}</Alert>}

      {loading && <Loading />}

      {!loading && !error && mahasiswa.length === 0 && (
        <EmptyState
          message={filterProdi ? 'Tidak ada mahasiswa pada prodi ini.' : 'Belum ada data mahasiswa.'}
        />
      )}

      {!loading && mahasiswa.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="col-no">No</th>
                  <th>NIM / NPM</th>
                  <th>Nama</th>
                  <th>Tempat Lahir</th>
                  <th>Tanggal Lahir</th>
                  <th>Kota</th>
                  <th>Prodi</th>
                  <th className="col-aksi">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mahasiswa.map((m, index) => {
                  const tgl = m.tanggalLahir || m.tanggal_lahir;
                  const tempat = m.tempatLahir || m.tempat_lahir || '-';
                  return (
                    <tr key={m._id}>
                      <td>{nomorAwal + index + 1}</td>
                      <td>{m.nim || m.npm}</td>
                      <td>{m.nama}</td>
                      <td>{tempat}</td>
                      <td>{formatTgl(tgl)}</td>
                      <td>{m.alamat?.kota || '-'}</td>
                      <td>
                        {m.prodiId ? (
                          <>
                            <span className="badge badge-primary">{m.prodiId.kode}</span> {m.prodiId.nama}
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="col-aksi">
                        <div className="btn-group">
                          <button className="btn btn-warning btn-sm" onClick={() => openForm(m)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setToDelete(m)}>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination-bar">
            <span className="pagination-info">
              Menampilkan {nomorAwal + 1}–{nomorAwal + mahasiswa.length} dari {total} data
            </span>
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                ‹ Sebelumnya
              </button>
              <span className="pagination-info">
                Halaman {page} / {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Berikutnya ›
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Hapus Mahasiswa"
        message={`Yakin mau hapus mahasiswa a.n ${toDelete?.nama} (${toDelete?.nim || toDelete?.npm})? Data yang dihapus tidak dapat dikembalikan.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default MahasiswaPage;
