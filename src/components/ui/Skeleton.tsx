import { cn } from '@/lib/cn';

function Base({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-zinc-800', className)}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
    </div>
  );
}

function Text({ className, lines = 1 }: { className?: string; lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Base key={i} className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')} />
      ))}
    </div>
  );
}

function StatCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-3', className)}>
      <Base className="h-10 w-10 rounded-xl" />
      <Base className="h-3 w-20" />
      <Base className="h-7 w-32" />
    </div>
  );
}

function Transaction({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 py-3', className)}>
      <Base className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Base className="h-4 w-40" />
        <Base className="h-3 w-24" />
      </div>
      <Base className="h-5 w-20" />
    </div>
  );
}

function Chart({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-zinc-900 border border-zinc-800 p-5', className)}>
      <Base className="h-4 w-32 mb-4" />
      <Base className="h-48 w-full rounded-xl" />
    </div>
  );
}

function Card({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Base className="h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Base className="h-4 w-28" />
          <Base className="h-3 w-40" />
        </div>
      </div>
      <Base className="h-8 w-36" />
      <Base className="h-2 w-full" />
    </div>
  );
}

export const Skeleton = Object.assign(Base, {
  Text,
  StatCard,
  Transaction,
  Chart,
  Card,
});
