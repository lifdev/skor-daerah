"use client";

import { useState, useMemo } from "react";
import TopStrip from "@/components/TopStrip";
import AppHeader from "@/components/AppHeader";
import NavStrip from "@/components/NavStrip";
import UploadSection from "@/components/UploadSection";
import FileBar from "@/components/FileBar";
import FilterSection from "@/components/FilterSection";
import StatsStrip from "@/components/StatsStrip";
import RankingTable from "@/components/RankingTable";
import EmptyState from "@/components/EmptyState";
import SiteFooter from "@/components/SiteFooter";
import { RawRow, ScoredRow, SortCol } from "@/lib/types";
import {
  applyFiltersAndScore,
  getMinMax,
  calcScore,
  SAMPLE_DATA,
} from "@/lib/dataUtils";

export default function Home() {
  // Data state
  const [rawData, setRawData] = useState<RawRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [hasData, setHasData] = useState(false);

  // Filter state
  const [filterProvinsi, setFilterProvinsi] = useState("");
  const [filterKabkota, setFilterKabkota] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [filterTop, setFilterTop] = useState(0);
  const [query, setQuery] = useState("");

  // Sort state
  const [sortCol, setSortCol] = useState<SortCol>("skor");
  const [sortAsc, setSortAsc] = useState(false);

  // Compute displayed data
  const { displayed, allFiltered } = useMemo(() => {
    if (!hasData)
      return { displayed: [] as ScoredRow[], allFiltered: [] as ScoredRow[] };
    const all = applyFiltersAndScore(
      rawData,
      {
        provinsi: filterProvinsi,
        kabkota: filterKabkota,
        tahun: filterTahun,
        top: 0,
        query,
      },
      sortCol,
      sortAsc,
    );
    const sliced = filterTop > 0 ? all.slice(0, filterTop) : all;
    return { displayed: sliced, allFiltered: all };
  }, [
    rawData,
    filterProvinsi,
    filterKabkota,
    filterTahun,
    filterTop,
    query,
    sortCol,
    sortAsc,
    hasData,
  ]);

  // Stats
  const stats = useMemo(() => {
    const n = allFiltered.length;
    if (n === 0)
      return {
        total: 0,
        avgIPM: null,
        avgRLS: null,
        avgHLS: null,
        topDaerah: null,
      };
    const avg = (k: "ipm" | "rls" | "hls") =>
      allFiltered.reduce((s, r) => s + r[k], 0) / n;
    return {
      total: n,
      avgIPM: avg("ipm"),
      avgRLS: avg("rls"),
      avgHLS: avg("hls"),
      topDaerah: allFiltered[0]?.kabkota ?? null,
    };
  }, [allFiltered]);

  // Table title
  const tableTitle = useMemo(() => {
    const parts = ["Pemeringkatan Kinerja Daerah"];
    if (filterProvinsi) parts.push(filterProvinsi);
    if (filterKabkota) parts.push(filterKabkota);
    if (filterTahun) parts.push(`(${filterTahun})`);
    return parts.join(" - ");
  }, [filterProvinsi, filterKabkota, filterTahun]);

  function handleDataLoaded(rows: RawRow[], name: string, size: string) {
    setRawData(rows);
    setFileName(name);
    setFileSize(size);
    setHasData(true);
    resetFilters();
  }

  function handleLoadSample() {
    setRawData(SAMPLE_DATA);
    setFileName("data_sampel.csv");
    setFileSize("-");
    setHasData(true);
    resetFilters();
  }

  function handleClear() {
    setRawData([]);
    setFileName("");
    setFileSize("");
    setHasData(false);
    resetFilters();
    setQuery("");
  }

  function resetFilters() {
    setFilterProvinsi("");
    setFilterKabkota("");
    setFilterTahun("");
    setFilterTop(0);
  }

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortAsc((a) => !a);
    } else {
      setSortCol(col);
      setSortAsc(false);
    }
  }

  return (
    <>
      <TopStrip />
      <AppHeader />
      <NavStrip />

      <main>
        {!hasData ? (
          <UploadSection
            onDataLoaded={handleDataLoaded}
            onLoadSample={handleLoadSample}
          />
        ) : (
          <FileBar
            fileName={fileName}
            fileSize={fileSize}
            onClear={handleClear}
          />
        )}

        {hasData && (
          <FilterSection
            rawData={rawData}
            provinsi={filterProvinsi}
            kabkota={filterKabkota}
            tahun={filterTahun}
            top={filterTop}
            onChangeProvinsi={setFilterProvinsi}
            onChangeKabkota={setFilterKabkota}
            onChangeTahun={setFilterTahun}
            onChangeTop={setFilterTop}
          />
        )}

        {hasData && (
          <StatsStrip {...stats} />
        )}

        <div className="table-section">
          {!hasData ? (
            <EmptyState />
          ) : (
            <RankingTable
              data={displayed}
              allCount={allFiltered.length}
              sortCol={sortCol}
              sortAsc={sortAsc}
              query={query}
              tableTitle={tableTitle}
              onSort={handleSort}
              onQueryChange={setQuery}
            />
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
