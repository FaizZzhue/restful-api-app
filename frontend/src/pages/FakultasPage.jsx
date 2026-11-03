import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import FakultasForm from '../components/FakultasForm';
import { getAllFakultas, deleteFakultas } from '../services/fakultasService';

function FakultasPage() {
  const [fakultas, setFakultas] = useState([]);
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
      const data = await getAllFakultas();
      setFakultas(data);
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
      await deleteFakultas(toDelete.id);
      setSuccess(`Fakultas "${toDelete.nama}" berhasil dihapus.`);
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
    return <FakultasForm onSuccess={handleSaved} onCancel={() => setMode('list')} />;
  }

  return (
    <div>
      <h1>Data Fakultas</h1>
      <p className="page-subtitle">Daftar fakultas lengkap beserta singkatannya.</p>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setSuccess(null);
          setMode('form');
        }}
      >
        + Tambah Fakultas
      </button>

      <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>
      {error && <Alert type="danger" onClose={() => setError(null)}>Error: {error}</Alert>}

      {loading && <Loading />}

      {!loading && !error && fakultas.length === 0 && <EmptyState message="Belum ada data fakultas." />}

      {!loading && !error && fakultas.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th className="col-no">No</th>
                <th>Nama Fakultas</th>
                <th>Singkatan</th>
                <th className="col-aksi">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {fakultas.map((f, index) => (
                <tr key={f.id}>
                  <td>{index + 1}</td>
                  <td>{f.nama}</td>
                  <td>
                    {f.singkatan ? (
                      <span className="badge badge-primary">{f.singkatan}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="col-aksi">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setToDelete(f)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Hapus Fakultas"
        message={`Yakin mau hapus fakultas "${toDelete?.nama}" (${toDelete?.singkatan || toDelete?.id})? Tindakan ini tidak dapat dibatalkan.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default FakultasPage;
