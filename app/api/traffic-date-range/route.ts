import { NextRequest } from "next/server";
import mysql2 from "mysql2/promise";

export async function GET(req: NextRequest) {
  const db = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
  });

  // Ambil tanggal paling awal & akhir dari database
  const [rows] = await db.query(`
    SELECT 
      MIN(\`Date\`) as earliest, 
      MAX(\`Date\`) as latest
    FROM traffic_data
  `) as any[];

  await db.end();

  const earliestDate = rows[0]?.earliest ? new Date(rows[0].earliest) : null;
  const latestDate   = rows[0]?.latest   ? new Date(rows[0].latest)   : null;

  return Response.json({
    earliest: earliestDate ? earliestDate.toISOString().slice(0, 10) : "",
    latest: latestDate ? latestDate.toISOString().slice(0, 10) : ""
  });
}
