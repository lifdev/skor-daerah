import { RawRow, ScoredRow, MinMaxMap, Filters, SortCol } from "./types";

const WEIGHTS = { ipm: 0.5, rls: 0.25, hls: 0.25 };

const KEY_MAP: Record<string, keyof RawRow> = {
  provinsi: "provinsi",
  kabkota: "kabkota",
  kab_kota: "kabkota",
  "kab/kota": "kabkota",
  tahun: "tahun",
  year: "tahun",
  ipm: "ipm",
  rls: "rls",
  hls: "hls",
};

export function normalizeKeys(obj: Record<string, unknown>): Partial<RawRow> {
  const out: Partial<RawRow> = {};
  for (const [k, v] of Object.entries(obj)) {
    const normalized = k.toLowerCase().trim().replace(/\s+/g, "_");
    const mappedKey = KEY_MAP[normalized];
    if (mappedKey) {
      if (mappedKey === "ipm" || mappedKey === "rls" || mappedKey === "hls") {
        out[mappedKey] = parseFloat(String(v)) || 0;
      } else if (mappedKey === "tahun") {
        out.tahun = v ? String(v).trim() : "-";
      } else {
        (out as Record<string, unknown>)[mappedKey] = typeof v === "string" ? v.trim() : v;
      }
    }
  }
  return out;
}

export function parseRows(rows: Record<string, unknown>[]): RawRow[] {
  return rows
    .map(normalizeKeys)
    .filter(
      (r): r is RawRow =>
        !!r.kabkota && !!r.provinsi && !isNaN(parseFloat(String(r.ipm)))
    )
    .map((r) => ({
      provinsi: r.provinsi!,
      kabkota: r.kabkota!,
      tahun: r.tahun ?? "-",
      ipm: r.ipm ?? 0,
      rls: r.rls ?? 0,
      hls: r.hls ?? 0,
    }));
}

export function getMinMax(data: RawRow[]): MinMaxMap {
  const mm: MinMaxMap = {
    ipm: { min: Infinity, max: -Infinity },
    rls: { min: Infinity, max: -Infinity },
    hls: { min: Infinity, max: -Infinity },
  };
  for (const r of data) {
    for (const k of ["ipm", "rls", "hls"] as const) {
      if (r[k] < mm[k].min) mm[k].min = r[k];
      if (r[k] > mm[k].max) mm[k].max = r[k];
    }
  }
  return mm;
}

export function calcScore(row: RawRow, mm: MinMaxMap): number {
  const norm = (k: keyof MinMaxMap) => {
    const range = mm[k].max - mm[k].min;
    return range === 0 ? 1 : (row[k] - mm[k].min) / range;
  };
  return (norm("ipm") * WEIGHTS.ipm + norm("rls") * WEIGHTS.rls + norm("hls") * WEIGHTS.hls) * 100;
}

export function applyFiltersAndScore(
  rawData: RawRow[],
  filters: Filters,
  sortCol: SortCol,
  sortAsc: boolean
): ScoredRow[] {
  const { provinsi, kabkota, tahun, top, query } = filters;
  const q = query.toLowerCase().trim();

  let data = rawData.filter(
    (r) =>
      (!provinsi || r.provinsi === provinsi) &&
      (!kabkota || r.kabkota === kabkota) &&
      (!tahun || r.tahun === tahun) &&
      (!q || r.kabkota.toLowerCase().includes(q) || r.provinsi.toLowerCase().includes(q))
  );

  const mm = getMinMax(data);
  let scored: ScoredRow[] = data.map((r, i) => ({
    ...r,
    skor: calcScore(r, mm),
    rank: i + 1,
  }));

  scored.sort((a, b) =>
    sortAsc
      ? a[sortCol] > b[sortCol] ? 1 : -1
      : b[sortCol] > a[sortCol] ? 1 : -1
  );
  scored.forEach((r, i) => (r.rank = i + 1));

  return top > 0 ? scored.slice(0, top) : scored;
}

