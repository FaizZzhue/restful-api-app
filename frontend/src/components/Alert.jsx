// Kotak pesan (success / danger / info / warning).
// Jika prop onClose diberikan, muncul tombol × untuk menutup.
function Alert({ type = 'info', children, onClose }) {
  if (!children) return null;

  return (
    <div className={`alert alert-${type} ${onClose ? 'alert-dismissible' : ''}`} role="alert">
      {children}
      {onClose && (
        <button type="button" className="btn-close" aria-label="Tutup" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;

