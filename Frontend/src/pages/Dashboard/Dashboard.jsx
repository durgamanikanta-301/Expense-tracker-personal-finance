import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { MerchantLogo } from '@/components/ui/MerchantLogo'
import { CATEGORY_CONFIG } from '@/constants'
import { resolveIntelligentCategory, cleanDescription, getCategoryConfig, detectMerchant } from '@/services/merchantService'
import { expenseService } from '@/services/expenseService'
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank,
  HeartPulse, Brain, Quote, ArrowUpRight, ArrowDownLeft,
  RefreshCw,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Cell, Pie,
} from 'recharts'
import { motion } from 'framer-motion'
import { formatDateShort, getRandomQuote, getHealthScore, formatCurrency } from '@/utils'
import { Button } from '@/components/ui/Button'
import CountUp from 'react-countup'

/* ── Animation variants ───────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
}

/* ── Custom chart tooltip ─────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#131316] border border-white/10 rounded-xl px-3 py-2.5 shadow-elevated text-xs">
      <p className="text-zinc-400 font-medium mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-zinc-400">{p.dataKey}</span>
          <span className="ml-auto font-bold text-white pl-4">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Health gauge ─────────────────────────────────────────────── */
function HealthGauge({ score }) {
  const color = score >= 70 ? '#10B981' : score >= 45 ? '#F59E0B' : '#EF4444'
  const r = 40
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - score / 100)
  const label = score >= 70 ? 'Excellent' : score >= 45 ? 'Fair' : 'Needs Work'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} className="fill-none stroke-white/5" strokeWidth="8" />
          <motion.circle
            cx="48" cy="48" r={r}
            className="fill-none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white font-display leading-none">
            <CountUp end={score} duration={1.4} preserveValue />
          </span>
          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-white flex items-center gap-1 justify-center">
          <HeartPulse className="w-3.5 h-3.5" style={{ color }} />
          Financial Health
        </p>
        <p className="text-[10px] mt-0.5 font-semibold" style={{ color }}>{label}</p>
      </div>
    </div>
  )
}

