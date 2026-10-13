'use client';

import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// A client leaf: 14 rows of { key, label, orders } from the server page.
export default function OrdersOverTimeChart({ days }) {
  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={days} margin={{ top: 28, right: 20, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border-color)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickLine={false} interval="preserveStartEnd" />
          {/* From zero, whole orders only. */}
          <YAxis domain={[0, 'auto']} allowDecimals={false} width={36} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
          <Tooltip formatter={(value) => [`${value} ${value === 1 ? 'order' : 'orders'}`, 'Orders']} />
          {/* A marker and a printed count on each point: readable without colour. */}
          <Line type="linear" dataKey="orders" name="Orders" stroke="var(--accent-gold)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--accent-gold)' }}>
            <LabelList dataKey="orders" position="top" offset={10} style={{ fontSize: 12, fill: 'var(--text-primary)' }} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
