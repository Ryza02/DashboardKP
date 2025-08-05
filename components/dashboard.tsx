"use client";

import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StatsCards from "@/components/stats-cards";
import LowestAvailabilityChart from "@/components/lowest-site";
import TopSiteTrafficChart from "@/components/top-site-traffic";
import Traffic from "@/components/traffic";

export default function Dashboard() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sectorOptions, setSectorOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetch("/api/traffic")
      .then(res => res.json())
      .then(data => setSectorOptions(data.sectors || []));
  }, []);

  function handleFilterChange(params: any) {
    console.log("Filter params:", params);
  }

  return (
    <div className={
      `min-h-screen relative transition-colors duration-300 bg-gradient-to-br from-[#181928] via-[#151523] to-[#181924]`}>
      {/* Accent background lights (dark mode only) */}
        <div className="pointer-events-none select-none fixed z-0 w-full h-full">
          <div className="absolute left-[-8vw] top-[-8vw] w-[32vw] h-[32vw] rounded-full blur-3xl opacity-25 bg-[#ad6eff]" />
          <div className="absolute right-[-6vw] top-[20vw] w-[24vw] h-[24vw] rounded-full blur-2xl opacity-20 bg-[#00e0d3]" />
          <div className="absolute right-[12vw] bottom-[-8vw] w-[28vw] h-[24vw] rounded-full blur-2xl opacity-15 bg-[#ffb300]" />
        </div>

      <div className="flex relative z-10">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 p-4 md:p-6 space-y-6">
            {/* Section: Stat Cards */}
            <StatsCards />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="rounded-2xl border border-[#232335] bg-[#181928] p-4 shadow-sm">
                <TopSiteTrafficChart />
              </div>
              <div className="rounded-2xl border border-[#232335] bg-[#181928] p-4 shadow-sm">
                <LowestAvailabilityChart />
              </div>
            </div>

            {/* ====== ROW: Traffic + Chart/Card Tambahan ====== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-[#232335] bg-[#181928] p-4 shadow-sm flex flex-col">
                <Traffic />
              </div>
              <div className="flex flex-col gap-6">
                {/* Tambahkan chart/card lain di sini */}
                <div className="rounded-2xl border border-[#232335] bg-[#181928] p-4 min-h-[180px] flex items-center justify-center text-gray-400">
                  Chart / Card Tambahan
                </div>
                <div className="rounded-2xl border border-[#232335] bg-[#181928] p-4 min-h-[180px] flex items-center justify-center text-gray-400">
                  Chart / Card Tambahan
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}