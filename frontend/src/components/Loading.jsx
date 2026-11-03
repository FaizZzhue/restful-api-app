// Indikator loading saat menunggu respons API
function Loading({ text = 'Memuat data...' }) {
  return (
    <div className="loading" role="status">
      <div className="spinner"></div>
      <span>{text}</span>
    </div>
  );
}

export default Loading;

