'use client';

import { m } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="p-4 sm:p-6 lg:p-8"
    >
      {children}
    </m.div>
  );
}
