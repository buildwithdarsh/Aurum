'use client';

import Link from 'next/link';
import { m, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import {
  Shield,
  Zap,
  BarChart3,
  CreditCard,
  ArrowRight,
  Smartphone,
  Lock,
  TrendingUp,
  Globe,
} from 'lucide-react';
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  staggerContainerSlow,
  viewportConfig,
  EASE_EXPO,
} from '@/lib/animations';

const features = [
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Send money via NEFT, RTGS, IMPS, and UPI with real-time confirmation.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'AI-powered spending insights, budget tracking, and anomaly detection.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'AES-256 encryption, biometric login, and real-time fraud alerts.',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: CreditCard,
    title: 'Card Controls',
    description: 'Block, unblock, and manage card limits instantly from your phone.',
    color: 'from-purple-400 to-pink-500',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<300ms', label: 'API Response' },
  { value: 'AES-256', label: 'Encryption' },
  { value: '10K+', label: 'Concurrent Users' },
];

const capabilities = [
  { icon: Smartphone, label: 'UPI & QR Payments' },
  { icon: Lock, label: 'Fixed Deposits' },
  { icon: TrendingUp, label: 'Budget Tracking' },
  { icon: Globe, label: 'International Transfers' },
];

export default function HomeContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-zinc-950 text-white overflow-hidden">
      {/* ─── Navbar ────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            <span className="text-xl font-bold tracking-wide">
              <span className="text-amber-400">AU</span>RUM
            </span>
          </m.div>
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="flex items-center gap-3"
          >
            <Link
              href="/auth/login"
              className="px-5 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 bg-amber-400 text-zinc-950 font-semibold rounded-xl text-sm hover:bg-amber-300 transition-colors"
            >
              Get Started
            </Link>
          </m.div>
        </div>
      </nav>

      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <m.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl text-center">
          {/* Tagline pill */}
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Next-Generation Digital Banking
          </m.div>

          {/* Main heading */}
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
          >
            Digital Banking,{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Refined
              </span>
              {/* Underline glow */}
              <m.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE_EXPO }}
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0 origin-left"
              />
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_EXPO }}
            className="text-lg sm:text-xl text-zinc-400 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            A frictionless financial experience for modern users. Real-time transfers,
            intelligent insights, and bank-grade security — unified in one elegant platform.
          </m.p>

          {/* CTAs */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE_EXPO }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link
              href="/auth/signup"
              className="group flex items-center gap-2 px-8 py-3.5 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-all text-sm hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
            >
              Open Free Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3.5 border border-zinc-700 text-zinc-300 font-semibold rounded-xl hover:border-zinc-500 hover:text-white transition-colors text-sm"
            >
              Existing User? Sign In
            </Link>
          </m.div>

          {/* Floating stats */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE_EXPO }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-16 pt-8 border-t border-zinc-800/50"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg sm:text-xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </m.div>
        </m.div>

        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-zinc-700 flex items-start justify-center p-1"
          >
            <m.div className="w-1 h-1.5 rounded-full bg-zinc-500" />
          </m.div>
        </m.div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <m.div
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={staggerContainerSlow}
            className="text-center mb-16"
          >
            <m.p variants={fadeUp} className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">
              Features
            </m.p>
            <m.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold">
              Everything you need.{' '}
              <span className="text-zinc-500">Nothing you don&apos;t.</span>
            </m.h2>
          </m.div>

          <m.div
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map((feature) => (
              <m.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ─── Capabilities Grid ─────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <m.div
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={staggerContainerSlow}
            className="text-center mb-12"
          >
            <m.p variants={fadeUp} className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-3">
              Capabilities
            </m.p>
            <m.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold">
              Built for the way you bank
            </m.h2>
          </m.div>

          <m.div
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {capabilities.map((cap) => (
              <m.div
                key={cap.label}
                variants={scaleIn}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-800/30 border border-zinc-800/50"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
                  <cap.icon className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-sm text-zinc-300 font-medium text-center">{cap.label}</span>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ─── Card Preview ──────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <m.div
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={staggerContainerSlow}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Card visual */}
            <m.div variants={fadeUp} className="flex justify-center">
              <m.div
                whileHover={{ rotateY: 5, rotateX: -5 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-80 sm:w-96 aspect-[1.586/1] rounded-2xl p-8 flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #1a1a2e 100%)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 80px rgba(251,191,36,0.08)',
                  perspective: '1000px',
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-zinc-500 tracking-widest">DEBIT</p>
                    <p className="text-xs text-amber-400 font-bold tracking-wider mt-0.5">AURUM</p>
                  </div>
                  <m.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
                      <rect x="0" y="0" width="12" height="10" rx="2" fill="#fbbf24" opacity="0.8" />
                      <rect x="4" y="4" width="12" height="10" rx="2" fill="#d97706" opacity="0.6" />
                    </svg>
                  </m.div>
                </div>
                <div>
                  <p className="text-zinc-400 tracking-[0.25em] text-sm font-mono">
                    •••• •••• •••• 4521
                  </p>
                  <div className="flex justify-between items-end mt-3">
                    <div>
                      <p className="text-[9px] text-zinc-600">CARD HOLDER</p>
                      <p className="text-xs text-zinc-300 tracking-wide">YOUR NAME</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-600">VALID THRU</p>
                      <p className="text-xs text-zinc-300">08/29</p>
                    </div>
                    <svg width="36" height="24" viewBox="0 0 36 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" fill="#d97706" opacity="0.7" />
                      <circle cx="24" cy="12" r="10" fill="#fbbf24" opacity="0.5" />
                    </svg>
                  </div>
                </div>
              </m.div>
            </m.div>

            {/* Text */}
            <m.div variants={fadeUp} className="space-y-6">
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Virtual & Physical</p>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Cards that work{' '}
                <span className="text-zinc-500">your way</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Generate virtual cards instantly. Control daily limits, toggle international usage
                for travel, and manage contactless payments — all from your dashboard.
              </p>
              <ul className="space-y-3">
                {['Instant virtual card generation', 'Real-time block & unblock', 'Travel-period international toggle', 'Per-card ATM & online limits'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-6">
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={viewportConfig}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to experience{' '}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              modern banking
            </span>
            ?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            Open your free account in minutes. No paperwork, no branch visits.
            Just your phone and your Aadhaar.
          </p>
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-all text-sm hover:shadow-[0_0_40px_rgba(251,191,36,0.3)]"
          >
            Get Started — It&apos;s Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </m.div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wide text-sm">
              <span className="text-amber-400">AU</span>RUM
            </span>
            <span className="text-zinc-600 text-xs">Banking, Refined</span>
          </div>
          <p className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} Aurum Financial Technologies Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
