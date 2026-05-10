import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you are looking for does not exist. Return to the Aurum homepage.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-amber-400 mb-4">404</p>
        <h1 className="text-2xl font-semibold text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-zinc-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 transition-colors text-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
