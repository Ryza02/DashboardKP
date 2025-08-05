"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { useTheme } from "./theme-provider";

// Custom style react-select
const customSelectStyles = (theme: "dark" | "light") => ({
  control: (base: any, state: any) => ({
    ...base,
    background: theme === "dark" ? "#232336" : "#fff",
    borderColor: state.isFocused ? "#ad6eff" : "#232336",
    boxShadow: state.isFocused ? "0 0 0 2px #ad6eff55" : undefined,
    color: theme === "dark" ? "#fff" : "#232336",
    minHeight: 44,
  }),
  menu: (base: any) => ({
    ...base,
    background: theme === "dark" ? "#232336" : "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 32px 0 rgba(45,32,94,0.14)",
    zIndex: 50,
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isSelected
      ? (theme === "dark" ? "#ad6eff" : "#e4d6ff")
      : state.isFocused
      ? (theme === "dark" ? "#2e254c" : "#f3f0ff")
      : "none",
    color: state.isSelected
      ? (theme === "dark" ? "#232336" : "#5a23a1")
      : (theme === "dark" ? "#fff" : "#232336"),
    fontWeight: state.isSelected ? "bold" : 500,
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: theme === "dark" ? "#fff" : "#232336",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: theme === "dark" ? "#b9b7d0" : "#a7a7c0",
    fontWeight: 400,
  }),
});

type DataRow = {
  Date: string;
  Time: string;
  "eNodeB Name": string;
  "Cell FDD TDD Indication": string;
  "Cell Name": string;
  "LocalCell Id": string;
  "eNodeB Function Name": string;
  Integrity: string;
  User: number;
  PRB: number;
  EUT: number;
  "TA Meter": number;
  "Traffic GB": number;
  CQI: number;
  "IOH_4G Rank2 %": number;
  "IOH_4G Cell Availability (%)": number;
  "UL.Interference.Avg(dBm)": number;
  "Site ID": string;
  Sector: string;
  SA: string;
};

interface DetailDataCardProps {
  page: number;
  setPageCount: (count: number) => void;
  setPage: (page: number) => void;
}

