'use client';

import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AU';

  return (
    <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 safe-top bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06] lg:hidden">
      <h1 className="text-lg font-bold tracking-wide">
        <span className="text-amber-400">AU</span>
        <span className="text-white">RUM</span>
      </h1>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="hidden md:flex lg:hidden items-center justify-center w-9 h-9 rounded-lg hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-zinc-400" />
        </button>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors">
          <Bell className="w-5 h-5 text-zinc-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
