"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

const PERIOD_OPTIONS = [
  { label: "All Time", value: "all" },
  { label: "Minggu Ini", value: "week" },
  { label: "Bulan Ini", value: "month" },
  { label: "Tahun Ini", value: "year" },
  { label: "Custom", value: "custom" },
]

type SiteOption = { label: string; value: string }

export default function FilterDropdown({
  onSearch,
}: {
  onSearch?: (params: {
    site: string
    dateType: string
    dateFrom?: string
    dateTo?: string
  }) => void
}) {
  const [site, setSite] = useState("all")
  const [dateType, setDateType] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [siteOptions, setSiteOptions] = useState<SiteOption[]>([
    { label: "All Nama + Site", value: "all" },
  ])

  // Fetch nama + site dari backend
  useEffect(() => {
    fetch("/api/sites")
      .then((res) => res.json())
      .then((data) => {
        setSiteOptions([
          { label: "All Nama + Site", value: "all" },
          ...(data.options || []),
        ])
      })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.({
      site,
      dateType,
      ...(dateType === "custom" ? { dateFrom, dateTo } : {}),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-4 rounded-2xl p-4 md:p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg flex flex-col md:flex-row items-end gap-4"
    >
      {/* Dropdown Nama+Site */}
      <div className="flex flex-col w-full md:w-1/3">
        <label className="mb-1 text-xs font-semibold text-white/70">
          Nama + Site
        </label>
        <select
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="px-3 py-2 rounded-lg border border-transparent focus:ring-2 focus:ring-purple-500 bg-gray-900/80 text-white"
        >
          {siteOptions.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Periode */}
      <div className="flex flex-col w-full md:w-1/4">
        <label className="mb-1 text-xs font-semibold text-white/70">
          Periode
        </label>
        <select
          value={dateType}
          onChange={(e) => setDateType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-transparent focus:ring-2 focus:ring-purple-500 bg-gray-900/80 text-white"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Custom date range */}
      {dateType === "custom" && (
        <>
          <div className="flex flex-col w-full md:w-1/5">
            <label className="mb-1 text-xs font-semibold text-white/70">
              Dari
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-lg border border-transparent focus:ring-2 focus:ring-purple-500 bg-gray-900/80 text-white"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/5">
            <label className="mb-1 text-xs font-semibold text-white/70">
              Sampai
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-lg border border-transparent focus:ring-2 focus:ring-purple-500 bg-gray-900/80 text-white"
            />
          </div>
        </>
      )}
      {/* Search button */}
      <div className="flex items-end h-full md:mt-0">
        <button
          type="submit"
          className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          title="Cari"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}
