"use client"

import { useState } from "react"
import { ChevronDown, Search, XCircle } from "lucide-react"
import { useTheme } from "./theme-provider"

const siteEnodebOptions = [
  "Semua Site / Semua ENodeB",
  "Site 1 / ENodeB 1",
  "Site 1 / ENodeB 2",
  "Site 2 / ENodeB 1",
  "Site 2 / ENodeB 2"
]
const periodOptions = [
  { label: "Harian", value: "daily" },
  { label: "Mingguan", value: "weekly" },
  { label: "Bulanan", value: "monthly" },
  { label: "Tahunan", value: "yearly" },
  { label: "Custom", value: "custom" },
]

export default function Filter({ onSearch }: { onSearch?: (params: any) => void }) {
  const { theme } = useTheme()
  const [siteEnodeb, setSiteEnodeb] = useState(siteEnodebOptions[0])
  const [period, setPeriod] = useState(periodOptions[0].value)
  const [customRange, setCustomRange] = useState({ start: "", end: "" })

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (onSearch) {
      onSearch({
        siteEnodeb,
        period,
        customRange: period === "custom" ? customRange : undefined
      })
    }
  }
  function handleReset() {
    setSiteEnodeb(siteEnodebOptions[0])
    setPeriod(periodOptions[0].value)
    setCustomRange({ start: "", end: "" })
    if (onSearch) onSearch({})
  }

  // Core dropdown/input class
  const base =
    "rounded-xl border px-4 py-2 font-semibold transition-all duration-150 backdrop-blur-md focus:outline-none focus:ring-2"
  const glassDark =
    "border-white/10 bg-white/10 text-white focus:ring-purple-500 placeholder:text-white/60"
  const glassLight =
    "border-[#e5e8ee] bg-white/70 text-gray-900 focus:ring-purple-400 placeholder:text-gray-400"

  // Dropdown menu dark style (fix browser white popup)
  const dropdownStyle = `
    select:-webkit-autofill,
    select {
      background: ${theme === "dark"
        ? "rgba(24,25,40, 0.98)"
        : "rgba(255,255,255,0.99)"
      } !important;
      color: ${theme === "dark" ? "#fff" : "#191927"} !important;
    }
    option {
      background: ${theme === "dark"
        ? "#232338"
        : "#fff"
      } !important;
      color: ${theme === "dark" ? "#fff" : "#232338"} !important;
    }
  `

  return (
    <div className={`
      glass rounded-2xl p-4 shadow border
      ${theme === "dark" ? "border-white/10 bg-white/5" : "border-[#e5e8ee] bg-white/90"}
      w-full mb-2
    `}>
      {/* <style> inject dropdown bg for <select> */}
      <style>{dropdownStyle}</style>

      <form
        className="w-full flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-4"
        onSubmit={handleSearch}
      >
        {/* Site+ENodeB */}
        <label className="flex flex-col w-full md:w-auto">
          <span className="text-xs font-medium text-gray-400 mb-1">Site / ENodeB</span>
          <div className="relative">
            <select
              className={[
                base,
                theme === "dark" ? glassDark : glassLight,
                "appearance-none w-full pr-8"
              ].join(" ")}
              value={siteEnodeb}
              onChange={e => setSiteEnodeb(e.target.value)}
            >
              {siteEnodebOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </label>

        {/* Periode */}
        <label className="flex flex-col w-full md:w-auto">
          <span className="text-xs font-medium text-gray-400 mb-1">Periode</span>
          <div className="relative">
            <select
              className={[
                base,
                theme === "dark" ? glassDark : glassLight,
                "appearance-none w-full pr-8"
              ].join(" ")}
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              {periodOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </label>

        {/* Date Custom Range */}
        {period === "custom" && (
          <>
            <label className="flex flex-col w-full md:w-auto">
              <span className="text-xs font-medium text-gray-400 mb-1">Dari</span>
              <input
                type="date"
                className={[
                  base,
                  theme === "dark" ? glassDark : glassLight,
                  "px-3"
                ].join(" ")}
                value={customRange.start}
                onChange={e => setCustomRange({ ...customRange, start: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col w-full md:w-auto">
              <span className="text-xs font-medium text-gray-400 mb-1">Sampai</span>
              <input
                type="date"
                className={[
                  base,
                  theme === "dark" ? glassDark : glassLight,
                  "px-3"
                ].join(" ")}
                value={customRange.end}
                onChange={e => setCustomRange({ ...customRange, end: e.target.value })}
                required
              />
            </label>
          </>
        )}

        {/* Tombol - grid supaya always sejajar, shrink on mobile */}
        <div className="flex gap-2 w-full md:w-auto justify-center items-end md:items-center mt-2 md:mt-6">
          <button
            type="button"
            onClick={handleReset}
            className={`
              flex items-center px-4 py-2 rounded-xl text-base font-semibold
              transition-all duration-200 border
              ${theme === "dark"
                ? "bg-white/10 text-white hover:bg-white/20 border-white/15"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-[#e5e8ee]"}
              shadow
            `}
          >
            <XCircle className="w-5 h-4 mr-1" /> Reset
          </button>
          <button
            type="submit"
            className={`
              flex items-center px-6 py-2 rounded-xl text-base font-semibold
              bg-gradient-to-r from-purple-500 to-blue-500
              hover:from-purple-600 hover:to-blue-600
              text-white shadow-lg
              transition-all duration-200
              focus:ring-2 focus:ring-purple-400
            `}
            style={{
              boxShadow: "0 3px 18px 0 rgba(127,90,240,0.13)"
            }}
          >
            <Search className="w-5 h-5 mr-2" /> Cari
          </button>
        </div>
      </form>
    </div>
  )
}
