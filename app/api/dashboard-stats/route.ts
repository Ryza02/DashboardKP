// app/api/dashboard-stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Ganti dengan field dan table sesuai database-mu!
export async function GET(req: NextRequest) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // ganti password jika ada
    database: "db_ioh",
  });

  // Ambil hari ini (format yyyy-mm-dd)
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Cek apakah ada data untuk hari ini
  const [todayRows]: any = await connection.execute(
    "SELECT SUM(`Traffic GB`) AS total FROM traffic_data WHERE DATE(`Date`) = ?",
    [todayStr]
  );
  let todayTotal = todayRows[0].total;

  let label = "Hari Ini";

  // Jika tidak ada data hari ini, ambil data tanggal terakhir yang ada
  if (!todayTotal || todayTotal === 0) {
    // Cari tanggal terakhir
    const [lastRows]: any = await connection.execute(
      "SELECT DATE(`Date`) AS last_date FROM traffic_data ORDER BY `Date` DESC LIMIT 1"
    );
    if (lastRows.length > 0) {
      const lastDate = lastRows[0].last_date;
      label = `Terakhir (${lastDate})`;

      const [lastTotalRows]: any = await connection.execute(
        "SELECT SUM(`Traffic GB`) AS total FROM traffic_data WHERE DATE(`Date`) = ?",
        [lastDate]
      );
      todayTotal = lastTotalRows[0].total;
    }
  }

  // TOTAL GB SEMUA DATA
  const [totalRows]: any = await connection.execute(
    "SELECT SUM(`Traffic GB`) AS total FROM traffic_data"
  );
  const totalGb = totalRows[0].total || 0;

  // RATA2 GS/HARI (GS di sini misal diambil dari rata-rata Traffic GB per hari)
  const [avgRows]: any = await connection.execute(
    "SELECT AVG(t.total) AS avg FROM (SELECT SUM(`Traffic GB`) as total FROM traffic_data GROUP BY DATE(`Date`)) t"
  );
  const avgGs = avgRows[0].avg || 0;

  // TOTAL SITE
  const [siteRows]: any = await connection.execute(
    "SELECT COUNT(DISTINCT `Site ID`) AS total FROM traffic_data"
  );
  const totalSite = siteRows[0].total || 0;

  await connection.end();

  return NextResponse.json({
    todayTotal,        // Total trafik hari ini atau terakhir
    todayTotalLabel: label, // Label ("Hari Ini" atau "Terakhir (2024-08-02)")
    totalGb,
    avgGs,
    totalSite,
  });
}
