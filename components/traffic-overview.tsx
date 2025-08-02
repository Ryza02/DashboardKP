"use client"
import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"

type ChartData = {
  label : string
  growth: number
  series: { month: string; value: number }[]
}

export default function TrafficOverview() {
  const { theme } = useTheme()
  const [data, setData] = useState<ChartData | null>(null)

  useEffect(() => {
    fetch("/api/traffic-overview")
      .then(res => res.json())
      .then(setData)
  }, [])

  // Jika belum ada data, loading
  if (!data) {
    return (
      <div className={`rounded-2xl p-4 md:p-6 border h-64 flex items-center justify-center
        ${theme === "dark"
          ? "bg-white/10 backdrop-blur-xl border-white/20"
          : "bg-white/80 backdrop-blur-xl border-gray-200 shadow-lg"
        }`
      }>
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    )
  }

  // Untuk chart svg path
  const maxVal = Math.max(...data.series.map(d => d.value))
  const minVal = Math.min(...data.series.map(d => d.value))
  // Normalisasi value ke tinggi 160px (SVG y terbalik)
  const points = data.series.map((d, i) => {
    const x = (i / 11) * 400
    const y = 160 - ((d.value - minVal) / (maxVal - minVal + 1e-4)) * 120
    return [x, y]
  })
  // Path generator (line)
  const linePath = `M ${points[0][0]} ${points[0][1]} ` + points.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ')
  // Area path (bawah line)
  const areaPath = `${linePath} L 400 200 L 0 200 Z`

  return (
    <div
      className={`rounded-2xl p-4 md:p-6 border transition-all duration-200 hover:scale-105 ${
        theme === "dark"
          ? "bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15"
          : "bg-white/80 backdrop-blur-xl border-gray-200 shadow-lg hover:shadow-xl"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{data.label}</h3>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 md:h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2="400"
              y2={i * 40}
              stroke={theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)"}
              strokeWidth="1"
            />
          ))}
          {/* Area */}
          <path d={areaPath} fill="url(#areaGradient)" />
          {/* Line */}
          <path d={linePath} stroke="#06b6d4" strokeWidth="3" fill="none" />
        </svg>
        {/* Month labels */}
        <div
          className={`absolute bottom-0 left-0 right-0 flex justify-between text-xs px-4 ${
            theme === "dark" ? "text-white/60" : "text-gray-400"
          }`}
        >
          {data.series.map((d, i) =>
            <span key={d.month} className={`${i % 2 !== 0 ? "hidden sm:inline" : ""}`}>
              {d.month}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
