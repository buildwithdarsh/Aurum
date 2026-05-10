import type { Variants, Transition } from 'framer-motion';

// ─── Easings ────────────────────────────────────────────────────────────────

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SPRING: Transition = { type: 'spring', stiffness: 300, damping: 30 };

// ─── Variants ───────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_EXPO } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_EXPO } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_EXPO } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_EXPO } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_EXPO } },
};

export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.7, ease: 'easeInOut' } },
};

// ─── Stagger Containers ─────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// ─── Page Transition ────────────────────────────────────────────────────────

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_EXPO } },
};

// ─── Interactive ────────────────────────────────────────────────────────────

export const buttonTap = { scale: 0.97 };
export const cardHover = { scale: 1.02, transition: { duration: 0.2 } };

// ─── Viewport Config ────────────────────────────────────────────────────────

export const viewportConfig = { once: true, margin: '-80px' as const };
