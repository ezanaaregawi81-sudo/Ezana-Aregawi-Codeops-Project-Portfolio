'use client';

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { etb } from '@/lib/format';

const short = (value) => etb(value, { compact: true });

// A client leaf: it gets 6 rows of { area, revenue, orders } from the server page and nothing else.
export default function NeighbourhoodChart({ rows }) {
  return (
    // ResponsiveContainer fills its parent, so the parent's height is fixed in CSS: the space is
    // reserved in the server HTML, and the page doesn't jump when the chart draws.
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 28, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid vertical={false} stroke="var(--border-color)" />
          <XAxis dataKey="area" tick={{ fontSize: 13, fill: 'var(--text-secondary)' }} tickLine={false} />
          {/* domain [0, …]: a bar's length must be measured from zero, or small differences look huge. */}
          <YAxis domain={[0, 'auto']} tickFormatter={short} width={78} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
          <Tooltip formatter={(value) => [etb(value), 'Revenue']} cursor={{ fill: 'rgba(47, 82, 51, 0.08)' }} />
          <Bar dataKey="revenue" name="Revenue" fill="var(--accent-green)" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {/* The value is written on every bar, so the chart reads the same without colour. */}
            <LabelList dataKey="revenue" position="top" formatter={short} style={{ fontSize: 12, fill: 'var(--text-primary)' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
