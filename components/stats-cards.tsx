"use client"

import { TrendingUp, HardDriveDownload, Gauge, Globe2 } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function StatsCards() {
  const { theme } = useTheme()
  const [stats, setStats] = useState({
    todayTotal: 0,
    totalGb: 0,
    avgGs: 0,
    totalSite: 0,
  })

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then(res => res.json())
      .then(setStats)
  }, [])

  const cards = [
    {
      title: "Total Hari Ini",
      value: stats.todayTotal?.toLocaleString() || "0",
      icon: HardDriveDownload,
      color: "from-[#7f5af0] to-[#4ea8de]",
    },
    {
      title: "Total GB",
      value: Number(stats.totalGb).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      icon: TrendingUp,
      color: "from-[#1ee9b6] to-[#4ea8de]",
    },
    {
      title: "Rata-rata GS per Hari",
      value: Number(stats.avgGs).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      icon: Gauge,
      color: "from-[#4ea8de] to-[#7f5af0]",
    },
    {
      title: "Total Site (Daerah)",
      value: stats.totalSite?.toLocaleString() || "0",
      icon: Globe2,
      color: "from-[#ffb86b] to-[#fa709a]",
    },
  ]

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-2">
      {cards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 + index * 0.08, type: "spring" }}
          className={`
            rounded-2xl p-4 md:p-6 border min-w-0
            group cursor-pointer select-none relative overflow-hidden
            hover:scale-[1.03] transition-all duration-200
            ${theme === "dark"
              ? "bg-white/10 backdrop-blur-xl border-white/15 hover:bg-white/20"
              : "bg-white/90 border-[#e5e8ee] shadow-md hover:shadow-lg"}
          `}
        >
          {/* Gradient background accent */}
          <span
            className={`absolute z-0 right-[-18%] bottom-[-34%] w-[110px] h-[110px] rounded-full blur-2xl opacity-40 pointer-events-none bg-gradient-to-br ${stat.color}`}
          />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1 min-w-0">
              <p className={`truncate text-sm font-medium ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
                {stat.title}
              </p>
              <p className={`truncate text-2xl md:text-3xl font-bold tracking-tight mt-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {stat.value}
              </p>
            </div>
            <div
              className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center ml-4 shadow-lg`}
            >
              <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-sm" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
