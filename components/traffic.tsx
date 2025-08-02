"use client"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 2400 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
]

export default function Traffic() {
  return (
    <div>
      <h2 className="font-bold mb-2 text-lg">Traffic</h2>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#7f5af0" strokeWidth={3} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
