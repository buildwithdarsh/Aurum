'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { useBankingStore } from '@/store/banking';
import { formatCurrency, maskAccountNumber } from '@/lib/format';
import { fadeUp, staggerContainer, viewportConfig } from '@/lib/animations';
import { Skeleton } from '@/components/ui/Skeleton';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Wallet,
  Building2,
  ChevronRight,
  Lock,
  Landmark,
} from 'lucide-react';
import type { BankAccount, FixedDeposit } from '@buildwithdarsh/sdk';

function AccountsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32 mb-1" />
      <div className="space-y-3">
        <Skeleton.Card />
        <Skeleton.Card />
      </div>
      <div className="space-y-2">
        <Skeleton.Transaction />
        <Skeleton.Transaction />
      </div>
    </div>
  );
}

const gradientStrip: Record<string, string> = {
  savings: 'from-amber-400 to-amber-500',
  current: 'from-blue-400 to-blue-500',
};

export default function AccountsPage() {
  const { accounts, setAccounts } = useBankingStore();
  const [fds, setFds] = useState<FixedDeposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [accts, fdList] = await Promise.all([
          TZ.storefront.banking.accounts.list(),
          TZ.storefront.banking.fixedDeposits.list(),
        ]);
        setAccounts(accts);
        setFds(fdList);
      } catch {
        /* empty state */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setAccounts]);

  if (loading) return <AccountsSkeleton />;

  if (accounts.length === 0 && fds.length === 0) {
    return (
      <EmptyState
        illustration={
          <div className="flex items-center justify-center w-full h-full">
            <Landmark className="w-24 h-24 text-zinc-700" />
          </div>
        }
        title="No accounts yet"
        description="Your savings and current accounts will appear here once linked."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <m.div initial="hidden" animate="show" variants={fadeUp}>
        <h1 className="text-lg font-semibold text-white">Accounts</h1>
      </m.div>

      {/* Account Cards */}
      <m.div
        className="space-y-3"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        {accounts.map((acc: BankAccount) => {
          const isSavings = acc.accountType === 'savings';
          const strip = gradientStrip[acc.accountType] ?? gradientStrip['savings'];

          return (
            <m.div key={acc.id} variants={fadeUp}>
              <Link href={`/accounts/${acc.id}`} className="block">
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform">
                  {/* Gradient Top Strip */}
                  <div className={`h-1 bg-gradient-to-r ${strip}`} />

                  <div className="p-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSavings
                              ? 'bg-white/[0.06] text-amber-400'
                              : 'bg-white/[0.06] text-blue-400'
                          }`}
                        >
                          {isSavings ? (
                            <Wallet className="w-5 h-5" />
                          ) : (
                            <Building2 className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {acc.nickname ??
                              `${acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} Account`}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {maskAccountNumber(acc.accountNumber)} &middot;{' '}
                            {acc.ifscCode}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                    </div>

                    {/* Balance */}
                    <div className="mt-3">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                        Available Balance
                      </p>
                      <AnimatedCounter
                        value={acc.balance}
                        className="text-xl font-semibold text-white block mt-0.5"
                      />
                    </div>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge
                        variant={acc.status === 'active' ? 'success' : 'error'}
                      >
                        {acc.status}
                      </Badge>
                      {acc.isPrimary && (
                        <Badge variant="gold">Primary</Badge>
                      )}
                      {acc.autoSweepEnabled && (
                        <Badge variant="info">Auto-Sweep</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </m.div>
          );
        })}
      </m.div>

      {/* Fixed Deposits */}
      {fds.length > 0 && (
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={viewportConfig}
          variants={fadeUp}
        >
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            Fixed Deposits
          </h2>
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
              variants={staggerContainer}
              className="divide-y divide-white/[0.04]"
            >
              {fds.map((fd: FixedDeposit) => {
                const startDate = new Date(fd.createdAt).getTime();
                const endDate = new Date(fd.maturityDate).getTime();
                const now = Date.now();
                const totalDays = Math.max(
                  (endDate - startDate) / (1000 * 60 * 60 * 24),
                  1,
                );
                const elapsedDays = Math.max(
                  (now - startDate) / (1000 * 60 * 60 * 24),
                  0,
                );
                const progress = Math.min(
                  (elapsedDays / totalDays) * 100,
                  100,
                );

                return (
                  <m.div
                    key={fd.id}
                    variants={fadeUp}
                    className="flex items-center gap-4 p-4"
                  >
                    <ProgressRing
                      value={progress}
                      size={56}
                      strokeWidth={4}
                      color="#fbbf24"
                    >
                      <span className="text-[10px] font-bold text-zinc-300">
                        {Math.round(progress)}%
                      </span>
                    </ProgressRing>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {fd.fdNumber}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {fd.tenureDays}d @ {fd.interestRate}% &middot;
                        Matures{' '}
                        {new Date(fd.maturityDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-semibold text-white text-sm">
                        {formatCurrency(fd.principalAmount)}
                      </p>
                      <p className="text-xs text-emerald-400 mt-0.5">
                        {formatCurrency(fd.maturityAmount)}
                      </p>
                    </div>
                  </m.div>
                );
              })}
            </m.div>
          </div>
        </m.div>
      )}
    </div>
  );
}
