'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatETB, formatETBCompact } from '@/lib/money';

// Gets the 14-day summary from the server component; the orders themselves stay on the server.
export default function RevenueChart({ days }) {
  return (
    // ResponsiveContainer takes its parent's size. The parent's height is fixed in CSS, so the
    // space is already there in the server HTML and the page doesn't jump when the chart draws.
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={days} margin={{ top: 10, right: 6, bottom: 0, left: 6 }}>
          <CartesianGrid vertical={false} stroke="var(--border-color)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickLine={false} />
          <YAxis
            tickFormatter={formatETBCompact}
            width={76}
            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip formatter={(value) => [formatETB(value), 'Revenue']} cursor={{ fill: 'var(--accent-gold-glow)' }} />
          <Bar dataKey="revenue" name="Revenue" fill="var(--accent-gold)" radius={[6, 6, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
