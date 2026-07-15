import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboardService'
import { GlassCard } from '@/components/ui/GlassCard'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { CATEGORY_CONFIG } from '@/constants'
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownLeft, HeartPulse, Brain, Quote } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Cell, Pie,
} from 'recharts'
import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { formatDateShort, getRandomQuote, getHealthScore } from '@/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } } }

export function Dashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    staleTime: 30_000,
  })

  if (isLoading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <HeartPulse className="w-12 h-12 text-red-400/50" />
        <div className="text-center">
          <p className="text-white font-semibold">Failed to load dashboard</p>
          <p className="text-xs text-zinc-400 mt-1">Could not reach the backend</p>
        </div>
        <button onClick={() => refetch()}
          className="px-5 py-2 rounded-xl glass border border-white/10 text-sm hover:bg-white/5 transition-colors">
          Try Again
        </button>
      </div>
    )
  }

  const healthScore = getHealthScore(Number(data.monthlyIncome), Number(data.monthlyExpense), Number(data.currentBalance))
  const quote = getRandomQuote()

  const areaData = [...data.monthlySummaries].reverse().map(s => ({
    name: s.monthName.slice(0, 3),
    Income: Number(s.income),
    Expense: Number(s.expense),
  }))

  const pieData = data.categoryWiseSpending.map(c => ({
    name: CATEGORY_CONFIG[c.category]?.label || c.category,
    value: Number(c.amount),
    color: CATEGORY_CONFIG[c.category]?.color || '#94A3B8',
    pct: Number(c.percentage),
  }))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Net Balance',    value: data.currentBalance, icon: <Wallet className="w-4 h-4 text-blue-400" />,  iconBg: 'bg-blue-500/10',   glow: 'blue',  note: 'All-time' },
          { label: 'Month Income',   value: data.monthlyIncome,  icon: <TrendingUp className="w-4 h-4 text-green-400" />, iconBg: 'bg-green-500/10', glow: 'green', note: 'This month' },
          { label: 'Month Expense',  value: data.monthlyExpense, icon: <TrendingDown className="w-4 h-4 text-red-400" />, iconBg: 'bg-red-500/10',  glow: 'none',  note: 'This month' },
          { label: 'Net Margin',     value: data.monthlyBalance, icon: <PiggyBank className="w-4 h-4 text-cyan-400" />, iconBg: 'bg-cyan-500/10',  glow: 'none',  note: 'Monthly surplus' },
        ].map((card) => (
          <motion.div key={card.label} variants={item}>
            <GlassCard glow={card.glow} hover className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{card.label}</span>
                <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center`}>{card.icon}</div>
              </div>
              <p className="text-2xl font-bold text-white font-display leading-none">
                ₹<CountUp end={Number(card.value)} decimals={0} duration={1.4} separator="," />
              </p>
              <p className="text-[10px] text-zinc-500 mt-2">{card.note}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* ── AI Insight + Quote ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-5">
              <Brain className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">AI Financial Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Health Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" className="fill-none stroke-white/5" strokeWidth="8" />
                    <circle cx="48" cy="48" r="40" className="fill-none stroke-blue-500 transition-all duration-1000"
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - healthScore / 100)}`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white font-display">{healthScore}</span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-white mt-2 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-blue-400" /> Financial Health
                </p>
                <p className="text-[10px] text-zinc-500 text-center">Score out of 100</p>
              </div>
              {/* Insights */}
              <div className="md:col-span-2 space-y-3">
                <div className="glass-light p-3.5 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1.5">Spending Alert</p>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {Number(data.monthlyExpense) > Number(data.monthlyIncome) * 0.7
                      ? '⚠️ Your outflows exceed 70% of income. Review non-essential budgets immediately.'
                      : '✅ Spending is well-controlled at under 70% of income. You\'re in a healthy zone.'}
                  </p>
                </div>
                <div className="glass-light p-3.5 rounded-xl border border-white/5">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1.5">Smart Tip</p>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {Number(data.monthlyBalance) > 0
                      ? `You have ₹${Number(data.monthlyBalance).toLocaleString()} surplus this month. Allocate 50% to savings goals.`
                      : 'Expenses exceed income this month. Identify your top spending categories and set budget limits.'}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <Quote className="w-5 h-5 text-purple-400/60" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Daily Mindset</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-white/90 italic font-display flex-1 flex items-center">
              "{quote}"
            </p>
            <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-zinc-500">
              Updated daily for financial clarity
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-5">6-Month Overview</h3>
            {areaData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111113', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(v) => [`₹${v.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2} fill="url(#gIncome)" dot={false} />
                    <Area type="monotone" dataKey="Expense" stroke="#EF4444" strokeWidth={2} fill="url(#gExpense)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center">
                <p className="text-xs text-zinc-500">No transaction history yet</p>
              </div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-5">Spending by Category</h3>
            {pieData.length > 0 ? (
              <>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#111113', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(v) => [`₹${v.toLocaleString()}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                  {data.categoryWiseSpending.slice(0, 6).map(c => (
                    <div key={c.category} className="flex items-center gap-1.5 text-[10px] min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_CONFIG[c.category]?.color || '#94A3B8' }} />
                      <span className="text-zinc-500 truncate">{CATEGORY_CONFIG[c.category]?.label || c.category}</span>
                      <span className="text-white font-semibold ml-auto">{Number(c.percentage).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-xs text-zinc-500">No spending data yet</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Recent Transactions ── */}
      <motion.div variants={item}>
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Recent Transactions</h3>
            <span className="text-[10px] text-zinc-500">Last {data.recentTransactions.length} records</span>
          </div>
          {data.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Description</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {data.recentTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 text-sm text-white font-medium max-w-[160px] truncate">{tx.title}</td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: CATEGORY_CONFIG[tx.category]?.bg || 'rgba(255,255,255,0.05)', color: CATEGORY_CONFIG[tx.category]?.color || '#fff' }}>
                          <span>{CATEGORY_CONFIG[tx.category]?.emoji}</span>
                          <span>{CATEGORY_CONFIG[tx.category]?.label || tx.category}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[11px] text-zinc-500 whitespace-nowrap">{formatDateShort(tx.expenseDate)}</td>
                      <td className={`py-3 text-right text-sm font-bold ${tx.transactionType === 'INCOME' ? 'text-green-400' : 'text-white'}`}>
                        {tx.transactionType === 'INCOME' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-2xl mb-2">💸</p>
              <p className="text-sm text-white font-medium">No transactions yet</p>
              <p className="text-xs text-zinc-500 mt-1">Add your first transaction in the Transactions tab</p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
