'use client';

import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import Link from 'next/link';
import { TZ } from '@/lib/tz';
import { useAuthStore } from '@/store/auth';
import { useBankingStore } from '@/store/banking';
import { formatCurrency, formatDateTime, maskAccountNumber } from '@/lib/format';
import { staggerContainer, fadeUp, viewportConfig } from '@/lib/animations';
import { StatCard } from '@/components/ui/StatCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import TrendsAreaChart from '@/components/charts/TrendsAreaChart';
import {
  Wallet,
  TrendingUp,
  Lock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Receipt,
  CreditCard,
} from 'lucide-react';
import type {
  BankAccount,
  BankTransaction,
  NetWorthSnapshot,
  AnomalyAlert,
  MonthlyTrends,
} from '@buildwithdarsh/sdk';

// ─── Greeting helper ────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

// ─── Loading skeleton ───────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Balance hero */}
      <div className="flex flex-col items-center gap-2 py-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-44" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex justify-center gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-2 w-8" />
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton.StatCard key={i} />
        ))}
      </div>

      {/* Chart */}
      <Skeleton.Chart />

      {/* Transactions */}
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton.Transaction key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Quick Action Button ────────────────────────────────────────────────────

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href}>
      <m.div
        variants={fadeUp}
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-1.5 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-zinc-300">
          {icon}
        </div>
        <span className="text-[10px] font-medium text-zinc-500">{label}</span>
      </m.div>
    </Link>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { accounts, setAccounts } = useBankingStore();
  const [recentTxns, setRecentTxns] = useState<BankTransaction[]>([]);
  const [netWorth, setNetWorth] = useState<NetWorthSnapshot | null>(null);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [trends, setTrends] = useState<MonthlyTrends | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [accts, nw, alertsRaw, trendsRes] = await Promise.all([
          TZ.storefront.banking.accounts.list(),
          TZ.storefront.banking.analytics.getNetWorth(),
          TZ.storefront.banking.alerts.list({ page: 1, limit: 5, unreadOnly: true }),
          TZ.storefront.banking.analytics.getMonthlyTrends(6),
        ]);
        setAccounts(accts);
        setNetWorth(nw);
        // Backend returns { alerts: [...], pagination } — extract the array
        const alertsData = alertsRaw as unknown as { alerts: AnomalyAlert[] };
        setAlerts(alertsData.alerts ?? []);
        setTrends(trendsRes);

        if (accts.length > 0) {
          // Backend returns { transactions: [...], pagination } — extract the array
          const stmtRaw = (await TZ.storefront.banking.accounts.getStatement(accts[0]!.id, {
            page: 1,
            limit: 5,
          })) as unknown as { transactions: BankTransaction[] };
          setRecentTxns(stmtRaw.transactions ?? []);
        }
      } catch {
        // Will show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [setAccounts]);

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return <DashboardSkeleton />;
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const unreadCount = alerts.length;

  const savingsTotal = accounts
    .filter((a: BankAccount) => a.accountType === 'savings')
    .reduce((sum: number, a: BankAccount) => sum + a.balance, 0);
  const currentTotal = accounts
    .filter((a: BankAccount) => a.accountType === 'current')
    .reduce((sum: number, a: BankAccount) => sum + a.balance, 0);

  return (
    <div className="space-y-5">
      {/* ── Greeting ──────────────────────────────────────────────────── */}
      <m.div variants={fadeUp} initial="hidden" animate="show">
        <h1 className="text-lg font-semibold text-white">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-xs text-zinc-500">{todayFormatted()}</p>
      </m.div>

      {/* ── Total Balance hero ────────────────────────────────────────── */}
      <m.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center py-3"
      >
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Balance</p>
        <AnimatedCounter
          value={netWorth?.summary.accountsTotal ?? 0}
          format={formatCurrency}
          className="text-3xl font-bold text-white"
        />
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Savings {formatCurrency(savingsTotal)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Current {formatCurrency(currentTotal)}
          </span>
        </div>
      </m.div>

      {/* ── Quick actions ─────────────────────────────────────────────── */}
      <m.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex items-center justify-center gap-8"
      >
        <QuickAction href="/transfers" icon={<Send className="w-5 h-5" />} label="Send" />
        <QuickAction href="/bills" icon={<Receipt className="w-5 h-5" />} label="Pay" />
        <QuickAction href="/cards" icon={<CreditCard className="w-5 h-5" />} label="Cards" />
      </m.div>

      {/* ── Stats grid ────────────────────────────────────────────────── */}
      <m.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="Net Worth"
          value={netWorth?.summary.netWorth ?? 0}
          format={formatCurrency}
          color="amber"
          className="p-4"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Balance"
          value={netWorth?.summary.accountsTotal ?? 0}
          format={formatCurrency}
          color="emerald"
          className="p-4"
        />
        <StatCard
          icon={<Lock className="w-5 h-5" />}
          label="FDs"
          value={netWorth?.summary.fixedDepositsTotal ?? 0}
          format={formatCurrency}
          color="blue"
          className="p-4"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Alerts"
          value={unreadCount}
          format={(n) => String(Math.round(n))}
          color={unreadCount > 0 ? 'red' : 'purple'}
          className="p-4"
        />
      </m.div>

      {/* ── Trends chart ──────────────────────────────────────────────── */}
      {trends && (
        <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportConfig}>
          <GlassCard className="p-4">
            <h2 className="text-sm font-medium text-zinc-400 mb-3">Monthly Trends</h2>
            <TrendsAreaChart data={trends.trends} />
          </GlassCard>
        </m.div>
      )}

      {/* ── Accounts list ─────────────────────────────────────────────── */}
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <GlassCard className="p-4">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Accounts</h2>
          {accounts.length === 0 ? (
            <p className="text-zinc-500 text-xs py-2">No accounts found</p>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {accounts.map((acc: BankAccount) => (
                <Link key={acc.id} href={`/accounts/${acc.id}`}>
                  <m.div
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {acc.nickname ??
                          acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {maskAccountNumber(acc.accountNumber)}
                      </p>
                    </div>
                    <AnimatedCounter
                      value={acc.balance}
                      format={formatCurrency}
                      className="text-sm font-semibold text-white shrink-0"
                    />
                  </m.div>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      </m.div>

      {/* ── Recent Transactions ───────────────────────────────────────── */}
      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-400">Recent Transactions</h2>
            <Link
              href="/accounts"
              className="text-[10px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              View all transactions
            </Link>
          </div>
          {recentTxns.length === 0 ? (
            <p className="text-zinc-500 text-xs py-2">No recent transactions</p>
          ) : (
            <m.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="divide-y divide-white/[0.04]"
            >
              {recentTxns.map((txn: BankTransaction) => (
                <m.div
                  key={txn.id}
                  variants={fadeUp}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      txn.type === 'credit'
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    {txn.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {txn.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={txn.type === 'credit' ? 'success' : 'error'}>
                        {txn.category ?? txn.mode ?? 'General'}
                      </Badge>
                      <span className="text-[10px] text-zinc-500">
                        {formatDateTime(txn.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold shrink-0 ${
                      txn.type === 'credit' ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {txn.type === 'credit' ? '+' : '-'}
                    {formatCurrency(txn.amount)}
                  </p>
                </m.div>
              ))}
            </m.div>
          )}
        </GlassCard>
      </m.div>
    </div>
  );
}