export default function DetailDataCard({
  page,
  setPageCount,
  setPage,
}: DetailDataCardProps) {
  // HARUS: Panggil useTheme paling atas, biar urutan hook aman
  const { theme } = useTheme();

  const [rows, setRows] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Dropdown filter state
  const [siteOptions, setSiteOptions] = useState<{ label: string; value: string }[]>([]);
  const [sectorOptions, setSectorOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedSite, setSelectedSite] = useState<{ label: string; value: string } | null>(null);
  const [selectedSector, setSelectedSector] = useState<{ label: string; value: string } | null>(null);

  const [range, setRange] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [gotoPage, setGotoPage] = useState("");
  const [showDetail, setShowDetail] = useState<DataRow | null>(null);
  const perPage = 20;

  // Data fetching, filter, sync
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      range,
      ...(selectedSector?.value ? { sector: selectedSector.value } : {}),
      ...(selectedSite?.value ? { site_id: selectedSite.value } : {}),
      ...(range === "custom" ? { dateFrom, dateTo } : {}),
    }).toString();

    fetch(`/api/data?${params}`)
      .then(res => res.json())
      .then(data => {
        setRows(data.rows || []);
        setTotal(data.total || 0);
        setPageCount(Math.ceil((data.total || 0) / perPage));
        setSiteOptions(
          (data.sites || []).map((s: any) => ({
            label: `${s.enodeb_name} (${s.site_id})`,
            value: s.site_id,
          }))
        );
        setSectorOptions(
          (data.sectors || []).map((s: any) => ({
            label: s,
            value: s,
          }))
        );
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [page, selectedSite, selectedSector, range, dateFrom, dateTo, setPageCount]);

  // Reset filter
  const resetFilter = () => {
    setSelectedSector(null);
    setSelectedSite(null);
    setRange("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  // Pagination logic
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const visibleButtons = 5;
  let startPage = Math.max(1, page - Math.floor(visibleButtons / 2));
  let endPage = startPage + visibleButtons - 1;
  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(1, endPage - visibleButtons + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const handleGotoPage = (e: React.FormEvent) => {
    e.preventDefault();
    let n = parseInt(gotoPage);
    if (isNaN(n)) return;
    if (n < 1) n = 1;
    if (n > pageCount) n = pageCount;
    setPage(n);
    setGotoPage("");
  };

  // Card background color, table style
  const cardBg = theme === "dark"
    ? "bg-[#232336] border-[#3e4057] shadow-lg"
    : "bg-white border-[#e5e8ee] shadow-md";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const tableBg = theme === "dark" ? "bg-[#262740]" : "bg-gray-100";
  const modalBg = theme === "dark"
    ? "bg-[#19192a] border-white/20"
    : "bg-white border-gray-200";

  return (
    <div className={`rounded-2xl mt-8 p-4 md:p-6 border ${cardBg} max-w-[1400px] w-full mx-auto`}>
      {/* Detail Modal */}
      {showDetail && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowDetail(null)}
        >
          <div
            className={`rounded-xl p-6 shadow-xl w-full max-w-2xl relative border ${modalBg}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-red-400"
              onClick={() => setShowDetail(null)}
              aria-label="Close"
            >✕</button>
            <div className="text-lg font-bold mb-3 text-purple-700 dark:text-purple-400">Detail Data</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {Object.entries(showDetail).map(([key, value]) => (
                <div key={key}>
                  <b>{key}:</b>{" "}
                  {key === "Date"
                    ? value
                      ? new Date(value as string).toLocaleDateString("id-ID")
                      : ""
                    : value?.toString()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Dropdown */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        {/* Sector */}
        <div className="flex flex-col min-w-[140px]">
          <label className="text-xs text-gray-400 mb-1 font-medium">Sector</label>
          <Select
            options={sectorOptions}
            value={selectedSector}
            onChange={v => { setSelectedSector(v); setPage(1); }}
            isClearable
            isSearchable
            placeholder="Cari Sector…"
            styles={customSelectStyles(theme)}
            classNamePrefix="react-select"
            noOptionsMessage={() => "Tidak ada sector"}
          />
        </div>
        {/* Site ID */}
        <div className="flex flex-col min-w-[220px]">
          <label className="text-xs text-gray-400 mb-1 font-medium">Site ID</label>
          <Select
            options={siteOptions}
            value={selectedSite}
            onChange={v => { setSelectedSite(v); setPage(1); }}
            isClearable
            isSearchable
            placeholder="Cari Site ID…"
            styles={customSelectStyles(theme)}
            classNamePrefix="react-select"
            noOptionsMessage={() => "Tidak ada Site ID"}
          />
        </div>
        {/* Periode */}
        <div className="flex flex-col min-w-[120px]">
          <label className="text-xs text-gray-400 mb-1 font-medium">Periode</label>
          <select
            value={range}
            onChange={e => { setRange(e.target.value); setPage(1); }}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${theme === "dark" ? "bg-[#232336] text-white border-[#3e4057]" : "bg-white text-gray-900 border-gray-200"}`}
          >
            <option value="all">All Time</option>
            <option value="weekly">Mingguan</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        {/* Custom Range */}
        {range === "custom" && (
          <>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1 font-medium">Dari</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${theme === "dark" ? "bg-[#232336] text-white border-[#3e4057]" : "bg-white text-gray-900 border-gray-200"}`}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1 font-medium">Sampai</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${theme === "dark" ? "bg-[#232336] text-white border-[#3e4057]" : "bg-white text-gray-900 border-gray-200"}`}
              />
            </div>
          </>
        )}
        {/* Reset */}
        <button
          onClick={resetFilter}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${theme === "dark"
            ? "bg-[#393955] text-white hover:bg-[#43437c]"
            : "bg-gray-200 text-gray-800 hover:bg-gray-400"}`}
          type="button"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto rounded-xl border ${theme === "dark" ? "border-[#393955]" : "border-gray-200"}`}>
        <table className={`min-w-full text-sm ${textMain}`}>
          <thead>
            <tr className={tableBg}>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Jam</th>
              <th className="p-2">eNodeB Name</th>
              <th className="p-2">Cell Name</th>
              <th className="p-2">Traffic (GB)</th>
              <th className="p-2">User</th>
              <th className="p-2">CQI</th>
              <th className="p-2">Site ID</th>
              <th className="p-2">Sector</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center p-8">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-8">
                  Data kosong
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className={`hover:bg-white/10 transition cursor-pointer`}
                  onClick={() => setShowDetail(row)}
                >
                  <td className="p-2">{row.Date ? new Date(row.Date).toLocaleDateString("id-ID") : ""}</td>
                  <td className="p-2">{row.Time}</td>
                  <td className="p-2">{row["eNodeB Name"]}</td>
                  <td className="p-2">{row["Cell Name"]}</td>
                  <td className="p-2">{row["Traffic GB"]}</td>
                  <td className="p-2">{row.User}</td>
                  <td className="p-2">{row.CQI}</td>
                  <td className="p-2">{row["Site ID"]}</td>
                  <td className="p-2">{row.Sector}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
        <div className="text-xs text-gray-300">
          Menampilkan {rows.length} dari total {total} data
        </div>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-purple-600/60 disabled:opacity-40"
          >Prev</button>
          {startPage > 1 && <span className="px-2 text-white/60">...</span>}
          {pageNumbers.map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${page === n
                ? "bg-purple-600 text-white"
                : "bg-white/20 text-white hover:bg-purple-600/60"}`}
            >{n}</button>
          ))}
          {endPage < pageCount && <span className="px-2 text-white/60">...</span>}
          <button
            onClick={() => setPage(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-purple-600/60 disabled:opacity-40"
          >Next</button>
          <form onSubmit={handleGotoPage} className="ml-2 flex items-center">
            <input
              type="number"
              min={1}
              max={pageCount}
              value={gotoPage}
              onChange={e => setGotoPage(e.target.value)}
              className="w-14 px-2 py-1 rounded-md border text-sm bg-white/90 text-gray-900"
              placeholder="Page"
              style={{ marginRight: 4 }}
            />
            <button
              type="submit"
              className="px-2 py-1 rounded bg-purple-600 text-white font-medium text-xs"
            >Go</button>
          </form>
        </div>
      </div>
    </div>
  );
}
