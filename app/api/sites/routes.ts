import { NextRequest } from "next/server";
import mysql2 from "mysql2/promise";

export async function GET(request: NextRequest) {
  const db = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
  });

  // Ambil kombinasi unik nama + site id
  const [rows] = await db.query(
    "SELECT DISTINCT enodeb_name, site_ide FROM ioh_traffic"
  );
  await db.end();

  // Gabung jadi satu string untuk dropdown
  const options = (rows as any[]).map(
    (r) => ({
      value: `${r.enodeb_name}|${r.site_ide}`,
      label: `${r.enodeb_name} — ${r.site_ide}`
    })
  );
  // Tambahkan "All" di atas
  options.unshift({ value: "all", label: "All Site" });

  return Response.json({ options });
}
