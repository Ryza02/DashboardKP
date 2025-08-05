import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sector, cellname, sa, date, range } = req.query;
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_ioh",
  });

  let q = "SELECT * FROM traffic_data WHERE 1=1";
  const params: any[] = [];
  if (sector)   { q += " AND `Sector`=?"; params.push(sector); }
  if (cellname) { q += " AND `Cell Name`=?"; params.push(cellname); }
  if (sa)       { q += " AND `SA`=?"; params.push(sa); }
  if (date)     { q += " AND `Date`=?"; params.push(date); }

  // FILTER RANGE WAKTU
  if (range === "weekly") {
    q += " AND `Date` >= CURDATE() - INTERVAL 7 DAY";
  } else if (range === "monthly") {
    q += " AND `Date` >= CURDATE() - INTERVAL 1 MONTH";
  } else if (range === "yearly") {
    q += " AND `Date` >= CURDATE() - INTERVAL 1 YEAR";
  }
  // (range "all" = tanpa filter waktu)

  const [rows] = await db.execute(q, params);
  await db.end();
  res.status(200).json(rows);
}
