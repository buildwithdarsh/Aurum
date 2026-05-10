'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { formatCurrency } from '@/lib/format';

interface CashFlowBarProps {
  income: number;
  expenditure: number;
}

export default function CashFlowBar({ income, expenditure }: CashFlowBarProps) {
  const data = [
    { name: 'Income', value: income, fill: '#10b981' },
    { name: 'Expense', value: expenditure, fill: '#f43f5e' },
  ];

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} layout="vertical" margin={{ left: 60, right: 80 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 13, fill: '#71717a' }}
        />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          isAnimationActive={true}
          animationDuration={1000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v) => formatCurrency(Number(v))}
            style={{ fontSize: 12, fill: '#a1a1aa' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
