export default function NavStrip() {
  return (
    <div className="nav-strip">
      <div className="nav-inner">
        <div className="nav-item">Format: <strong>CSV, XLSX, XLS</strong></div>
        <div className="nav-item">Kolom: <strong>provinsi, kabkota, tahun, ipm, rls, hls</strong></div>
        <div className="nav-item">Bobot: <strong>IPM 50% / RLS 25% / HLS 25%</strong></div>
        <div className="nav-spacer" />
        <div className="nav-item">Metode: <strong>Normalisasi Min-Max</strong></div>
      </div>
    </div>
  );
}
