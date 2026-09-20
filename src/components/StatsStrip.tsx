"use client";

interface Props {
  total: number;
  avgIPM: number | null;
  avgRLS: number | null;
  avgHLS: number | null;
  topDaerah: string | null;
}

export default function StatsStrip({ total, avgIPM, avgRLS, avgHLS, topDaerah }: Props) {
  return (
    <div className="stats-strip">
      <div className="stat-cell">
        <div className="stat-label">Total Daerah</div>
        <div className="stat-value">{total}</div>
        <div className="stat-note">terfilter</div>
      </div>
      <div className="stat-cell">
        <div className="stat-label">Rata-rata IPM</div>
        <div className="stat-value">{avgIPM != null ? avgIPM.toFixed(2) : "-"}</div>
        <div className="stat-note">Indeks Pembangunan Manusia</div>
      </div>
      <div className="stat-cell">
        <div className="stat-label">Rata-rata RLS</div>
        <div className="stat-value">{avgRLS != null ? avgRLS.toFixed(2) : "-"}</div>
        <div className="stat-note">tahun rata-rata lama sekolah</div>
      </div>
      <div className="stat-cell">
        <div className="stat-label">Rata-rata HLS</div>
        <div className="stat-value">{avgHLS != null ? avgHLS.toFixed(2) : "-"}</div>
        <div className="stat-note">tahun harapan lama sekolah</div>
      </div>
      <div className="stat-cell">
        <div className="stat-label">Skor Tertinggi</div>
        <div className="stat-value small">{topDaerah ?? "-"}</div>
        <div className="stat-note">daerah terbaik</div>
      </div>
    </div>
  );
}
