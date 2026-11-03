import { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import FakultasPage from './pages/FakultasPage';
import ProdiPage from './pages/ProdiPage';
import MahasiswaPage from './pages/MahasiswaPage';

// Navigasi sederhana tanpa React Router:
// state "page" menentukan halaman mana yang ditampilkan.
function App() {
  const [page, setPage] = useState('dashboard');

  function renderPage() {
    switch (page) {
      case 'fakultas':
        return <FakultasPage />;
      case 'prodi':
        return <ProdiPage />;
      case 'mahasiswa':
        return <MahasiswaPage />;
      default:
        return <DashboardPage onNavigate={setPage} />;
    }
  }

  return (
    <>
      <Navbar activePage={page} onNavigate={setPage} />
      {/* key={page} agar halaman di-reset (kembali ke tabel) setiap pindah menu */}
      <main className="container-fluid main-content" key={page}>
        {renderPage()}
      </main>
    </>
  );
}

export default App;
