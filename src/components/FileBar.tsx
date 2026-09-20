"use client";

interface Props {
  fileName: string;
  fileSize: string;
  onClear: () => void;
}

export default function FileBar({ fileName, fileSize, onClear }: Props) {
  return (
    <div className="file-bar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{color: "#4ade80", flexShrink: 0}}>
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span className="file-bar-name">{fileName}</span>
      <span className="file-bar-info">{fileSize}</span>
      <button
        className="btn btn-outline"
        onClick={onClear}
        style={{ padding: "6px 14px", fontSize: "11px" }}
      >
        Ganti File
      </button>
    </div>
  );
}
