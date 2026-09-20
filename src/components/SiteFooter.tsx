export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <div className="footer-brand">
            <div className="footer-brand-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="18"
                  width="5"
                  height="10"
                  rx="1"
                  fill="rgba(255,255,255,0.8)"
                />
                <rect
                  x="11"
                  y="12"
                  width="5"
                  height="16"
                  rx="1"
                  fill="rgba(255,255,255,0.8)"
                />
                <rect
                  x="18"
                  y="7"
                  width="5"
                  height="21"
                  rx="1"
                  fill="#c8960c"
                />
                <rect
                  x="25"
                  y="14"
                  width="3"
                  height="14"
                  rx="1"
                  fill="rgba(255,255,255,0.45)"
                />
              </svg>
            </div>
            <div>
              <div>Dashboard Skor Kinerja Daerah</div>
              <div className="footer-meta">© {year} / Open Source</div>
            </div>
          </div>
        </div>
        <p className="footer-note">
          Dashboard ini menggunakan data publik IPM, RLS, dan HLS per
          kabupaten/kota. Skor kinerja dihitung dengan metode normalisasi
          min-max sebagai indeks komposit.
        </p>
      </div>
    </footer>
  );
}
