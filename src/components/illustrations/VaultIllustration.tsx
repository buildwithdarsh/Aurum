'use client';

import { m } from 'framer-motion';

interface VaultIllustrationProps {
  className?: string;
}

export function VaultIllustration({ className }: VaultIllustrationProps) {
  return (
    <div className={className}>
      <div className="animate-float">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="vault-gold-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Vault door outline */}
          <circle
            cx="100"
            cy="100"
            r="75"
            stroke="#3f3f46"
            strokeWidth="6"
            fill="#27272a"
          />
          <circle
            cx="100"
            cy="100"
            r="65"
            stroke="#3f3f46"
            strokeWidth="2"
            fill="none"
          />

          {/* Inner vault crack / opening */}
          <m.rect
            x="70"
            y="60"
            width="60"
            height="80"
            rx="4"
            fill="url(#vault-gold-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          {/* Vault handle / wheel */}
          <m.g
            initial={{ rotate: 0 }}
            animate={{ rotate: 90 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 100px' }}
          >
            {/* Wheel spokes */}
            <line x1="100" y1="72" x2="100" y2="128" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="100" x2="128" y2="100" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="80" x2="120" y2="120" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
            <line x1="120" y1="80" x2="80" y2="120" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
            {/* Center hub */}
            <circle cx="100" cy="100" r="8" fill="#52525b" stroke="#a1a1aa" strokeWidth="2" />
          </m.g>

          {/* Locking bolts */}
          <circle cx="40" cy="80" r="4" fill="#52525b" />
          <circle cx="40" cy="120" r="4" fill="#52525b" />
          <circle cx="160" cy="80" r="4" fill="#52525b" />
          <circle cx="160" cy="120" r="4" fill="#52525b" />

          {/* Coins peeking from inside */}
          {[0, 1, 2].map((i) => (
            <m.g
              key={i}
              initial={{ y: 10, scale: 0, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.4, type: 'spring' }}
            >
              <ellipse
                cx={88 + i * 12}
                cy={130}
                rx="8"
                ry="5"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="1"
              />
            </m.g>
          ))}
        </svg>
      </div>
    </div>
  );
}
