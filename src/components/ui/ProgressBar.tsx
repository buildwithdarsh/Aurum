'use client';

import { m } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  variant?: 'gold' | 'success' | 'warning' | 'danger';
  className?: string;
  height?: string;
}

const colorMap = {
  gold: 'bg-amber-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export function ProgressBar({
  value,
  variant = 'gold',
  className,
  height = 'h-1.5',
}: ProgressBarProps) {
  return (
    <div className={cn('w-full rounded-full bg-white/[0.06] overflow-hidden', height, className)}>
      <m.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn('h-full rounded-full', colorMap[variant])}
      />
    </div>
  );
}
