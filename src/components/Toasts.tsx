'use client';

import { m, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { cn } from '@/lib/cn';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const typeConfig = {
  success: { border: 'border-l-emerald-500', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  error: { border: 'border-l-red-500', icon: AlertCircle, iconColor: 'text-red-500' },
  info: { border: 'border-l-blue-500', icon: Info, iconColor: 'text-blue-500' },
  warning: { border: 'border-l-amber-500', icon: AlertTriangle, iconColor: 'text-amber-500' },
};

export function Toasts() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type];
          const Icon = config.icon;
          return (
            <m.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'relative overflow-hidden rounded-lg border border-white/[0.06] bg-zinc-900/90 backdrop-blur-xl border-l-4',
                config.border,
              )}
            >
              <div className="flex items-start gap-3 px-4 py-3">
                <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', config.iconColor)} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white">{toast.title}</p>
                  {toast.description && (
                    <p className="text-xs mt-0.5 text-zinc-500">{toast.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="h-0.5 bg-white/[0.06]">
                <div
                  className="h-full bg-amber-400 animate-[shrink_5s_linear_forwards]"
                  style={{ width: '100%' }}
                />
              </div>
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
