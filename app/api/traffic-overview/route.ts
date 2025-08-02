import { NextResponse } from "next/server"

export async function GET() {
  // Bisa fetch dari DB, PowerBI, dsb. Ini contoh statik
  return NextResponse.json({
    label: "Traffic",
    series: [
      { month: "Jan", value: 130 },
      { month: "Feb", value: 142 },
      { month: "Mar", value: 180 },
      { month: "Apr", value: 170 },
      { month: "May", value: 200 },
      { month: "Jun", value: 210 },
      { month: "Jul", value: 185 },
      { month: "Aug", value: 220 },
      { month: "Sep", value: 230 },
      { month: "Oct", value: 250 },
      { month: "Nov", value: 240 },
      { month: "Dec", value: 260 }
    ]
  })
}
