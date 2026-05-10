'use client';

import { m } from 'framer-motion';
import { fadeUp } from '@/lib/animations';
import { AnimatedCounter } from './AnimatedCounter';
import { cn } from '@/lib/cn';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  format?: (n: number) => string;
  color: 'amber' | 'emerald' | 'blue' | 'red' | 'purple';
  trend?: { value: number; positive: boolean };
  className?: string;
}

const gradientMap: Record<string, string> = {
  amber: 'from-amber-400/20 to-amber-500/10 text-amber-400',
  emerald: 'from-emerald-400/20 to-emerald-500/10 text-emerald-400',
  blue: 'from-blue-400/20 to-blue-500/10 text-blue-400',
  red: 'from-red-400/20 to-red-500/10 text-red-400',
  purple: 'from-purple-400/20 to-purple-500/10 text-purple-400',
};

export function StatCard({
  icon,
  label,
  value,
  format,
  color,
  trend,
  className,
}: StatCardProps) {
  return (
    <m.div
      variants={fadeUp}
      className={cn(
        'rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5',
        className,
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', gradientMap[color])}>
        {icon}
      </div>
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <AnimatedCounter value={value} {...(format ? { format } : {})} className="text-xl font-bold text-white" />
        {trend && (
          <span className={cn('text-xs font-semibold', trend.positive ? 'text-emerald-400' : 'text-red-400')}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </m.div>
  );
}
