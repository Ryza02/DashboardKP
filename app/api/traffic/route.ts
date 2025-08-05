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

  const url = new URL(request.url!);
  const selected = url.searchParams.getAll("sector[]").slice(0, 3);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const [sectorRows] = await db.query("SELECT DISTINCT `Sector` FROM traffic_data ORDER BY `Sector` ASC");
  const sectors = (sectorRows as any[]).map((row) => ({
    label: `Sektor ${row.Sector}`,
    value: row.Sector,
  }));

  const selectedSectors =
    selected.length > 0
      ? selected
      : sectors.slice(0, 3).map((s) => s.value);

  // Default tanggal: 30 hari terakhir
  let start = startDate;
  let end = endDate;
  if (!start || !end) {
    const now = new Date();
    end = now.toISOString().slice(0, 10); // yyyy-mm-dd hari ini
    const lastMonth = new Date();
    lastMonth.setDate(now.getDate() - 30);
    start = lastMonth.toISOString().slice(0, 10); // yyyy-mm-dd 30 hari lalu
  }

  const [rows] = await db.query(
    `
    SELECT \`Date\`, \`Sector\`, SUM(\`Traffic GB\`) as total_gb
    FROM traffic_data
    WHERE \`Sector\` IN (${selectedSectors.map(() => "?").join(",")})
      AND \`Date\` >= ?
      AND \`Date\` <= ?
    GROUP BY \`Date\`, \`Sector\`
    ORDER BY \`Date\` ASC
    `,
    [...selectedSectors, start, end]
  );

 // Hitung total traffic per sektor untuk menentukan data primer
  const trafficTotals: { [key: string]: number } = {};
  (rows as any[]).forEach(row => {
    if (!trafficTotals[row.Sector]) {
      trafficTotals[row.Sector] = 0;
    }
    trafficTotals[row.Sector] += Number(row.total_gb);
  });

  // Tentukan sektor dengan traffic terbesar sebagai primary
  let primaryDataKey: string | null = null;
  let maxTraffic = -1;
  for (const sector in trafficTotals) {
    if (trafficTotals[sector] > maxTraffic) {
      maxTraffic = trafficTotals[sector];
      primaryDataKey = sector;
    }
  }
  if (!primaryDataKey && selectedSectors.length > 0) {
    primaryDataKey = selectedSectors[0];
  }

  const dates: string[] = Array.from(
    new Set((rows as any[]).map((d) =>
      typeof d.Date === "string"
        ? d.Date.slice(0, 10)
        : (d.Date as Date).toISOString().slice(0, 10)
    ))
  ).sort();

  const chartData = dates.map((date) => {
    const obj: any = { date };
    selectedSectors.forEach((sec) => {
      const found = (rows as any[]).find((r) => {
        const rowDate =
          typeof r.Date === "string"
            ? r.Date.slice(0, 10)
            : (r.Date as Date).toISOString().slice(0, 10);
        return rowDate === date && r.Sector === sec;
      });
      obj[sec] = found ? Number(found.total_gb) : 0;
    });
    return obj;
  });

  await db.end();

  return Response.json({
    data: chartData,
    sectors,
    primaryDataKey,
  });
}