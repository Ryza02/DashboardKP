"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Table, UsersRound, Globe, User, LogIn, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"
import { useEffect } from "react"

const navigation = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Table", icon: Table, href: "/table" },
  { name: "Chat", icon: UsersRound, href: "/chatuser" },
  { name: "RTL", icon: Globe, href: "/rtl" },
]
const accountPages = [
  { name: "Profile", icon: User, href: "/profile" },
  { name: "Sign In", icon: LogIn, href: "/signin" },
  { name: "Sign Up", icon: UserPlus, href: "/signup" },
]

export default function Sidebar({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const { theme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 bg-black/40 ${open ? "block lg:hidden" : "hidden"}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 lg:sticky left-0 top-0 w-[82vw] max-w-[285px] lg:w-64 h-screen flex flex-col
          ${theme === "dark"
            ? "bg-white/10 backdrop-blur-xl border-white/20"
            : "bg-white/80 backdrop-blur-xl border-gray-200 shadow-2xl"}
          border-r transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        style={{
          minHeight: "100dvh", // for mobile browser compatibility
          height: "100vh",     // for desktop
        }}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center
              ${theme === "dark" ? "bg-white" : "bg-gradient-to-tr from-purple-600 to-blue-400"}
              font-bold text-lg shadow`}>
              <span className={`${theme === "dark" ? "text-purple-700" : "text-white"}`}>V</span>
            </div>
            <span className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Project Dashboard
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`lg:hidden ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto pb-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                ${pathname === item.href
                  ? theme === "dark"
                    ? "bg-white/20 text-white shadow-lg"
                    : "bg-purple-100 text-purple-700 shadow-md"
                  : theme === "dark"
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}
              `}
              onClick={() => setOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-5">
            <p className={`px-4 text-xs font-semibold uppercase tracking-wider
              ${theme === "dark" ? "text-white/50" : "text-gray-400"}`}>Pengaturan Akun</p>
            <div className="mt-2 space-y-1">
              {accountPages.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                    ${pathname === item.href
                      ? theme === "dark"
                        ? "bg-white/20 text-white shadow-lg"
                        : "bg-purple-100 text-purple-700 shadow-md"
                      : theme === "dark"
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}
                  `}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="py-4 text-center text-xs text-gray-400">IOH ©2025</div>
      </aside>
    </>
  )
}
