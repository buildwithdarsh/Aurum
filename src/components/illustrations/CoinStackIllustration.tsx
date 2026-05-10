'use client';

import { m } from 'framer-motion';

interface CoinStackIllustrationProps {
  className?: string;
}

const coins = [
  { cx: 80, cy: 160, rx: 40, ry: 12 },
  { cx: 80, cy: 140, rx: 40, ry: 12 },
  { cx: 80, cy: 120, rx: 40, ry: 12 },
  { cx: 80, cy: 100, rx: 40, ry: 12 },
  { cx: 80, cy: 80, rx: 40, ry: 12 },
];

export function CoinStackIllustration({ className }: CoinStackIllustrationProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 160 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="coin-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="coin-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="shimmer-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <clipPath id="top-coin-clip">
            <ellipse cx="80" cy="80" rx="40" ry="12" />
          </clipPath>
        </defs>

        {coins.map((coin, i) => (
          <m.g
            key={i}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
          >
            {/* Coin side/thickness */}
            <rect
              x={coin.cx - coin.rx}
              y={coin.cy}
              width={coin.rx * 2}
              height={8}
              rx={2}
              fill="url(#coin-side)"
            />
            {/* Coin face */}
            <ellipse
              cx={coin.cx}
              cy={coin.cy}
              rx={coin.rx}
              ry={coin.ry}
              fill="url(#coin-grad)"
              stroke="#b45309"
              strokeWidth="1"
            />
            {/* Inner ring on coin */}
            <ellipse
              cx={coin.cx}
              cy={coin.cy}
              rx={coin.rx - 8}
              ry={coin.ry - 3}
              fill="none"
              stroke="#b45309"
              strokeWidth="0.5"
              opacity={0.5}
            />
          </m.g>
        ))}

        {/* Shimmer on top coin */}
        <m.rect
          x={0}
          y={68}
          width={30}
          height={24}
          fill="url(#shimmer-grad)"
          clipPath="url(#top-coin-clip)"
          initial={{ x: -30 }}
          animate={{ x: 160 }}
          transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}
