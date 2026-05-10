'use client';

import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { useBankingStore } from '@/store/banking';
import { useUIStore } from '@/store/ui';
import { formatCurrency, formatDateTime } from '@/lib/format';
import {
  fadeUp,
  staggerContainer,
  viewportConfig,
  buttonTap,
} from '@/lib/animations';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Receipt, Zap, Phone, Shield, Fuel, Send } from 'lucide-react';
import type { BillPayment } from '@buildwithdarsh/sdk';

const categories = [
  { value: 'electricity', label: 'Electricity', icon: Zap },
  { value: 'mobile', label: 'Mobile', icon: Phone },
  { value: 'insurance', label: 'Insurance', icon: Shield },
  { value: 'gas', label: 'Gas / Fuel', icon: Fuel },
];

function BillsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton.Card />
      <div className="space-y-2">
        <Skeleton.Transaction />
        <Skeleton.Transaction />
        <Skeleton.Transaction />
      </div>
    </div>
  );
}

const statusVariant: Record<string, 'success' | 'error' | 'warning'> = {
  paid: 'success',
  failed: 'error',
  pending: 'warning',
};

export default function BillsPage() {
  const { accounts } = useBankingStore();
  const addToast = useUIStore((s) => s.addToast);
  const [payments, setPayments] = useState<BillPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // Form
  const [accountId, setAccountId] = useState('');
  const [category, setCategory] = useState('electricity');
  const [billerName, setBillerName] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [accts, bills] = await Promise.all([
          accounts.length === 0
            ? TZ.storefront.banking.accounts.list()
            : Promise.resolve(accounts),
          TZ.storefront.banking.bills.list({ page: 1, limit: 20 }),
        ]);
        // Backend returns { payments: [...], pagination }
        const billsData = bills as unknown as { payments: BillPayment[] };
        setPayments(billsData.payments ?? []);
        if (accts.length > 0 && !accountId) setAccountId(accts[0]!.id);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [accounts, accountId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    try {
      await TZ.storefront.banking.bills.pay({
        accountId,
        billerCategory: category,
        billerName,
        consumerNumber,
        amount: Number(amount),
      });
      addToast({ type: 'success', title: 'Bill paid successfully' });
      const updated = await TZ.storefront.banking.bills.list({
        page: 1,
        limit: 20,
      });
      const updatedData = updated as unknown as { payments: BillPayment[] };
      setPayments(updatedData.payments ?? []);
      setBillerName('');
      setConsumerNumber('');
      setAmount('');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Payment failed',
        description: err instanceof Error ? err.message : '',
      });
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <BillsSkeleton />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <m.div initial="hidden" animate="show" variants={fadeUp}>
        <h1 className="text-lg font-semibold text-white">Bill Payments</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Pay utilities, mobile recharge, and insurance via BBPS
        </p>
      </m.div>

      {/* Pay Bill Form */}
      <m.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
      >
        <GlassCard className="p-4">
          <form onSubmit={handlePay} className="space-y-5">
            <h2 className="font-semibold text-white text-lg">Pay a Bill</h2>

            {/* Category Pill Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2.5">
                Category
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                      style={{
                        color: isSelected ? '#0c0a09' : '#71717a',
                      }}
                    >
                      {isSelected && (
                        <m.div
                          layoutId="bill-category"
                          className="absolute inset-0 bg-amber-400 rounded-full shadow-sm"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  From Account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-400/30 transition-shadow"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nickname ?? a.accountType} -{' '}
                      {formatCurrency(a.balance)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Biller Name
                </label>
                <input
                  type="text"
                  value={billerName}
                  onChange={(e) => setBillerName(e.target.value)}
                  placeholder="e.g. MPEB"
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-400/30 transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Consumer Number
                </label>
                <input
                  type="text"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="Your consumer/account number"
                  className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-400/30 transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-3 border border-zinc-200 rounded-xl text-xl font-mono bg-white focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-shadow"
                    required
                    min={1}
                  />
                </div>
              </div>
            </div>

            <m.button
              type="submit"
              disabled={paying}
              whileTap={buttonTap}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-zinc-950 font-semibold rounded-xl hover:bg-amber-300 disabled:opacity-50 text-sm transition-colors shadow-[0_2px_8px_rgba(251,191,36,0.3)]"
            >
              <Send className="w-4 h-4" />
              {paying ? 'Processing...' : 'Pay Bill'}
            </m.button>
          </form>
        </GlassCard>
      </m.div>

      {/* Payment History */}
      <m.div
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
        variants={fadeUp}
      >
        <GlassCard className="p-4">
          <h2 className="font-semibold text-white mb-3 flex items-center gap-2 text-lg">
            <Receipt className="w-4 h-4 text-zinc-400" />
            Payment History
          </h2>

          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="w-12 h-12 text-zinc-200 mb-3" />
              <p className="text-zinc-400 text-sm">No bill payments yet</p>
            </div>
          ) : (
            <m.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="space-y-1"
            >
              {payments.map((p: BillPayment) => (
                <m.div
                  key={p.id}
                  variants={fadeUp}
                  className="flex items-center justify-between py-3.5 border-b border-zinc-100/60 last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-amber-400/10 text-amber-600 flex items-center justify-center shrink-0">
                      {(() => {
                        const cat = categories.find(
                          (c) => c.value === p.billerCategory,
                        );
                        const Icon = cat?.icon ?? Receipt;
                        return <Icon className="w-4 h-4" />;
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {p.billerName}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">
                        {p.billerCategory} &middot; {p.consumerNumber}
                        {p.paidAt && ` · ${formatDateTime(p.paidAt)}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold text-white tabular-nums">
                      {formatCurrency(p.amount)}
                    </p>
                    <div className="mt-1">
                      <Badge variant={statusVariant[p.status] ?? 'info'}>
                        {p.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </m.div>
              ))}
            </m.div>
          )}
        </GlassCard>
      </m.div>
    </div>
  );
}
