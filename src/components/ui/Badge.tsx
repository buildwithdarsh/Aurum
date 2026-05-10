'use client';

import { m } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import { cn } from '@/lib/cn';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gold';
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

const variantStyles = {
  success: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  warning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  error: 'bg-red-400/10 text-red-400 border-red-400/20',
  info: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  gold: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
};

export function Badge({ variant = 'info', children, className, animated = false }: BadgeProps) {
  const classes = cn(
    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
    variantStyles[variant],
    className,
  );

  if (animated) {
    return (
      <m.span variants={scaleIn} initial="hidden" animate="show" className={classes}>
        {children}
      </m.span>
    );
  }

  return <span className={classes}>{children}</span>;
}
