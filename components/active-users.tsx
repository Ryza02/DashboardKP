"use client"

import { useTheme } from "./theme-provider"

const userData = [
  { label: "Users", value: "32,984", color: "bg-blue-500" },
  { label: "Clicks", value: "2.42M", color: "bg-cyan-500" },
  { label: "Sales", value: "2,400$", color: "bg-red-500" },
  { label: "Items", value: "320", color: "bg-blue-600" },
]

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
          <p className="text-green-400 text-sm">(+23) than last week</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {userData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 md:space-x-3">
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${item.color}`} />
            <div>
              <p className={`text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>{item.label}</p>
              <p className={`font-semibold text-sm md:text-base ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
