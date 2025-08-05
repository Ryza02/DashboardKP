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

  // Ambil bulan & tahun terakhir yang ada di tabel
  const [maxDateRows] = await db.query(
    "SELECT MONTH(MAX(`Date`)) AS last_month, YEAR(MAX(`Date`)) AS last_year FROM traffic_data"
  ) as any[];

  const lastDate = Array.isArray(maxDateRows) && maxDateRows.length > 0 ? maxDateRows[0] : null;
  const last_month = lastDate?.last_month ?? (new Date().getMonth() + 1);
  const last_year = lastDate?.last_year ?? new Date().getFullYear();

  // Query lowest availability
  const [rows] = await db.query(
    `
    SELECT \`eNodeB Name\` as enodeb_name, AVG(\`IOH_4G Cell Availability (%)\`) as avg_avail
    FROM traffic_data
    WHERE MONTH(\`Date\`) = ? AND YEAR(\`Date\`) = ?
    GROUP BY \`eNodeB Name\`
    ORDER BY avg_avail ASC
    LIMIT 5
    `,
    [last_month, last_year]
  ) as any[];

  await db.end();

  return Response.json(rows);
}
