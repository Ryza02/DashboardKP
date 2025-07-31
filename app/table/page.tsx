"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import DetailDataCard from "@/components/detail-card-data";

export default function TablePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-gray-50 light:via-blue-50 light:to-indigo-100">
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
