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

export default function LowestAvailabilityChart() {
  const [rows, setRows] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetch("/api/lowest-availability")
      .then(res => res.json())
      .then(setRows)
  }, [])

  // Gradient untuk warning: kuning ke oranye (dan hover oranye-merah)
  const gradientId = "availabilityBarGradient"
  const gradientHoverId = "availabilityBarGradientHover"

  return (
    <div className={`
      rounded-2xl p-4 md:p-6 transition-all duration-300 border
      ${theme === "dark" ? "bg-white/10 border-white/20" : "bg-white/80 border-gray-200"}
      shadow-lg hover:shadow-2xl hover:scale-[1.03] cursor-pointer
    `}>
      <div className={`font-semibold text-lg mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
        5 Site dengan Availability Terendah
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={rows}
          margin={{ left: 32, right: 20, bottom: 10 }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {/* Linear Gradient */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#fde68a" /> {/* kuning */}
              <stop offset="100%" stopColor="#f59e42" /> {/* oranye */}
            </linearGradient>
            <linearGradient id={gradientHoverId} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f59e42" /> {/* oranye */}
              <stop offset="100%" stopColor="#ef4444" /> {/* merah */}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#fbbf24" : "#fbbf24"} />
          <YAxis stroke={theme === "dark" ? "#fff" : "#22223b"} />
          <Tooltip
            cursor={{ fill: theme === "dark" ? "#fbbf241a" : "#fbbf242c" }}
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
              [`${Number(value).toFixed(2)}%`, "Availability"]
            }
            labelFormatter={(_, payload: any) => {
              if (!payload || !payload[0]) return ""
              return (
                <span style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#f59e42"
                }}>
                  {payload[0].payload.enodeb_name}
                </span>
              )
            }}
          />
          <Bar
            dataKey="avg_avail"
            fill={`url(#${gradientId})`}
            radius={[8, 8, 0, 0]}
            barSize={32}
            onMouseOver={(_, idx) => setActiveIndex(idx)}
            // Hover gradient effect
            activeIndex={activeIndex ?? undefined}
            activeBar={{
              fill: `url(#${gradientHoverId})`,
              stroke: "#fff",
              strokeWidth: 2,
              style: { filter: "drop-shadow(0 2px 12px #fbbf2480)" }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
