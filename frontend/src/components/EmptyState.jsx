// Tampilan ketika API berhasil dipanggil tetapi datanya kosong
function EmptyState({ message = 'Belum ada data.' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;

