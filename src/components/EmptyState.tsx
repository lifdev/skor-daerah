export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-label">Belum Ada Data</div>
      <h3 className="empty-headline">Unggah File untuk Memulai</h3>
      <p className="empty-desc">
        Unggah file CSV atau Excel untuk menampilkan pemeringkatan
        kinerja daerah berdasarkan skor komposit IPM, RLS, dan HLS.
      </p>
      <div className="col-tags">
        {["provinsi", "kabkota", "tahun", "ipm", "rls", "hls"].map((col) => (
          <span key={col} className="col-tag">{col}</span>
        ))}
      </div>
    </div>
  );
}
