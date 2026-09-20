"use client";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="logo-area">
          <div className="logo-emblem">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="4" y="18" width="5" height="10" rx="1" fill="rgba(255,255,255,0.9)"/>
              <rect x="11" y="12" width="5" height="16" rx="1" fill="rgba(255,255,255,0.9)"/>
              <rect x="18" y="7" width="5" height="21" rx="1" fill="#c8960c"/>
              <rect x="25" y="14" width="3" height="14" rx="1" fill="rgba(255,255,255,0.55)"/>
            </svg>
          </div>
          <div className="org-info">
            <div className="org-name">Skor Daerah</div>
            <div className="org-sub">
              Analisis &amp; Pemeringkatan Kinerja Daerah
            </div>
          </div>
        </div>
        <div className="header-divider" />
        <div className="title-area">
          <h1 className="main-title">
            Dashboard Pemeringkatan Kinerja Daerah Indonesia
          </h1>
          <p className="main-subtitle">
            Analisis komposit berbasis Indeks Pembangunan Manusia (IPM),
            Rata-rata Lama Sekolah (RLS), dan Harapan Lama Sekolah (HLS).
            Data publik per kabupaten/kota.
          </p>
        </div>
      </div>
    </header>
  );
}
