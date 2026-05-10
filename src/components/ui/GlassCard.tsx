'use client';

import { m } from 'framer-motion';
import { cn } from '@/lib/cn';
import { cardHover } from '@/lib/animations';

interface GlassCardProps {
  variant?: 'default' | 'dark' | 'gradient';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-white/[0.04] border border-white/[0.06]',
  dark: 'bg-white/[0.02] border border-white/[0.04]',
  gradient: 'bg-gradient-to-br from-amber-400/[0.08] to-amber-600/[0.03] border border-amber-400/10',
};

export function GlassCard({
  variant = 'default',
  hover = false,
  className,
  children,
  onClick,
}: GlassCardProps) {
  if (hover) {
    return (
      <m.div
        whileHover={cardHover}
        onClick={onClick}
        className={cn('rounded-2xl', variantStyles[variant], className)}
      >
        {children}
      </m.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn('rounded-2xl', variantStyles[variant], className)}
    >
      {children}
    </div>
  );
}
