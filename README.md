> This project is made with the help of Claude (1M context).

# Aurum

Modern digital banking experience with motion-rich UI, AI-powered analytics, and bank-grade security.

## Overview

Aurum is a full-stack digital banking application that delivers an elegant financial experience with instant money transfers, intelligent spending insights, and frictionless card management. Built for users who expect modern design, real-time data, and advanced fraud protection from their banking app.

## Features

- **Instant transfers** — NEFT, RTGS, IMPS, UPI with real-time confirmation
- **Smart analytics** — AI-powered spending insights, budget tracking, anomaly detection
- **Bank-grade security** — AES-256 encryption, biometric login, fraud alerts
- **Card controls** — Block/unblock cards and manage limits instantly
- **Glass design system** — Custom GlassCard, StatCard, ProgressBar, Badge components
- **Animated UI** — Framer Motion glassmorphism effects, animated counters, progress rings
- **Responsive** — Sidebar + TopBar navigation with MobileNav for small screens
- **Toast notifications** — Real-time feedback throughout the experience

## Tech Stack

- **Framework:** Next.js 16.2 (App Router), React 19.2, TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion 12
- **Charts:** Recharts 3
- **State:** Zustand
- **Icons:** Lucide React
- **SDK:** @buildwithdarsh/sdk
- **Deploy:** Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local   # populate values
npm run dev
```

The app runs on `http://localhost:3000`.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # 15+ UI components (Sidebar, TopBar, HomeContent, etc.)
└── lib/animations/   # Framer Motion variants
```
