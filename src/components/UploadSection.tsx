"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseRows } from "@/lib/dataUtils";
import { RawRow } from "@/lib/types";

interface Props {
  onDataLoaded: (rows: RawRow[], fileName: string, fileSize: string) => void;
  onLoadSample: () => void;
}

export default function UploadSection({ onDataLoaded, onLoadSample }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function readFile(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const sizeKB = (file.size / 1024).toFixed(1) + " KB";

    if (ext === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = Papa.parse(e.target!.result as string, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        const rows = parseRows(result.data as Record<string, unknown>[]);
        if (rows.length === 0) {
          alert(
            "Data tidak valid. Pastikan kolom: provinsi, kabkota, tahun, ipm, rls, hls",
          );
          return;
        }
        onDataLoaded(rows, file.name, sizeKB);
      };
      reader.readAsText(file, "UTF-8");
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target!.result as ArrayBuffer, {
          type: "array",
        });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const jsonRows = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
        }) as Record<string, unknown>[];
        const rows = parseRows(jsonRows);
        if (rows.length === 0) {
          alert(
            "Data tidak valid. Pastikan kolom: provinsi, kabkota, tahun, ipm, rls, hls",
          );
          return;
        }
        onDataLoaded(rows, file.name, sizeKB);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Format tidak didukung.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  return (
    <div className="upload-section" id="uploadSection">
      <div className="upload-main">
        <div className="upload-eyebrow">
          <span className="upload-eyebrow-text">Input Data</span>
        </div>
        <h2 className="upload-headline">Unggah File CSV atau Excel</h2>
        <p className="upload-desc">
          Drag &amp; drop file ke area di bawah, atau klik tombol untuk memilih
          file dari perangkat Anda. Pastikan file memiliki kolom yang sesuai
          dengan skema kolom yang tertera di panel kanan.
        </p>
        <div
          className={`upload-drop${isDragging ? " drag" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <svg className="upload-drop-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <h3>Pilih atau Drop File di Sini</h3>
          <p>CSV, XLSX, atau XLS</p>
          <div className="btn-row">
            <button
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Pilih File
            </button>
            <button
              className="btn-link"
              onClick={(e) => {
                e.stopPropagation();
                onLoadSample();
              }}
            >
              Coba Data Sampel
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="upload-sidebar">
        <div className="sidebar-heading">Skema Kolom</div>
        <table className="schema-table">
          <tbody>
            <tr>
              <td>provinsi</td>
              <td>Nama provinsi</td>
            </tr>
            <tr>
              <td>kabkota</td>
              <td>Nama kab/kota</td>
            </tr>
            <tr>
              <td>tahun</td>
              <td>Tahun data</td>
            </tr>
            <tr>
              <td>ipm</td>
              <td>Nilai IPM (0-100)</td>
            </tr>
            <tr>
              <td>rls</td>
              <td>Rata-rata lama sekolah (thn)</td>
            </tr>
            <tr>
              <td>hls</td>
              <td>Harapan lama sekolah (thn)</td>
            </tr>
          </tbody>
        </table>
        <div className="sidebar-heading">Bobot Skor Komposit</div>
        <ul className="weight-list">
          <li>
            <span>IPM - Indeks Pembangunan Manusia</span>
            <span className="weight-val">50%</span>
          </li>
          <li>
            <span>RLS - Rata-rata Lama Sekolah</span>
            <span className="weight-val">25%</span>
          </li>
          <li>
            <span>HLS - Harapan Lama Sekolah</span>
            <span className="weight-val">25%</span>
          </li>
        </ul>
        <p className="schema-note">
          Skor dihitung dengan normalisasi min-max terhadap seluruh data yang
          ditampilkan dalam rentang 0-100.
        </p>
      </div>
    </div>
  );
}
