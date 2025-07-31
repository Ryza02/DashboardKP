"use client"

import { useTheme } from "./theme-provider"

export default function SalesOverview() {
  const { theme } = useTheme()

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
          <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Sales Overview</h3>
          <p className="text-green-400 text-sm">+5% more in 2021</p>
        </div>
      </div>

      {/* Chart placeholder */}
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
              stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              strokeWidth="1"
            />
          ))}

          {/* Area chart */}
          <path
            d="M 0 160 Q 50 120 100 140 T 200 100 T 300 120 T 400 80 L 400 200 L 0 200 Z"
            fill="url(#areaGradient)"
          />

          {/* Line chart */}
          <path
            d="M 0 160 Q 50 120 100 140 T 200 100 T 300 120 T 400 80"
            stroke="#06b6d4"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        {/* Month labels */}
        <div
          className={`absolute bottom-0 left-0 right-0 flex justify-between text-xs px-4 ${
            theme === "dark" ? "text-white/60" : "text-gray-400"
          }`}
        >
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
            <span key={month} className="hidden sm:inline">
              {month}
            </span>
          ))}
          {/* Mobile version - show fewer labels */}
          <span className="sm:hidden">Jan</span>
          <span className="sm:hidden">Apr</span>
          <span className="sm:hidden">Jul</span>
          <span className="sm:hidden">Oct</span>
          <span className="sm:hidden">Dec</span>
        </div>
      </div>
    </div>
  )
}
