import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import { getAllFakultas } from '../services/fakultasService';
import { getAllProdi } from '../services/prodiService';
import { getAllMahasiswa } from '../services/mahasiswaService';

function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({ fakultas: 0, prodi: 0, mahasiswa: 0 });
  const [prodiList, setProdiList] = useState([]); // prodi + jumlah mahasiswa
  const [terbaru, setTerbaru] = useState([]); // 5 mahasiswa terbaru
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        // Panggil beberapa endpoint sekaligus
        const [fakultas, prodi, mahasiswa] = await Promise.all([
          getAllFakultas(),
          getAllProdi(),
          getAllMahasiswa({ limit: 5, sort: '-createdAt' }),
        ]);

        // Jumlah mahasiswa per prodi: pakai filter ?prodi=KODE dan baca "total"
        const jumlahPerProdi = await Promise.all(
          prodi.map((p) => getAllMahasiswa({ prodi: p.kode, limit: 1, fields: 'nim' }))
        );

        setStats({
          fakultas: fakultas.length,
          prodi: prodi.length,
          mahasiswa: mahasiswa.total,
        });
        setProdiList(prodi.map((p, i) => ({ ...p, jumlah: jumlahPerProdi[i].total })));
        setTerbaru(mahasiswa.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const kartu = [
    { key: 'fakultas', label: 'Total Fakultas', value: stats.fakultas, icon: '🏛️', color: 'bg-primary' },
    { key: 'prodi', label: 'Total Program Studi', value: stats.prodi, icon: '📚', color: 'bg-success' },
    { key: 'mahasiswa', label: 'Total Mahasiswa', value: stats.mahasiswa, icon: '🎓', color: 'bg-warning' },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="page-subtitle">Ringkasan data akademik dari REST API backend.</p>

      {loading && <Loading text="Memuat ringkasan data..." />}
      {error && <Alert type="danger">Error: {error}</Alert>}

      {!loading && !error && (
        <>
          <div className="stat-grid">
            {kartu.map((k) => (
              <button
                key={k.key}
                className={`stat-card ${k.color}`}
                onClick={() => onNavigate(k.key)}
                title={`Lihat data ${k.key}`}
              >
                <div>
                  <div className="stat-label">{k.label}</div>
                  <div className="stat-value">{k.value}</div>
                </div>
                <div className="stat-icon">{k.icon}</div>
              </button>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">Mahasiswa per Program Studi</div>
              <div className="card-body">
                {prodiList.length === 0 ? (
                  <EmptyState message="Belum ada program studi." />
                ) : (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Prodi</th>
                        <th>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prodiList.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <span className="badge badge-primary">{p.kode}</span> {p.nama}
                          </td>
                          <td>{p.jumlah}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">Mahasiswa Terbaru</div>
              <div className="card-body">
                {terbaru.length === 0 ? (
                  <EmptyState message="Belum ada data mahasiswa." />
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>NIM</th>
                          <th>Nama</th>
                          <th>Kota</th>
                          <th>Prodi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {terbaru.map((m) => (
                          <tr key={m._id}>
                            <td>{m.nim}</td>
                            <td>{m.nama}</td>
                            <td>{m.alamat?.kota || '-'}</td>
                            <td>{m.prodiId ? m.prodiId.nama : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;