export function getCategoryClass(skor: number): string {
  if (skor >= 66) return "cat-high";
  if (skor >= 33) return "cat-med";
  return "cat-low";
}

export function getCategoryLabel(skor: number): string {
  if (skor >= 66) return "Tinggi";
  if (skor >= 33) return "Sedang";
  return "Rendah";
}

export function getBarColor(skor: number): string {
  if (skor >= 66) return "#1A7A3C";
  if (skor >= 33) return "#0055A5";
  return "#CC0000";
}

export function exportToCSV(data: ScoredRow[]): void {
  const headers = ["Rank", "Kab/Kota", "Provinsi", "Tahun", "IPM", "RLS", "HLS", "Skor", "Kategori"];
  const rows = data.map((r) => [
    r.rank,
    r.kabkota,
    r.provinsi,
    r.tahun,
    r.ipm.toFixed(2),
    r.rls.toFixed(2),
    r.hls.toFixed(2),
    r.skor.toFixed(2),
    getCategoryLabel(r.skor),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "skor_kinerja_daerah.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export const SAMPLE_DATA: RawRow[] = [
  { provinsi: "DKI Jakarta", kabkota: "Kota Jakarta Selatan", tahun: "2023", ipm: 85.32, rls: 11.20, hls: 14.80 },
  { provinsi: "DKI Jakarta", kabkota: "Kota Jakarta Pusat",  tahun: "2023", ipm: 83.90, rls: 10.85, hls: 14.50 },
  { provinsi: "DKI Jakarta", kabkota: "Kota Jakarta Barat",  tahun: "2023", ipm: 80.45, rls: 10.10, hls: 13.90 },
  { provinsi: "Jawa Barat",  kabkota: "Kota Bogor",          tahun: "2023", ipm: 76.58, rls: 9.82,  hls: 13.01 },
  { provinsi: "Jawa Barat",  kabkota: "Kab. Bogor",          tahun: "2023", ipm: 70.12, rls: 8.56,  hls: 12.10 },
  { provinsi: "Jawa Barat",  kabkota: "Kota Depok",          tahun: "2023", ipm: 82.44, rls: 10.98, hls: 14.20 },
  { provinsi: "Jawa Barat",  kabkota: "Kab. Bekasi",         tahun: "2023", ipm: 72.30, rls: 8.90,  hls: 12.45 },
  { provinsi: "Jawa Tengah", kabkota: "Kota Semarang",       tahun: "2023", ipm: 83.12, rls: 10.55, hls: 14.10 },
  { provinsi: "Jawa Tengah", kabkota: "Kota Solo",           tahun: "2023", ipm: 82.78, rls: 10.30, hls: 13.90 },
  { provinsi: "Jawa Tengah", kabkota: "Kab. Semarang",       tahun: "2023", ipm: 74.50, rls: 8.70,  hls: 12.80 },
  { provinsi: "Jawa Tengah", kabkota: "Kab. Klaten",         tahun: "2023", ipm: 75.20, rls: 9.10,  hls: 12.95 },
  { provinsi: "DI Yogyakarta", kabkota: "Kota Yogyakarta",   tahun: "2023", ipm: 87.60, rls: 11.80, hls: 15.40 },
  { provinsi: "DI Yogyakarta", kabkota: "Kab. Sleman",       tahun: "2023", ipm: 84.20, rls: 11.10, hls: 15.00 },
  { provinsi: "DI Yogyakarta", kabkota: "Kab. Bantul",       tahun: "2023", ipm: 79.80, rls: 9.80,  hls: 13.80 },
  { provinsi: "Jawa Timur",  kabkota: "Kota Surabaya",       tahun: "2023", ipm: 83.90, rls: 10.80, hls: 14.50 },
  { provinsi: "Jawa Timur",  kabkota: "Kota Malang",         tahun: "2023", ipm: 82.10, rls: 10.50, hls: 14.20 },
  { provinsi: "Jawa Timur",  kabkota: "Kab. Sidoarjo",       tahun: "2023", ipm: 78.40, rls: 9.50,  hls: 13.20 },
];
