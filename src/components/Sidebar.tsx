'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { TZ } from '@/lib/tz';
import { clearAuthCookie } from '@/lib/auth-cookie';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { href: '/cards', label: 'Cards', icon: CreditCard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/bills', label: 'Bills', icon: Receipt },
];

function SidebarContent() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    TZ.client.clearEndUserTokens();
    clearAuthCookie();
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">
          <span className="text-amber-400 animate-breathe">AU</span>
          <span className="text-white">RUM</span>
        </h1>
        <p className="text-[10px] tracking-[0.3em] text-zinc-500 mt-0.5">
          BANKING, REFINED
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'text-amber-400'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5',
              )}
            >
              {isActive && (
                <m.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-amber-400/10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className="relative z-10 w-4 h-4" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 h-screen bg-zinc-950/90 backdrop-blur-xl text-white flex-col border-r border-white/10 fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Tablet drawer overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <m.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 z-50 w-64 h-screen bg-zinc-950/95 backdrop-blur-xl text-white flex flex-col border-r border-white/10 lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
              <SidebarContent />
            </m.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
