"use client";

import { RawRow } from "@/lib/types";

interface Props {
  rawData: RawRow[];
  provinsi: string;
  kabkota: string;
  tahun: string;
  top: number;
  onChangeProvinsi: (v: string) => void;
  onChangeKabkota: (v: string) => void;
  onChangeTahun: (v: string) => void;
  onChangeTop: (v: number) => void;
}

export default function FilterSection({
  rawData,
  provinsi,
  kabkota,
  tahun,
  top,
  onChangeProvinsi,
  onChangeKabkota,
  onChangeTahun,
  onChangeTop,
}: Props) {
  const provList = [...new Set(rawData.map((r) => r.provinsi))].sort();
  const tahunList = [...new Set(rawData.map((r) => r.tahun))].sort().reverse();
  const kabList = [
    ...new Set(
      rawData.filter((r) => !provinsi || r.provinsi === provinsi).map((r) => r.kabkota)
    ),
  ].sort();

  function handleProvinsiChange(v: string) {
    onChangeProvinsi(v);
    onChangeKabkota(""); // reset kabkota when provinsi changes
  }

  return (
    <div className="filter-section">
      <div className="filter-header">Filter &amp; Tampilan Data</div>
      <div className="filter-body">
        <div className="filter-group">
          <label>Provinsi</label>
          <select value={provinsi} onChange={(e) => handleProvinsiChange(e.target.value)}>
            <option value="">Semua Provinsi</option>
            {provList.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Kab / Kota</label>
          <select value={kabkota} onChange={(e) => onChangeKabkota(e.target.value)}>
            <option value="">Semua Kab/Kota</option>
            {kabList.map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Tahun</label>
          <select value={tahun} onChange={(e) => onChangeTahun(e.target.value)}>
            <option value="">Semua Tahun</option>
            {tahunList.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Tampilkan</label>
          <select value={top} onChange={(e) => onChangeTop(parseInt(e.target.value))}>
            <option value={0}>Semua Daerah</option>
            <option value={10}>Top 10</option>
            <option value={20}>Top 20</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
