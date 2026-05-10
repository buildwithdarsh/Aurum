'use client';

import { m } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  className?: string;
}

export function Toggle({ enabled, onChange, className }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200',
        enabled ? 'bg-amber-400' : 'bg-zinc-300',
        className,
      )}
    >
      <m.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md',
          enabled ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  );
}
