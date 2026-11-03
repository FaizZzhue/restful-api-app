import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import ProdiForm from '../components/ProdiForm';
import { getAllProdi, deleteProdi } from '../services/prodiService';
import { getAllFakultas } from '../services/fakultasService';

function ProdiPage() {
  const [prodi, setProdi] = useState([]);
  const [fakultasMap, setFakultasMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mode, setMode] = useState('list'); // "list" | "form"

  // Status hapus
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [prodiData, fakultasData] = await Promise.all([
        getAllProdi(),
        getAllFakultas().catch(() => []),
      ]);
      setProdi(prodiData);

      // Buat map ID -> data fakultas untuk kemudahan lookup di tabel
      const fMap = {};
      fakultasData.forEach((f) => {
        fMap[f.id] = f;
      });
      setFakultasMap(fMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleSaved(message) {
    setSuccess(message);
    setMode('list');
    loadData();
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteProdi(toDelete._id);
      setSuccess(`Program studi "${toDelete.nama}" (${toDelete.kode}) berhasil dihapus.`);
      setToDelete(null);
      loadData();
    } catch (err) {
      setError(err.message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  if (mode === 'form') {
    return <ProdiForm onSuccess={handleSaved} onCancel={() => setMode('list')} />;
  }

  return (
    <div>
      <h1>Data Program Studi</h1>
      <p className="page-subtitle">Daftar program studi dan fakultas penaung.</p>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setSuccess(null);
          setMode('form');
        }}
      >
        + Tambah Prodi
      </button>

      <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
      {error && <Alert type="danger" onClose={() => setError(null)}>Error: {error}</Alert>}

      {loading && <Loading />}

      {!loading && !error && prodi.length === 0 && (
        <EmptyState message="Belum ada data program studi. Tambahkan data baru." />
      )}

      {!loading && !error && prodi.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th className="col-no">No</th>
                <th>Kode</th>
                <th>Nama Program Studi</th>
                <th>Fakultas</th>
                <th className="col-aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prodi.map((p, index) => {
                const fak = p.fakultasId ? fakultasMap[p.fakultasId] : null;
                return (
                  <tr key={p._id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="badge badge-primary">{p.kode}</span>
                    </td>
                    <td>{p.nama}</td>
                    <td>
                      {fak ? (
                        <>
                          {fak.singkatan && <span className="badge badge-primary me-1">{fak.singkatan}</span>}
                          {fak.nama}
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="col-aksi">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setToDelete(p)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Hapus Program Studi"
        message={`Yakin mau hapus program studi "${toDelete?.nama}" (${toDelete?.kode})? Tindakan ini tidak dapat dibatalkan.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default ProdiPage;
