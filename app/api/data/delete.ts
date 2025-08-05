import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_ioh",
  });
  await db.query("TRUNCATE TABLE traffic_data");
  await db.end();
  res.status(200).json({ success: true });
}
