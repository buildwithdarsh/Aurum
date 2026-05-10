'use client';

import { m } from 'framer-motion';

interface ChartGrowthIllustrationProps {
  className?: string;
}

const dataPoints = [
  { x: 40, y: 120 },
  { x: 80, y: 100 },
  { x: 120, y: 80 },
  { x: 160, y: 40 },
];

const linePath = `M ${dataPoints.map((p) => `${p.x} ${p.y}`).join(' L ')}`;

export function ChartGrowthIllustration({ className }: ChartGrowthIllustrationProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Y axis */}
        <line
          x1="24"
          y1="16"
          x2="24"
          y2="140"
          stroke="#d4d4d8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* X axis */}
        <line
          x1="24"
          y1="140"
          x2="190"
          y2="140"
          stroke="#d4d4d8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Grid lines */}
        {[100, 60, 20].map((y) => (
          <line
            key={y}
            x1="24"
            y1={y + 20}
            x2="190"
            y2={y + 20}
            stroke="#e4e4e7"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Growth line — draws itself */}
        <m.path
          d={linePath}
          stroke="#fbbf24"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Data point dots */}
        {dataPoints.map((p, i) => (
          <m.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="#f59e0b"
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5 + i * 0.15, type: 'spring', stiffness: 300 }}
          />
        ))}

        {/* Upward arrow at end */}
        <m.g
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.4 }}
        >
          <line
            x1="160"
            y1="40"
            x2="160"
            y2="22"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <polyline
            points="153,28 160,22 167,28"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </m.g>
      </svg>
    </div>
  );
}
