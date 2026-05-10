'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/format';

const COLORS = [
  '#fbbf24',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f43f5e',
  '#06b6d4',
  '#f97316',
  '#6b7280',
];

interface SpendingDonutProps {
  data: Array<{ category: string; amount: number; percentage: number }>;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { category: string; amount: number; percentage: number } }>;
}) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;
  const { category, amount, percentage } = entry;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-zinc-900 px-3 py-2 text-sm text-white">
      <p className="font-medium text-white">{category}</p>
      <p className="text-zinc-300">{formatCurrency(amount)}</p>
      <p className="text-zinc-400">{percentage.toFixed(1)}%</p>
    </div>
  );
}

export default function SpendingDonut({ data }: SpendingDonutProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          isAnimationActive={true}
          animationDuration={800}
          animationBegin={200}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] as string} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white text-sm font-semibold"
        >
          {formatCurrency(total)}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
