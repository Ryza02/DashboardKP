"use client"

import { useTheme } from "@/components/theme-provider"
import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import StatsCards from "@/components/stats-cards"
import WelcomeCard from "@/components/welcome-card"
import LowestAvailabilityChart from "@/components/lowest-site"
import SalesOverview from "@/components/sales-overview"
import ActiveUsers from "@/components/active-users"
import FilterDropdown from "@/components/filter-dropdown"
import TopSiteTrafficChart from "@/components/top-site-traffic"

export default function Dashboard() {
  const { theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`
      min-h-screen relative transition-colors duration-300
      ${theme === 'dark'
        ? 'bg-gradient-to-br from-[#181928] via-[#151523] to-[#181924]'
        : 'bg-white'}
    `}>
      {/* Accent background lights (hanya di dark mode) */}
      {theme === "dark" && (
        <div className="pointer-events-none select-none fixed z-0 w-full h-full">
          <div className="absolute left-[-8vw] top-[-8vw] w-[32vw] h-[32vw] rounded-full blur-3xl opacity-25 bg-[#ad6eff]" />
          <div className="absolute right-[-6vw] top-[20vw] w-[24vw] h-[24vw] rounded-full blur-2xl opacity-20 bg-[#00e0d3]" />
          <div className="absolute right-[12vw] bottom-[-8vw] w-[28vw] h-[24vw] rounded-full blur-2xl opacity-15 bg-[#ffb300]" />
        </div>
      )}

      <div className="flex relative z-10">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 p-4 md:p-6 space-y-6">
            {/* Stat Cards */}
            <StatsCards />

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 flex flex-col gap-6">
                <WelcomeCard />
                <div className="glass rounded-2xl p-4 shadow-md border border-[#e5e8ee]">
                  <FilterDropdown onSearch={params => { console.log(params) }} />
                </div>
              </div>
              <div className="lg:col-span-1 glass rounded-2xl p-4 shadow-md border border-[#e5e8ee] flex flex-col justify-center">
                <TopSiteTrafficChart />
              </div>
              <div className="lg:col-span-1 glass rounded-2xl p-4 shadow-md border border-[#e5e8ee] flex flex-col justify-center">
                <LowestAvailabilityChart />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-4 shadow-md border border-[#e5e8ee]">
                <SalesOverview />
              </div>
              <div className="glass rounded-2xl p-4 shadow-md border border-[#e5e8ee]">
                <ActiveUsers />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
