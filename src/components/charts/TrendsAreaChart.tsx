'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/format';

interface TrendsAreaChartProps {
  data: Array<{ month: string; income: number; expenditure: number }>;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const income = payload.find((p) => p.dataKey === 'income')?.value ?? 0;
  const expenditure = payload.find((p) => p.dataKey === 'expenditure')?.value ?? 0;
  const net = income - expenditure;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-zinc-900 px-3 py-2 text-sm text-white">
      <p className="font-medium text-white">{label}</p>
      <p className="text-emerald-400">Income: {formatCurrency(income)}</p>
      <p className="text-rose-400">Expenditure: {formatCurrency(expenditure)}</p>
      <p className="text-zinc-300">Net: {formatCurrency(net)}</p>
    </div>
  );
}

export default function TrendsAreaChart({ data }: TrendsAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#34d399" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="expenditureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#fb7185" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v: number) => formatCurrency(v)} tick={{ fontSize: 12, fill: '#71717a' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          fill="url(#incomeGradient)"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="expenditure"
          stroke="#f43f5e"
          fill="url(#expenditureGradient)"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
