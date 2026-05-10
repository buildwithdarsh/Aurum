'use client';

import { m } from 'framer-motion';

interface SendMoneyIllustrationProps {
  className?: string;
}

// Arc keyframes for coin traveling from left device to right device
const coinTravel = {
  cx: [50, 80, 120, 160, 190],
  cy: [60, 30, 20, 30, 60],
};

export function SendMoneyIllustration({ className }: SendMoneyIllustrationProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 240 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="send-coin-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Left device */}
        <rect
          x="15"
          y="35"
          width="36"
          height="60"
          rx="6"
          fill="#3f3f46"
          stroke="#52525b"
          strokeWidth="1"
        />
        {/* Left device screen */}
        <rect x="19" y="45" width="28" height="38" rx="2" fill="#27272a" />
        {/* Left device notch */}
        <rect x="27" y="38" width="12" height="3" rx="1.5" fill="#52525b" />

        {/* Right device */}
        <rect
          x="189"
          y="35"
          width="36"
          height="60"
          rx="6"
          fill="#3f3f46"
          stroke="#52525b"
          strokeWidth="1"
        />
        {/* Right device screen */}
        <rect x="193" y="45" width="28" height="38" rx="2" fill="#27272a" />
        {/* Right device notch */}
        <rect x="201" y="38" width="12" height="3" rx="1.5" fill="#52525b" />

        {/* Curved dashed path connecting them */}
        <path
          d="M 50 60 Q 120 0 190 60"
          stroke="#52525b"
          strokeWidth="1"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Sparkle trailing dots */}
        {[0, 1, 2].map((i) => (
          <m.circle
            key={`sparkle-${i}`}
            r={2 - i * 0.5}
            fill="#fbbf24"
            initial={{ cx: 50, cy: 60, opacity: 0 }}
            animate={{
              cx: coinTravel.cx,
              cy: coinTravel.cy,
              opacity: [0, 0.6, 0.4, 0.2, 0],
            }}
            transition={{
              duration: 1.8,
              delay: 0.5 + i * 0.12,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Traveling coin */}
        <m.circle
          r="8"
          fill="url(#send-coin-grad)"
          stroke="#b45309"
          strokeWidth="1"
          initial={{ cx: 50, cy: 60, opacity: 0 }}
          animate={{
            cx: coinTravel.cx,
            cy: coinTravel.cy,
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 1.8,
            delay: 0.3,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'easeInOut',
          }}
        />
        {/* Dollar sign on coin */}
        <m.text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fontWeight="bold"
          fill="#92400e"
          initial={{ x: 50, y: 60, opacity: 0 }}
          animate={{
            x: coinTravel.cx,
            y: coinTravel.cy,
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 1.8,
            delay: 0.3,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: 'easeInOut',
          }}
        >
          $
        </m.text>
      </svg>
    </div>
  );
}
