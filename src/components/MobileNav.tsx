'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { href: '/cards', label: 'Cards', icon: CreditCard },
  { href: '/analytics', label: 'More', icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] bg-zinc-950/90 backdrop-blur-xl border-t border-white/[0.06] lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <m.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1"
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-amber-400' : 'text-zinc-400',
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-amber-400' : 'text-zinc-400',
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                )}
              </m.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
