"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useTheme } from "@/components/theme-provider";

// Dynamic import: HANYA render di client, ssr: false
const DetailDataCard = dynamic(() => import("@/components/detail-card-data"), { ssr: false });

export default function TablePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const { theme } = useTheme();

  return (
    <div className={`
      min-h-screen w-full relative transition-colors duration-300
      ${theme === 'dark'
        ? 'bg-[#19192a]'
        : 'bg-white'}
    `}>
      <div className="flex">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 md:p-6 space-y-6">
            <DetailDataCard page={page} setPageCount={setPageCount} setPage={setPage} />
          </main>
        </div>
      </div>
    </div>
  );
}
