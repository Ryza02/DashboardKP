import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 20;
  const offset = (page - 1) * perPage;
  const sector = searchParams.get('sector') || '';
  const site_id = searchParams.get('site_id') || '';
  const range = searchParams.get('range') || 'all';

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_ioh',
    password: '',
  });

  // WHERE builder
  let where = '1=1';
  const params: any[] = [];
  if (sector) {
    where += ' AND Sector = ?';
    params.push(sector);
  }
  if (site_id) {
    where += ' AND `Site ID` = ?';
    params.push(site_id);
  }

  // Count
  const [countRows]: any = await connection.execute(
    `SELECT COUNT(*) as total FROM traffic_data WHERE ${where}`,
    params
  );
  const total = countRows[0].total;

  // Data
  const [rows]: any = await connection.execute(
    `SELECT * FROM traffic_data WHERE ${where} LIMIT ? OFFSET ?`,
    [...params, perPage, offset]
  );

  // Untuk dropdown
  const [sectorRows]: any = await connection.execute(
    'SELECT DISTINCT Sector FROM traffic_data'
  );
  // **Kunci: SELECT sector di siteRows!**
  const [siteRows]: any = await connection.execute(
    'SELECT DISTINCT `Site ID`, `eNodeB Name`, Sector FROM traffic_data'
  );

  await connection.end();

  return NextResponse.json({
    rows,
    total,
    sectors: sectorRows.map((s: any) => s.Sector),
    sites: siteRows.map((s: any) => ({
      site_id: s['Site ID'],
      enodeb_name: s['eNodeB Name'],
      sector: s['Sector'], // penting!
    })),
  });
}
