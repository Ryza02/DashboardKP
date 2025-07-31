"use client"

import { usePathname } from "next/navigation"
import { Bell, Settings, Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

function pageTitleFromPath(path: string) {
  if (path === "/" || path === "/dashboard") return "Dashboard"
  return path.replace(/^\//, "").split("/").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" / ")
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const page = pageTitleFromPath(pathname)

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <header
      className={`
        sticky top-0 z-40
        ${theme === "dark"
          ? "bg-white/5 backdrop-blur-xl border-b border-white/10"
          : "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm"}
        transition-all duration-200
        px-4 md:px-6 py-4
      `}
    >
      <div className="flex items-center justify-between">
        {/* Left: burger + page title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`lg:hidden ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div>
            <div className={`flex items-center space-x-2 text-xs ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>
              <span>/ Halaman</span>
            </div>
            <h1 className={`font-semibold leading-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{page}</h1>
          </div>
        </div>
        {/* Right: theme, settings, notif */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`transition-all duration-200 ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`transition-all duration-200 ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`transition-all duration-200 ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
