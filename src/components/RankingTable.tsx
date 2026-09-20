"use client";

import { ScoredRow, SortCol } from "@/lib/types";
import {
  getCategoryClass,
  getCategoryLabel,
  getBarColor,
  exportToCSV,
} from "@/lib/dataUtils";

interface Props {
  data: ScoredRow[];
  allCount: number;
  sortCol: SortCol;
  sortAsc: boolean;
  query: string;
  tableTitle: string;
  onSort: (col: SortCol) => void;
  onQueryChange: (q: string) => void;
}

const COLS: { key: SortCol; label: string; title?: string }[] = [
  { key: "rank", label: "#" },
  { key: "kabkota", label: "Kab/Kota" },
  { key: "provinsi", label: "Provinsi" },
  { key: "tahun", label: "Tahun" },
  { key: "ipm", label: "IPM", title: "Indeks Pembangunan Manusia (0-100)" },
  { key: "rls", label: "RLS", title: "Rata-rata Lama Sekolah (tahun)" },
  { key: "hls", label: "HLS", title: "Harapan Lama Sekolah (tahun)" },
  { key: "skor", label: "Skor Kinerja" },
];

export default function RankingTable({
  data,
  allCount,
  sortCol,
  sortAsc,
  query,
  tableTitle,
  onSort,
  onQueryChange,
}: Props) {
  return (
    <div className="table-section">
      <div id="tableContainer">
        <div className="table-masthead">
          <div>
            <div className="table-eyebrow">Ranking Kinerja Daerah</div>
            <div className="table-headline">{tableTitle}</div>
          </div>
          <div className="table-controls">
            <div className="search-wrap">
              <svg className="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Cari nama daerah..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />
            </div>
            <button
              className="btn"
              style={{ fontSize: "11px", padding: "8px 14px" }}
              onClick={() => exportToCSV(data)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    id={`th-${col.key}`}
                    className={sortCol === col.key ? "active" : ""}
                    title={col.title}
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                    <span className="sort-arrow">
                      {sortCol === col.key ? (sortAsc ? " ↑" : " ↓") : ""}
                    </span>
                  </th>
                ))}
                <th>Kategori</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-results">
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              ) : (
                data.map((r) => {
                  const sc = r.skor;
                  const barColor = getBarColor(sc);
                  const catClass = getCategoryClass(sc);
                  const catLabel = getCategoryLabel(sc);
                  const rankClass =
                    r.rank === 1
                      ? "rank-1"
                      : r.rank === 2
                      ? "rank-2"
                      : r.rank === 3
                      ? "rank-3"
                      : "";

                  return (
                    <tr key={`${r.kabkota}-${r.tahun}-${r.rank}`}>
                      <td>
                        <span className={`rank-num ${rankClass}`}>{r.rank}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: "#003366" }}>{r.kabkota}</td>
                      <td style={{ color: "#3A5068", fontSize: "12px" }}>{r.provinsi}</td>
                      <td><span className="year-tag">{r.tahun}</span></td>
                      <td
                        style={{
                          fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "12px",
                          color: "#0055A5",
                        }}
                      >
                        {r.ipm.toFixed(2)}
                      </td>
                      <td
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "12px",
                          color: "#3A5068",
                        }}
                      >
                        {r.rls.toFixed(2)}
                      </td>
                      <td
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "12px",
                          color: "#3A5068",
                        }}
                      >
                        {r.hls.toFixed(2)}
                      </td>
                      <td>
                        <div className="score-wrap">
                          <div className="score-bar-track">
                            <div
                              className="score-bar-fill"
                              style={{ width: `${sc.toFixed(1)}%`, background: barColor }}
                            />
                          </div>
                          <span className="score-num" style={{ color: barColor }}>
                            {sc.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`cat ${catClass}`}>{catLabel}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer-bar">
          <span>
            {data.length} dari {allCount} daerah ditampilkan
          </span>
          <span>
            Kolom: {sortCol} · {sortAsc ? "↑ naik" : "↓ turun"}
          </span>
        </div>
      </div>
    </div>
  );
}
