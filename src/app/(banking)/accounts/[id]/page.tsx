'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { m } from 'framer-motion';
import { TZ } from '@/lib/tz';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  maskAccountNumber,
} from '@/lib/format';
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportConfig,
  buttonTap,
} from '@/lib/animations';
import { Skeleton } from '@/components/ui/Skeleton';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import type { BankAccount, BankTransaction } from '@buildwithdarsh/sdk';

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/[0.04] h-44 animate-pulse" />
      <div className="space-y-2">
        <Skeleton.Transaction />
        <Skeleton.Transaction />
        <Skeleton.Transaction />
        <Skeleton.Transaction />
      </div>
    </div>
  );
}

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [acc, stmt] = await Promise.all([
          TZ.storefront.banking.accounts.get(id),
          TZ.storefront.banking.accounts.getStatement(id, {
            page,
            limit: 20,
          }),
        ]);
        setAccount(acc);
        const stmtData = stmt as unknown as { transactions: BankTransaction[]; pagination: { totalPages: number } };
        setTransactions(stmtData.transactions ?? []);
        setTotalPages(stmtData.pagination?.totalPages ?? 1);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, page]);

  if (loading || !account) return <DetailSkeleton />;

  const isSavings = account.accountType === 'savings';
  const heroGradient = isSavings
    ? 'from-amber-500/20 via-amber-400/5 to-transparent'
    : 'from-blue-500/20 via-blue-400/5 to-transparent';

  // Group transactions by date
  const grouped: Record<string, BankTransaction[]> = {};
  for (const txn of transactions) {
    const dateKey = formatDate(txn.createdAt);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(txn);
  }

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <m.div initial="hidden" animate="show" variants={scaleIn}>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className={`bg-gradient-to-br ${heroGradient} p-5`}>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">
              {account.accountType.charAt(0).toUpperCase() +
                account.accountType.slice(1)}{' '}
              Account
            </p>
            <AnimatedCounter
              value={account.balance}
              className="text-3xl font-bold text-white block mt-1 font-display"
            />

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-zinc-400">
              <span>A/C: {maskAccountNumber(account.accountNumber)}</span>
              <span>&middot;</span>
              <span>IFSC: {account.ifscCode}</span>
              <Badge
                variant={account.status === 'active' ? 'success' : 'error'}
                animated
              >
                {account.status}
              </Badge>
            </div>
          </div>
        </div>
      </m.div>

      {/* Statement */}
      <m.div
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
        variants={fadeUp}
      >
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white text-sm">Statement</h2>
            <m.button
              whileTap={buttonTap}
              className="flex items-center gap-1.5 text-xs text-amber-400 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </m.button>
          </div>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="w-10 h-10 text-zinc-700 mb-2" />
              <p className="text-zinc-500 text-sm">No transactions found</p>
            </div>
          ) : (
            <m.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              {Object.entries(grouped).map(([date, txns]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="sticky top-0 z-10 bg-zinc-950 -mx-4 px-4 py-1.5">
                    <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
                      {date}
                    </p>
                  </div>

                  {txns.map((txn: BankTransaction) => (
                    <m.div
                      key={txn.id}
                      variants={fadeUp}
                      className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            txn.type === 'credit'
                              ? 'bg-white/[0.06] text-emerald-400'
                              : 'bg-white/[0.06] text-red-400'
                          }`}
                        >
                          {txn.type === 'credit' ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {txn.description}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {formatDateTime(txn.createdAt)}
                            {txn.referenceNumber &&
                              ` · ${txn.referenceNumber}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p
                          className={`text-sm font-semibold ${
                            txn.type === 'credit'
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}
                        >
                          {txn.type === 'credit' ? '+' : '-'}
                          {formatCurrency(txn.amount)}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">
                          Bal: {formatCurrency(txn.balanceAfter)}
                        </p>
                      </div>
                    </m.div>
                  ))}
                </div>
              ))}
            </m.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/[0.04]">
              <m.button
                whileTap={buttonTap}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-white/[0.06] text-white rounded-xl disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </m.button>
              <span className="text-xs text-zinc-500 min-w-[3rem] text-center font-medium tabular-nums">
                {page} / {totalPages}
              </span>
              <m.button
                whileTap={buttonTap}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-white/[0.06] text-white rounded-xl disabled:opacity-30 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </m.button>
            </div>
          )}
        </div>
      </m.div>
    </div>
  );
}