/* ── Main Dashboard ───────────────────────────────────────────── */
export function Dashboard() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    staleTime: 30_000,
  })

  // Fetch all expenses to compute intelligent category breakdowns
  const { data: allExpenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getAll,
    staleTime: 15_000,
  })

  if (isLoading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <HeartPulse className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold">Failed to load dashboard</p>
          <p className="text-sm text-zinc-500 mt-1">Could not reach the backend server</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      </div>
    )
  }

  const healthScore = getHealthScore(
    Number(data.monthlyIncome),
    Number(data.monthlyExpense),
    Number(data.currentBalance)
  )
  const quote = getRandomQuote()

  const areaData = [...data.monthlySummaries].reverse().map(s => ({
    name: s.monthName?.slice(0, 3) || '',
    Income: Number(s.income),
    Expense: Number(s.expense),
  }))

  // Compute intelligent categories for current month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const currentMonthExpenses = allExpenses.filter(tx => {
    const d = new Date(tx.expenseDate)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && tx.transactionType === 'EXPENSE'
  })

  let totalCatExpense = 0
  const catTotals = {}
  currentMonthExpenses.forEach(tx => {
    const intCat = resolveIntelligentCategory(tx)
    catTotals[intCat] = (catTotals[intCat] || 0) + Number(tx.amount)
    totalCatExpense += Number(tx.amount)
  })

  const pieData = Object.entries(catTotals).map(([name, value]) => ({
    name,
    value,
    color: getCategoryConfig(name).color,
    emoji: getCategoryConfig(name).emoji,
    pct: totalCatExpense > 0 ? (value / totalCatExpense) * 100 : 0,
  })).sort((a, b) => b.value - a.value)

  const netPositive = Number(data.monthlyBalance) >= 0
  const spendRatio = Number(data.monthlyIncome) > 0
    ? Math.round((Number(data.monthlyExpense) / Number(data.monthlyIncome)) * 100)
    : 0

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <StatCard
            label="Net Balance"
            value={data.currentBalance}
            icon={<Wallet className="w-4 h-4 text-blue-400" />}
            iconBg="bg-blue-500/10"
            glow="blue"
            note="All-time balance"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            label="Monthly Income"
            value={data.monthlyIncome}
            icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
            iconBg="bg-emerald-500/10"
            glow="green"
            note="This month"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            label="Monthly Expenses"
            value={data.monthlyExpense}
            icon={<TrendingDown className="w-4 h-4 text-red-400" />}
            iconBg="bg-red-500/10"
            note={`${spendRatio}% of income`}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            label="Net Margin"
            value={data.monthlyBalance}
            icon={<PiggyBank className="w-4 h-4 text-cyan-400" />}
            iconBg="bg-cyan-500/10"
            glow={netPositive ? 'green' : 'none'}
            note={netPositive ? '✓ Surplus this month' : '⚠ Deficit this month'}
          />
        </motion.div>
      </div>

      {/* ── Insights + Quote ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  AI Financial Insights
                </h3>
              </div>
              {isFetching && (
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Updating…
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <HealthGauge score={healthScore} />

              <div className="md:col-span-2 space-y-3">
                <div className="glass-light p-3.5 rounded-xl border border-white/[0.06]">
                  <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-1.5">
                    Spending Alert
                  </p>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {spendRatio > 90
                      ? `🚨 Critical: ${spendRatio}% of income spent. Immediate action required.`
                      : spendRatio > 70
                      ? `⚠️ Caution: ${spendRatio}% of income spent. Review non-essentials.`
                      : `✅ Healthy: Spending at ${spendRatio}% of income. Well within range.`}
                  </p>
                </div>
                <div className="glass-light p-3.5 rounded-xl border border-white/[0.06]">
                  <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
                    Smart Recommendation
                  </p>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {Number(data.monthlyBalance) > 0
                      ? `You have ${formatCurrency(data.monthlyBalance)} surplus this month. Allocate 50% to savings goals for optimal growth.`
                      : Number(data.monthlyBalance) === 0
                      ? 'Income exactly covers expenses. Try reducing one recurring expense this month.'
                      : `Expenses exceed income by ${formatCurrency(Math.abs(Number(data.monthlyBalance)))}. Review your top spending categories immediately.`}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <Quote className="w-5 h-5 text-purple-400/50" />
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Daily Mindset</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-white/85 italic font-display flex-1 flex items-center">
              "{quote}"
            </p>
            <div className="border-t border-white/[0.05] pt-3 mt-4">
              <p className="text-[10px] text-zinc-600">Rotates daily for financial clarity</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-5">
              6-Month Cash Flow
            </h3>
            {areaData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" stroke="#3f3f46" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#3f3f46" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="Income"  stroke="#10B981" strokeWidth={2} fill="url(#gIncome)"  dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#10B981' }} />
                    <Area type="monotone" dataKey="Expense" stroke="#EF4444" strokeWidth={2} fill="url(#gExpense)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#EF4444' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center">
                <p className="text-2xl mb-2">📊</p>
                <p className="text-sm text-zinc-400 font-medium">No transaction history yet</p>
                <p className="text-xs text-zinc-600 mt-1">Add transactions to see your cash flow chart</p>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Expenses
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="h-full">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Spending by Category
            </h3>
            {pieData.length > 0 ? (
              <>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%" cy="50%"
                        innerRadius={44} outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} opacity={0.9} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const d = payload[0].payload
                          return (
                            <div className="bg-[#131316] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-elevated">
                              <p className="text-white font-bold">{d.name}</p>
                              <p className="text-zinc-400">{formatCurrency(d.value)}</p>
                              <p className="text-zinc-500">{d.pct.toFixed(1)}%</p>
                            </div>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2">
                  {pieData.slice(0, 5).map(c => (
                    <div key={c.name} className="flex items-center gap-2 text-[11px] min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: c.color }}
                      />
                      <span className="text-zinc-500 truncate flex-1">
                        {c.emoji} {c.name}
                      </span>
                      <span className="text-white font-semibold">{c.pct.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <p className="text-2xl mb-2">🍩</p>
                <p className="text-sm text-zinc-400 font-medium">No spending data</p>
                <p className="text-xs text-zinc-600 mt-1">Add expense transactions to see breakdown</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Recent Transactions ── */}
      <motion.div variants={item}>
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Recent Transactions
              </h3>
              {data.recentTransactions.length > 0 && (
                <p className="text-[10px] text-zinc-600 mt-0.5">
                  Last {data.recentTransactions.length} records
                </p>
              )}
            </div>
          </div>

          {data.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                    <th className="pb-3 pr-4">Transaction</th>
                    <th className="pb-3 pr-4 hidden sm:table-cell">Category</th>
                    <th className="pb-3 pr-4 hidden md:table-cell">Date</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {data.recentTransactions.map(tx => {
                    const isIncome = tx.transactionType === 'INCOME'
                    const intCat = resolveIntelligentCategory(tx)
                    const cfg = getCategoryConfig(intCat)
                    const merchant = detectMerchant(tx.title)
                    const displayDesc = cleanDescription(tx.description)
                    return (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <MerchantLogo merchant={merchant} name={tx.title} size="sm" />
                            <div>
                              <p className="text-sm text-white font-medium leading-none max-w-[140px] truncate">
                                {tx.title}
                              </p>
                              {displayDesc && (
                                <p className="text-[10px] text-zinc-600 mt-0.5 max-w-[140px] truncate">
                                  {displayDesc}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 hidden sm:table-cell">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: cfg?.bg, color: cfg?.color }}
                          >
                            <span>{cfg?.emoji}</span>
                            <span className="hidden lg:inline">{intCat}</span>
                          </span>
                        </td>
                        <td className="py-3 pr-4 hidden md:table-cell text-[11px] text-zinc-500 whitespace-nowrap">
                          {formatDateShort(tx.expenseDate)}
                        </td>
                        <td className={`py-3 text-right text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-white'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-3xl mb-3">💸</p>
              <p className="text-sm text-white font-medium">No transactions yet</p>
              <p className="text-xs text-zinc-500 mt-1">
                Add your first transaction in the Transactions tab
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
