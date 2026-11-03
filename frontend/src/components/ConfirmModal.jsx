// Modal konfirmasi sederhana (pengganti SweetAlert di website referensi).
// Ditampilkan hanya jika prop "open" bernilai true.
function ConfirmModal({ open, title, message, confirmText = 'Ya, hapus', loading, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onCancel}>
      {/* stopPropagation agar klik di dalam dialog tidak menutup modal */}
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Batal
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Menghapus...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

