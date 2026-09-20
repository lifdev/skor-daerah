export interface RawRow {
  provinsi: string;
  kabkota: string;
  tahun: string;
  ipm: number;
  rls: number;
  hls: number;
}

export interface ScoredRow extends RawRow {
  skor: number;
  rank: number;
}

export interface MinMax {
  min: number;
  max: number;
}

export interface MinMaxMap {
  ipm: MinMax;
  rls: MinMax;
  hls: MinMax;
}

export type SortCol = "rank" | "kabkota" | "provinsi" | "tahun" | "ipm" | "rls" | "hls" | "skor";

export interface Filters {
  provinsi: string;
  kabkota: string;
  tahun: string;
  top: number;
  query: string;
}
