'use client';

import { m } from 'framer-motion';
import Link from 'next/link';
import { fadeUp } from '@/lib/animations';

interface EmptyStateProps {
  illustration: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ illustration, title, description, action }: EmptyStateProps) {
  return (
    <m.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-48 h-48 mb-6">{illustration}</div>
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-xs">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-5 px-6 py-2.5 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-colors text-sm"
        >
          {action.label}
        </Link>
      )}
    </m.div>
  );
}
