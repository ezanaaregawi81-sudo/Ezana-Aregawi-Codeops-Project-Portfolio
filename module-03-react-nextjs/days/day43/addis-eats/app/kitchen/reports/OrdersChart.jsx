'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function OrdersChart({ days }) {
  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={days} margin={{ top: 10, right: 18, bottom: 0, left: 6 }}>
          <CartesianGrid vertical={false} stroke="var(--border-color)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickLine={false} />
          {/* Orders are whole things, so the axis never shows 2.5. */}
          <YAxis allowDecimals={false} width={36} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => [`${value} ${value === 1 ? 'order' : 'orders'}`, 'Orders']} />
          <Line type="linear" dataKey="orders" name="Orders" stroke="var(--accent-green)" strokeWidth={2.5} dot={{ r: 3.5, fill: 'var(--accent-green)' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
