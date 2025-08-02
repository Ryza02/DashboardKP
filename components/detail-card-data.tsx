"use client"

import { useEffect, useState, useRef } from "react"
import Papa from "papaparse"
import { useTheme } from "./theme-provider"

type DataRow = {
  id: number
  date: string
  enodeb_name: string
  ioh_4g_total_traffic_gb: number
  ioh_rrc_connected_user: number
  ioh_4g_availability_auto: number
  l_e_rab_abnormrel_tnl: number
  ioh_last_tti: number
  site_ide: string
}
type Site = { enodeb_name: string; site_ide: string }

interface DetailDataCardProps {
  page: number
  setPageCount: (count: number) => void
  setPage: (page: number) => void
}

export default function DetailDataCard({
  page,
  setPageCount,
  setPage,
}: DetailDataCardProps) {
  const { theme } = useTheme()
  const [rows, setRows] = useState<DataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState("")
  const [dateType, setDateType] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [gotoPage, setGotoPage] = useState("")
  const [showDetail, setShowDetail] = useState<DataRow | null>(null)
  const [showUploadIdx, setShowUploadIdx] = useState<number | null>(null)
  const perPage = 20
  const fileInputRef = useRef<HTMLInputElement>(null)
  const perDataFileRef = useRef<HTMLInputElement[]>([])

  // Fetch data dari API
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      site: selectedSite,
      dateType,
      ...(dateType === "custom" ? { dateFrom, dateTo } : {}),
    }).toString()
    fetch(`/api/detail-data?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.rows)
        setTotal(data.total)
        setSites(data.sites || [])
        setLoading(false)
        setPageCount(Math.ceil(data.total / perPage))
      })
  }, [page, selectedSite, dateType, dateFrom, dateTo, setPageCount])

  // Upload CSV (semua data)
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse<DataRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data.slice(0, perPage))
        setPageCount(1)
        setPage(1)
      },
    })
  }

  // Upload CSV untuk satu data
  const handleUploadPerData = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse<DataRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const newRows = [...rows]
          newRows[idx] = results.data[0]
          setRows(newRows)
        }
        setShowUploadIdx(null)
      },
    })
  }

  // Reset filter
  const resetFilter = () => {
    setSelectedSite("")
    setDateType("all")
    setDateFrom("")
    setDateTo("")
    setPage(1)
  }

  // Pagination logic
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const visibleButtons = 5
  let startPage = Math.max(1, page - Math.floor(visibleButtons / 2))
  let endPage = startPage + visibleButtons - 1
  if (endPage > pageCount) {
    endPage = pageCount
    startPage = Math.max(1, endPage - visibleButtons + 1)
  }
  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i)

  // Goto page form
  const handleGotoPage = (e: React.FormEvent) => {
    e.preventDefault()
    let n = parseInt(gotoPage)
    if (isNaN(n)) return
    if (n < 1) n = 1
    if (n > pageCount) n = pageCount
    setPage(n)
    setGotoPage("")
  }

  // Theme util classes
  const bgMain =
    theme === "dark"
      ? "bg-white/10 backdrop-blur-xl border-white/20"
      : "bg-white/90 backdrop-blur-xl border-[#e5e8ee]"
  const textMain = theme === "dark" ? "text-white" : "text-gray-900"
  const tableBg = theme === "dark" ? "bg-white/10" : "bg-gray-100"
  const modalBg =
    theme === "dark"
      ? "bg-[#18162c] border-white/20"
      : "bg-white border-gray-200"

  return (
    <div className={`rounded-2xl mt-8 p-4 md:p-6 border shadow-lg ${bgMain}`}>
      {/* Detail Modal */}
      {showDetail && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowDetail(null)}
        >
          <div
            className={`rounded-xl p-6 shadow-xl w-full max-w-lg relative border ${modalBg}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-red-400"
              onClick={() => setShowDetail(null)}
              aria-label="Close"
            >✕</button>
            <div className="text-lg font-bold mb-3 text-purple-700 dark:text-purple-400">Detail Data</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><b>ID:</b> {showDetail.id}</div>
              <div><b>Tanggal:</b> {showDetail.date ? new Date(showDetail.date).toLocaleDateString("id-ID") : ""}</div>
              <div><b>eNodeB Name:</b> {showDetail.enodeb_name}</div>
              <div><b>Traffic (GB):</b> {showDetail.ioh_4g_total_traffic_gb}</div>
              <div><b>RRC User:</b> {showDetail.ioh_rrc_connected_user}</div>
              <div><b>Availability:</b> {showDetail.ioh_4g_availability_auto}</div>
              <div><b>AbnormRel TNL:</b> {showDetail.l_e_rab_abnormrel_tnl}</div>
              <div><b>Last TTI:</b> {showDetail.ioh_last_tti}</div>
              <div><b>Site ID:</b> {showDetail.site_ide}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className={`font-semibold text-lg ${textMain}`}>Tabel Data</div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCSVUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-700 transition"
          >
            Upload CSV
          </button>
        </div>
      </div>

      {/* Filter Area */}
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        {/* Nama+Site ID dropdown */}
        <div className="flex flex-col">
          <label className={`text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"} mb-1`}>Nama + Site ID</label>
          <select
            value={selectedSite}
            onChange={e => {
              setSelectedSite(e.target.value)
              setPage(1)
            }}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${theme === "dark" ? "bg-white/10 text-white border-white/15" : "bg-white text-gray-900 border-gray-200"}`}
          >
            <option value="">Semua</option>
            {sites.map((s, idx) => (
              <option key={idx} value={s.enodeb_name + "|" + s.site_ide}>
                {s.enodeb_name} ({s.site_ide})
              </option>
            ))}
          </select>
        </div>
        {/* Periode */}
        <div className="flex flex-col">
          <label className={`text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"} mb-1`}>Periode</label>
          <select
            value={dateType}
            onChange={e => {
              setDateType(e.target.value)
              setPage(1)
            }}
            className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${theme === "dark" ? "bg-white/10 text-white border-white/15" : "bg-white text-gray-900 border-gray-200"}`}
          >
            <option value="all">All Time</option>
            <option value="week">Mingguan</option>
            <option value="month">Bulanan</option>
            <option value="year">Tahunan</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        {dateType === "custom" && (
          <>
            <div className="flex flex-col">
              <label className={`text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"} mb-1`}>Dari</label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${theme === "dark" ? "bg-white/10 text-white border-white/15" : "bg-white text-gray-900 border-gray-200"}`}
              />
            </div>
            <div className="flex flex-col">
              <label className={`text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"} mb-1`}>Sampai</label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 ${theme === "dark" ? "bg-white/10 text-white border-white/15" : "bg-white text-gray-900 border-gray-200"}`}
              />
            </div>
          </>
        )}
        <button
          onClick={resetFilter}
          className={`rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-900 transition ml-2 mt-4 md:mt-0 ${theme === "dark" ? "bg-white/10 text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-500"}`}
          type="button"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto rounded-xl border ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
        <table className={`min-w-full text-sm ${textMain}`}>
          <thead>
            <tr className={tableBg}>
              <th className="p-2">ID</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">eNodeB Name</th>
              <th className="p-2">Traffic (GB)</th>
              <th className="p-2">RRC User</th>
              <th className="p-2">Availability</th>
              <th className="p-2">AbnormRel TNL</th>
              <th className="p-2">Last TTI</th>
              <th className="p-2">Site ID</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center p-8">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-8">
                  Data kosong
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className={`hover:bg-white/10 transition cursor-pointer`}>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.id}</td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>
                    {row.date ? new Date(row.date).toLocaleDateString("id-ID") : ""}
                  </td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.enodeb_name}</td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.ioh_4g_total_traffic_gb}</td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.ioh_rrc_connected_user}</td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.ioh_4g_availability_auto}</td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.l_e_rab_abnormrel_tnl}</td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.ioh_last_tti}</td>
                  <td className="p-2" onClick={() => setShowDetail(row)}>{row.site_ide}</td>
                  <td className="p-2">
                    <input
                      ref={el => { perDataFileRef.current[i] = el!; }}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={e => handleUploadPerData(i, e)}
                    />
                    <button
                      onClick={() => {
                        setShowUploadIdx(i)
                        perDataFileRef.current[i]?.click()
                      }}
                      className="bg-purple-500 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-xs"
                    >
                      Upload CSV
                    </button>
                  </td>
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
          {/* Goto page input */}
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
  )
}
