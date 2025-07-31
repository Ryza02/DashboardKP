"use client"

import { ArrowRight } from "lucide-react"
import { useTheme } from "./theme-provider"

export default function WelcomeCard() {
  const { theme } = useTheme()

  return (
    <div
      className={`rounded-2xl p-4 md:p-6 text-white relative overflow-hidden transition-all duration-200 hover:scale-105 ${
        theme === "dark"
          ? "bg-gradient-to-r from-blue-600 to-purple-700"
          : "bg-gradient-to-r from-purple-600 to-blue-700"
      }`}
    >
      <div className="relative z-10">
        <p className="text-white/80 text-sm mb-2">Welcome back,</p>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Riza</h2>
        <p className="text-white/80 text-sm mb-4">
          Glad to see you again!
          <br />
          Ask me anything.
        </p>
        <button className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors">
          <span className="text-sm">Tap to record</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Brain illustration placeholder */}
      <div className="absolute right-4 top-4 w-24 h-24 md:w-32 md:h-32 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full"></div>
      </div>
    </div>
  )
}
