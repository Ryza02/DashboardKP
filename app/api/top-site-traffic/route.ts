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

  const [rows] = await db.query(
    `
    SELECT enodeb_name, SUM(ioh_4g_total_traffic_gb) as total_gb
    FROM ioh_traffic
    WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
    GROUP BY enodeb_name
    ORDER BY total_gb DESC
    LIMIT 5
    `
  );
  await db.end();

  return Response.json(rows);
}
