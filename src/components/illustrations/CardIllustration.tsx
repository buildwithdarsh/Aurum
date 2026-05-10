'use client';

import { m } from 'framer-motion';

interface CardIllustrationProps {
  className?: string;
}

export function CardIllustration({ className }: CardIllustrationProps) {
  const dotGroups = [0, 1, 2, 3];
  const dotsPerGroup = 4;

  return (
    <div className={className}>
      <svg
        viewBox="0 0 240 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="card-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#3f3f46" />
          </linearGradient>
          <linearGradient id="chip-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Card body */}
        <rect
          x="10"
          y="10"
          width="220"
          height="140"
          rx="12"
          fill="url(#card-bg)"
          stroke="#52525b"
          strokeWidth="1"
        />

        {/* Card chip */}
        <rect
          x="30"
          y="45"
          width="30"
          height="22"
          rx="4"
          fill="url(#chip-grad)"
          stroke="#b45309"
          strokeWidth="0.5"
        />
        {/* Chip lines */}
        <line x1="30" y1="52" x2="60" y2="52" stroke="#b45309" strokeWidth="0.5" />
        <line x1="30" y1="60" x2="60" y2="60" stroke="#b45309" strokeWidth="0.5" />
        <line x1="45" y1="45" x2="45" y2="67" stroke="#b45309" strokeWidth="0.5" />

        {/* NFC / Contactless arcs */}
        {[0, 1, 2].map((i) => (
          <m.path
            key={i}
            d={`M ${74 + i * 6} ${62 - i * 6} A ${6 + i * 6} ${6 + i * 6} 0 0 1 ${74 + i * 6} ${48 + i * 6}`}
            stroke="#a1a1aa"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            className="animate-breathe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.4 }}
          />
        ))}

        {/* Magnetic stripe */}
        <rect
          x="10"
          y="30"
          width="220"
          height="8"
          fill="#18181b"
          opacity={0.5}
        />

        {/* Card number dots — 4 groups of 4 */}
        {dotGroups.map((g) =>
          Array.from({ length: dotsPerGroup }).map((_, d) => (
            <circle
              key={`${g}-${d}`}
              cx={40 + g * 48 + d * 10}
              cy={100}
              r="2.5"
              fill="#71717a"
            />
          ))
        )}

        {/* Cardholder line placeholder */}
        <rect x="30" y="120" width="80" height="6" rx="3" fill="#52525b" />

        {/* Expiry placeholder */}
        <rect x="170" y="120" width="40" height="6" rx="3" fill="#52525b" />
      </svg>
    </div>
  );
}
