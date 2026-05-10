'use client';

import { m } from 'framer-motion';
import { EASE_EXPO } from '@/lib/animations';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_EXPO }}
          className="relative z-10 text-center px-12"
        >
          {/* Animated vault SVG */}
          <m.svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            className="mx-auto mb-8"
          >
            {/* Vault door */}
            <m.circle
              cx="80"
              cy="80"
              r="65"
              stroke="#3f3f46"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            <m.circle
              cx="80"
              cy="80"
              r="50"
              stroke="#52525b"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
            />
            {/* Handle */}
            <m.g
              initial={{ rotate: 0 }}
              animate={{ rotate: 90 }}
              transition={{ duration: 1, delay: 0.8, ease: EASE_EXPO }}
              style={{ originX: '80px', originY: '80px' }}
            >
              <line x1="80" y1="50" x2="80" y2="110" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
              <line x1="50" y1="80" x2="110" y2="80" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            </m.g>
            {/* Gold glow */}
            <m.circle
              cx="80"
              cy="80"
              r="30"
              fill="url(#vault-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            />
            <defs>
              <radialGradient id="vault-glow">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
          </m.svg>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_EXPO }}
            className="text-2xl font-bold text-white mb-3"
          >
            Your finances,{' '}
            <span className="text-amber-400">secured</span>
          </m.p>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE_EXPO }}
            className="text-zinc-500 max-w-xs mx-auto"
          >
            Bank-grade AES-256 encryption with biometric authentication and real-time fraud detection.
          </m.p>
        </m.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:py-0">
        <div className="w-full max-w-md">
          {/* Logo — visible on mobile, hidden on desktop (shown in left panel) */}
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
            className="text-center mb-8"
          >
            <p className="text-3xl font-bold tracking-wide text-white">
              <span className="text-amber-400 animate-breathe inline-block">AU</span>RUM
            </p>
            <p className="text-[10px] tracking-[0.3em] text-zinc-500 mt-1">
              BANKING, REFINED
            </p>
          </m.div>
          {children}
        </div>
      </div>
    </div>
  );
}
