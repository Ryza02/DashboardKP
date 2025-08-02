"use client"

import { useTheme } from "./theme-provider"

export default function ActiveUsers() {
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
          <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Active Users</h3>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-32 md:h-48 flex items-end justify-between space-x-1 md:space-x-2 mb-6">
        {[40, 60, 80, 45, 90, 70, 85, 95, 75, 65, 85, 90].map((height, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t flex-1 transition-all duration-300 hover:from-blue-500 hover:to-cyan-300"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      </div>
  )
}
