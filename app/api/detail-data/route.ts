// /app/api/detail-data/route.ts
import type { NextRequest } from "next/server";
import mysql2 from "mysql2/promise";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const perPage = Number(searchParams.get("perPage") || 20);

  const q = searchParams.get("q") || "";
  const dateType = searchParams.get("dateType") || "all";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  let where = "WHERE 1";
  const params: any[] = [];

  if (q) {
    where += " AND (enodeb_name LIKE ? OR site_ide LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  if (dateType === "week") {
    where += " AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
  } else if (dateType === "month") {
    where += " AND YEAR(date) = YEAR(CURDATE()) AND MONTH(date) = MONTH(CURDATE())";
  } else if (dateType === "year") {
    where += " AND YEAR(date) = YEAR(CURDATE())";
  } else if (dateType === "custom" && dateFrom && dateTo) {
    where += " AND date BETWEEN ? AND ?";
    params.push(dateFrom, dateTo);
  }

  const db = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
  });

  // Data untuk dropdown filter
  const [sites] = await db.query(
    "SELECT DISTINCT enodeb_name, site_ide FROM ioh_traffic ORDER BY enodeb_name ASC"
  );

  // Data hasil filter + pagination
  const [rows] = await db.query(
    `SELECT * FROM ioh_traffic ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, perPage, (page - 1) * perPage]
  );

  // Total data hasil filter
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) as total FROM ioh_traffic ${where}`,
    params
  );

  await db.end();
  return Response.json({ rows, total, sites });
}
