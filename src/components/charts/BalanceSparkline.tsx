'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface BalanceSparklineProps {
  data: number[];
  positive?: boolean;
}

export default function BalanceSparkline({ data, positive = true }: BalanceSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));
  const stroke = positive ? '#10b981' : '#f43f5e';
  const gradientId = positive ? 'sparklineGreen' : 'sparklineRed';
  const gradientColor = positive ? '#34d399' : '#fb7185';

  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={gradientColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={stroke}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
