"use client"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { useTheme } from "./theme-provider"

export default function TopSiteTrafficChart() {
  const [rows, setRows] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetch("/api/top-site-traffic")
      .then(res => res.json())
      .then(setRows)
  }, [])

  // Nama gradient
  const gradientId = "trafficBarGradient"
  const gradientHoverId = "trafficBarGradientHover"

  return (
    <div className={`
      rounded-2xl p-4 md:p-6 transition-all duration-300 border
      ${theme === "dark" ? "bg-white/10 border-white/20" : "bg-white/80 border-gray-200"}
      shadow-lg hover:shadow-2xl hover:scale-[1.03] cursor-pointer
    `}>
      <div className={`font-semibold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
        Top 5 Site Traffic Bulan Ini
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={rows}
          margin={{ left: 32, right: 20, bottom: 10 }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {/* Defs TIDAK diimport, cukup tulis langsung di JSX */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id={gradientHoverId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#a78bfa" : "#d1d5db"} />
          <YAxis stroke={theme === "dark" ? "#fff" : "#22223b"} />
          <Tooltip
            cursor={{ fill: theme === "dark" ? "#6366f11a" : "#6366f12c" }}
            contentStyle={{
              background: theme === "dark" ? "#18103A" : "#fff",
              color: theme === "dark" ? "#fff" : "#22223b",
              borderRadius: 14,
              border: "none",
              fontSize: 13,
              minWidth: 120,
              boxShadow: "0 4px 20px #0003"
            }}
            formatter={(value: any) =>
              [`${Number(value).toLocaleString("id-ID", { maximumFractionDigits: 2 })} GB`, "Total Traffic"]
            }
            labelFormatter={(_, payload: any) => {
              if (!payload || !payload[0]) return ""
              return (
                <span style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#0ea5e9"
                }}>
                  {payload[0].payload.enodeb_name}
                </span>
              )
            }}
          />
          <Bar
            dataKey="total_gb"
            fill={`url(#${gradientId})`}
            radius={[8, 8, 0, 0]}
            barSize={32}
            onMouseOver={(_, idx) => setActiveIndex(idx)}
            // Gradient hover effect
            activeIndex={activeIndex ?? undefined}
            activeBar={{
              fill: `url(#${gradientHoverId})`,
              stroke: "#fff",
              strokeWidth: 2,
              style: { filter: "drop-shadow(0 2px 12px #38bdf880)" }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
