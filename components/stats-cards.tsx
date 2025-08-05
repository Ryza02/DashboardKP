"use client";

import { TrendingUp, HardDriveDownload, Gauge, Globe2 } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StatsCards() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    todayTotal: 0,
    todayTotalLabel: "Hari Ini",
    totalGb: 0,
    avgGs: 0,
    totalSite: 0,
  });
  const [modal, setModal] = useState<null | {
    title: string;
    value: string;
    desc: string;
    fullValue: string;
  }>(null);

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then(res => res.json())
      .then(setStats);
  }, []);

  const cards = [
    {
      title: `Total ${stats.todayTotalLabel}`,
      value: stats.todayTotal?.toLocaleString() || "0",
      fullValue: stats.todayTotal + "",
      desc: "Jumlah trafik (GB) pada hari ini atau hari terakhir di database.",
      icon: HardDriveDownload,
      color: "from-[#7f5af0] to-[#4ea8de]",
    },
    {
      title: "Total GB",
      value: Number(stats.totalGb).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      fullValue: stats.totalGb + "",
      desc: "Total trafik (GB) seluruh waktu.",
      icon: TrendingUp,
      color: "from-[#1ee9b6] to-[#4ea8de]",
    },
    {
      title: "Rata-rata GS per Hari",
      value: Number(stats.avgGs).toLocaleString(undefined, { maximumFractionDigits: 2 }),
      fullValue: stats.avgGs + "",
      desc: "Rata-rata trafik (GB) per hari.",
      icon: Gauge,
      color: "from-[#4ea8de] to-[#7f5af0]",
    },
    {
      title: "Total Site (Daerah)",
      value: stats.totalSite?.toLocaleString() || "0",
      fullValue: stats.totalSite + "",
      desc: "Total site unik di seluruh data.",
      icon: Globe2,
      color: "from-[#ffb86b] to-[#fa709a]",
    },
  ];

  return (
    <div>
      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setModal(null)}>
          <div
            className={`rounded-xl p-6 shadow-xl w-full max-w-sm relative border ${theme === "dark" ? "bg-[#18162c] border-white/20" : "bg-white border-gray-200"}`}
            onClick={e => e.stopPropagation()}
          >
            <button className="absolute right-3 top-3 text-gray-400 hover:text-red-400" onClick={() => setModal(null)}>✕</button>
            <div className="text-lg font-bold mb-2 text-purple-600 dark:text-purple-400">{modal.title}</div>
            <div className="mb-2 text-2xl font-bold break-all">{modal.fullValue}</div>
            <div className="mb-4 text-xs text-gray-400">{modal.desc}</div>
            <button
              className="px-4 py-2 rounded bg-purple-600 text-white font-semibold text-sm"
              onClick={() => {
                navigator.clipboard.writeText(modal.fullValue);
              }}
            >Copy</button>
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-2">
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
            onClick={() => setModal({
              title: stat.title,
              value: stat.value,
              desc: stat.desc,
              fullValue: stat.fullValue
            })}
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
    </div>
  );
}
