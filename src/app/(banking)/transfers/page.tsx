'use client';

import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { useBankingStore } from '@/store/banking';
import { useUIStore } from '@/store/ui';
import { formatCurrency, formatDate } from '@/lib/format';
import {
  fadeUp,
  staggerContainer,
  viewportConfig,
  buttonTap,
  EASE_EXPO,
} from '@/lib/animations';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ArrowUpRight,
  Users,
  Clock,
  Star,
  Send,
  X,
  UserPlus,
} from 'lucide-react';
import type {
  Beneficiary,
  ScheduledTransfer,
  TransferMode,
} from '@buildwithdarsh/sdk';

const MODES: { value: TransferMode; label: string }[] = [
  { value: 'imps', label: 'IMPS' },
  { value: 'neft', label: 'NEFT' },
  { value: 'rtgs', label: 'RTGS' },
  { value: 'upi', label: 'UPI' },
];

function TransfersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <Skeleton.Card />
      <Skeleton.Card />
    </div>
  );
}

export default function TransfersPage() {
  const { accounts, beneficiaries, setBeneficiaries } = useBankingStore();
  const addToast = useUIStore((s) => s.addToast);
  const [scheduled, setScheduled] = useState<ScheduledTransfer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Transfer form
  const [fromAccount, setFromAccount] = useState('');
  const [toBene, setToBene] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<TransferMode>('imps');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [benes, sched, accts] = await Promise.all([
          TZ.storefront.banking.beneficiaries.list(),
          TZ.storefront.banking.scheduledTransfers.list(),
          accounts.length === 0
            ? TZ.storefront.banking.accounts.list()
            : Promise.resolve(accounts),
        ]);
        setBeneficiaries(benes);
        setScheduled(sched);
        if (accts.length > 0 && !fromAccount) setFromAccount(accts[0]!.id);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [accounts, fromAccount, setBeneficiaries]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const bene = beneficiaries.find((b: Beneficiary) => b.id === toBene);
    if (!bene) return;

    setSending(true);
    try {
      await TZ.storefront.banking.transfers.initiate({
        senderAccountId: fromAccount,
        beneficiaryAccount: bene.accountNumber,
        beneficiaryIfsc: bene.ifscCode,
        beneficiaryName: bene.name,
        amount: Number(amount),
        mode,
        ...(description ? { description } : {}),
      });
      addToast({
        type: 'success',
        title: 'Transfer successful',
        description: `${formatCurrency(Number(amount))} sent to ${bene.name}`,
      });
      setShowForm(false);
      setAmount('');
      setDescription('');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Transfer failed',
        description: err instanceof Error ? err.message : '',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <TransfersSkeleton />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <m.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="flex items-center justify-between"
      >
        <h1 className="text-lg font-semibold text-white">Transfers</h1>
        <m.button
          whileTap={buttonTap}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-zinc-950 font-semibold rounded-xl text-sm"
        >
          <ArrowUpRight className="w-4 h-4" />
          New Transfer
        </m.button>
      </m.div>

      {/* Transfer Form */}
      <AnimatePresence>
        {showForm && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_EXPO }}
            className="overflow-hidden"
          >
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-white text-sm">
                    Send Money
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="p-1.5 rounded-lg bg-white/[0.06] text-zinc-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mode Selector */}
                <div>
                  <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    Transfer Mode
                  </label>
                  <div className="relative inline-flex bg-white/[0.04] rounded-xl p-1">
                    {MODES.map((m_item) => (
                      <button
                        key={m_item.value}
                        type="button"
                        onClick={() => setMode(m_item.value)}
                        className="relative z-10 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors"
                        style={{
                          color:
                            mode === m_item.value
                              ? '#0c0a09'
                              : '#71717a',
                        }}
                      >
                        {mode === m_item.value && (
                          <m.div
                            layoutId="mode-indicator"
                            className="absolute inset-0 bg-amber-400 rounded-lg"
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                        <span className="relative z-10">{m_item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      From Account
                    </label>
                    <select
                      value={fromAccount}
                      onChange={(e) => setFromAccount(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-400/30 transition-shadow"
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
                    <label className="block text-xs font-medium text-zinc-500 mb-1">
                      To Beneficiary
                    </label>
                    <select
                      value={toBene}
                      onChange={(e) => setToBene(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:ring-2 focus:ring-amber-400/30 transition-shadow"
                      required
                    >
                      <option value="">Select beneficiary</option>
                      {beneficiaries.map((b: Beneficiary) => (
                        <option key={b.id} value={b.id}>
                          {b.name} - {b.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg font-mono">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-lg font-mono text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-400/30 transition-shadow"
                      required
                      min={1}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Payment for..."
                    className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-400/30 transition-shadow"
                  />
                </div>

                <div className="flex gap-3">
                  <m.button
                    type="submit"
                    disabled={sending}
                    whileTap={buttonTap}
                    className="flex items-center gap-2 px-5 py-2 bg-amber-400 text-zinc-950 font-semibold rounded-xl disabled:opacity-50 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? 'Sending...' : 'Send Money'}
                  </m.button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2 bg-white/[0.06] text-white text-sm font-medium rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Beneficiaries */}
      <m.div
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
        variants={fadeUp}
      >
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-zinc-500" />
              Beneficiaries
            </h2>
          </div>

          {beneficiaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserPlus className="w-8 h-8 text-zinc-700 mb-2" />
              <p className="text-zinc-500 text-sm">
                No beneficiaries added
              </p>
            </div>
          ) : (
            <m.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              {beneficiaries.map((b: Beneficiary) => (
                <m.div
                  key={b.id}
                  variants={fadeUp}
                  className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {b.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {b.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {b.bankName ?? b.ifscCode} &middot;{' '}
                        {b.accountNumber}
                      </p>
                    </div>
                  </div>
                  {b.isFavorite && (
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  )}
                </m.div>
              ))}
            </m.div>
          )}
        </div>
      </m.div>

      {/* Scheduled Transfers */}
      <m.div
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
        variants={fadeUp}
      >
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
          <h2 className="font-semibold text-white text-sm flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            Scheduled
          </h2>

          {scheduled.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="w-8 h-8 text-zinc-700 mb-2" />
              <p className="text-zinc-500 text-sm">
                No scheduled transfers
              </p>
            </div>
          ) : (
            <div className="relative pl-5">
              {/* Vertical Timeline Line */}
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-zinc-700" />

              <m.div
                initial="hidden"
                animate="show"
                variants={staggerContainer}
              >
                {scheduled.map((st: ScheduledTransfer) => (
                  <m.div
                    key={st.id}
                    variants={fadeUp}
                    className="relative flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-950" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {st.beneficiaryName}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {st.frequency} &middot; {st.mode.toUpperCase()}{' '}
                        &middot; Next:{' '}
                        {formatDate(st.nextExecutionAt)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white shrink-0 ml-3">
                      {formatCurrency(st.amount)}
                    </p>
                  </m.div>
                ))}
              </m.div>
            </div>
          )}
        </div>
      </m.div>
    </div>
  );
}
