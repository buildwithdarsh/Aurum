'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { m } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { formatCurrency } from '@/lib/format';
import {
  fadeUp,
  staggerContainer,
  staggerContainerSlow,
  viewportConfig,
  buttonTap,
} from '@/lib/animations';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  AlertTriangle,
  Eye,
  X,
  BarChart3,
} from 'lucide-react';
import type {
  SpendingBreakdown,
  MonthlyTrends,
  CashFlowSummary,
  BudgetItem,
  AnomalyAlert,
} from '@buildwithdarsh/sdk';

const SpendingDonut = dynamic(
  () => import('@/components/charts/SpendingDonut'),
  { ssr: false },
);
const TrendsAreaChart = dynamic(
  () => import('@/components/charts/TrendsAreaChart'),
  { ssr: false },
);

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-28" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton.StatCard />
        <Skeleton.StatCard />
        <Skeleton.StatCard />
      </div>
      <Skeleton.Chart />
    </div>
  );
}

function getBudgetColor(utilization: number): string {
  if (utilization > 100) return '#ef4444';
  if (utilization >= 70) return '#f59e0b';
  return '#10b981';
}

function getBudgetVariant(utilization: number): 'success' | 'warning' | 'danger' {
  if (utilization > 100) return 'danger';
  if (utilization >= 70) return 'warning';
  return 'success';
}

export default function AnalyticsPage() {
  const [spending, setSpending] = useState<SpendingBreakdown | null>(null);
  const [trends, setTrends] = useState<MonthlyTrends | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowSummary | null>(null);
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sp, tr, cf, bg, al] = await Promise.all([
          TZ.storefront.banking.analytics.getSpendingBreakdown(3),
          TZ.storefront.banking.analytics.getMonthlyTrends(6),
          TZ.storefront.banking.analytics.getCashFlow(),
          TZ.storefront.banking.budgets.list(),
          TZ.storefront.banking.alerts.list({
            page: 1,
            limit: 10,
            unreadOnly: false,
          }),
        ]);
        setSpending(sp);
        setTrends(tr);
        setCashFlow(cf);
        setBudgets(bg);
        const alertsData = al as unknown as { alerts: AnomalyAlert[] };
        setAlerts(alertsData.alerts ?? []);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkRead = async (alertId: string) => {
    try {
      await TZ.storefront.banking.alerts.markRead(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
      );
    } catch {
      /* empty */
    }
  };

  const handleDismiss = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  if (loading) return <AnalyticsSkeleton />;

  const hasData = cashFlow || spending || trends || budgets.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-4">
        <m.div initial="hidden" animate="show" variants={fadeUp}>
          <h1 className="text-lg font-semibold text-white">Analytics</h1>
        </m.div>
        <EmptyState
          illustration={
            <div className="flex items-center justify-center w-full h-full">
              <BarChart3 className="w-24 h-24 text-zinc-300" />
            </div>
          }
          title="No analytics data yet"
          description="Once you start transacting, your spending insights and budgets will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <m.div initial="hidden" animate="show" variants={fadeUp}>
        <h1 className="text-lg font-semibold text-white">Analytics</h1>
      </m.div>

      {/* Cash Flow Summary */}
      {cashFlow && (
        <m.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Income"
            value={cashFlow.totalIncome}
            color="emerald"
          />
          <StatCard
            icon={<TrendingDown className="w-5 h-5" />}
            label="Expenditure"
            value={cashFlow.totalExpenditure}
            color="red"
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Net"
            value={cashFlow.netCashFlow}
            color={cashFlow.netCashFlow >= 0 ? 'emerald' : 'red'}
          />
        </m.div>
      )}

      {/* Charts */}
      {spending && (
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={viewportConfig}
          variants={fadeUp}
        >
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
            <h2 className="font-semibold text-white text-sm mb-0.5">
              Spending by Category
            </h2>
            <p className="text-[11px] text-zinc-500 mb-3">
              Last {spending.period.months} months &middot; Total:{' '}
              {formatCurrency(spending.totalSpent)}
            </p>

            <SpendingDonut data={spending.breakdown} />

            <div className="mt-4 space-y-2.5">
              {spending.breakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300 capitalize font-medium">
                      {item.category}
                    </span>
                    <span className="text-zinc-500 tabular-nums">
                      {formatCurrency(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <ProgressBar value={item.percentage} variant="gold" />
                </div>
              ))}
            </div>
          </div>
        </m.div>
      )}

      {trends && (
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={viewportConfig}
          variants={fadeUp}
        >
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4">
            <h2 className="font-semibold text-white text-sm mb-0.5">
              Monthly Trends
            </h2>
            <p className="text-[11px] text-zinc-500 mb-3">
              Income vs expenditure over {trends.trends.length} months
            </p>

            <TrendsAreaChart data={trends.trends} />
          </div>
        </m.div>
      )}

      {/* Budgets */}
      {budgets.length > 0 && (
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={viewportConfig}
          variants={fadeUp}
        >
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-zinc-500" />
            Budget Tracking
          </h2>
          <m.div
            className="space-y-3"
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={staggerContainerSlow}
          >
            {budgets.map((b: BudgetItem) => (
              <m.div key={b.id} variants={fadeUp}>
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
                  <ProgressRing
                    value={Math.min(b.utilization, 100)}
                    size={52}
                    strokeWidth={4}
                    color={getBudgetColor(b.utilization)}
                  >
                    <span className="text-[10px] font-bold text-zinc-300">
                      {b.utilization}%
                    </span>
                  </ProgressRing>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white capitalize truncate">
                        {b.category}
                      </p>
                      {b.isOverBudget && (
                        <Badge variant="error">Over</Badge>
                      )}
                      {b.isNearLimit && !b.isOverBudget && (
                        <Badge variant="warning">Near</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      {formatCurrency(b.spent)} / {formatCurrency(b.monthlyLimit)}
                    </p>
                    <ProgressBar
                      value={Math.min(b.utilization, 100)}
                      variant={getBudgetVariant(b.utilization)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </m.div>
            ))}
          </m.div>
        </m.div>
      )}

      {/* Anomaly Alerts */}
      {alerts.length > 0 && (
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={viewportConfig}
          variants={fadeUp}
        >
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Anomaly Alerts
          </h2>
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden">
            <m.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="divide-y divide-white/[0.04]"
            >
              {alerts.map((alert: AnomalyAlert) => (
                <m.div
                  key={alert.id}
                  variants={fadeUp}
                  className="flex items-start gap-3 p-4"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.severity === 'high'
                        ? 'bg-white/[0.06] text-red-400'
                        : alert.severity === 'medium'
                          ? 'bg-white/[0.06] text-amber-400'
                          : 'bg-white/[0.06] text-blue-400'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white">
                        {alert.title}
                      </p>
                      <Badge
                        variant={
                          alert.severity === 'high'
                            ? 'error'
                            : alert.severity === 'medium'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {alert.severity}
                      </Badge>
                      {alert.isRead && (
                        <Badge variant="success">Read</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {alert.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!alert.isRead && (
                      <m.button
                        whileTap={buttonTap}
                        onClick={() => handleMarkRead(alert.id)}
                        className="p-1.5 rounded-lg bg-white/[0.06] text-zinc-400 transition-colors"
                        title="Mark as read"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </m.button>
                    )}
                    <m.button
                      whileTap={buttonTap}
                      onClick={() => handleDismiss(alert.id)}
                      className="p-1.5 rounded-lg bg-white/[0.06] text-zinc-400 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </m.button>
                  </div>
                </m.div>
              ))}
            </m.div>
          </div>
        </m.div>
      )}
    </div>
  );
}
