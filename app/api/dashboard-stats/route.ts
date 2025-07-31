import type { NextRequest } from "next/server";
import mysql2 from "mysql2/promise";

export async function GET(request: NextRequest) {
  const db = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
  });

  // Total Data (COUNT semua row)
  const [totalDataRows] = await db.query(
    `SELECT COUNT(*) as total FROM ioh_traffic`
  );
  // Total GB (SUM traffic semua baris)
  const [totalGbRows] = await db.query(
    `SELECT SUM(ioh_4g_total_traffic_gb) as total FROM ioh_traffic`
  );
  // Rata-rata GS per hari (AVG rrc user semua baris)
  const [avgGsRows] = await db.query(
    `SELECT AVG(ioh_rrc_connected_user) as avg_gs FROM ioh_traffic`
  );
  // Total Site/Daerah (COUNT DISTINCT enodeb_name)
  const [totalSiteRows] = await db.query(
    `SELECT COUNT(DISTINCT enodeb_name) as total FROM ioh_traffic`
  );

  await db.end();

  return Response.json({
    totalData: (totalDataRows as any)[0]?.total || 0,
    totalGb: (totalGbRows as any)[0]?.total || 0,
    avgGs: (avgGsRows as any)[0]?.avg_gs || 0,
    totalSite: (totalSiteRows as any)[0]?.total || 0,
  });
}
