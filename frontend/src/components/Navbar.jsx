import { useState } from 'react';
import logo from '../assets/logo.svg';

// Daftar menu navbar. "key" dipakai App.jsx untuk menentukan halaman aktif.
const MENU = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'fakultas', label: 'Fakultas' },
  { key: 'prodi', label: 'Prodi' },
  { key: 'mahasiswa', label: 'Mahasiswa' },
];

function Navbar({ activePage, onNavigate }) {
  // Status buka/tutup menu pada layar kecil (tombol hamburger)
  const [open, setOpen] = useState(false);

  function handleClick(key) {
    onNavigate(key);
    setOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => handleClick('dashboard')}>
          <img src={logo} alt="" />
          Sistem Akademik
        </button>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Buka menu navigasi"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav">
            {MENU.map((item) => (
              <li key={item.key}>
                <button
                  className={`nav-link ${activePage === item.key ? 'active' : ''}`}
                  aria-current={activePage === item.key ? 'page' : undefined}
                  onClick={() => handleClick(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

