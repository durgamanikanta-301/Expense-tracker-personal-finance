import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '@/services/budgetService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { CardGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_CONFIG, CATEGORIES, MONTHS } from '@/constants'
import { Plus, Pencil, Trash2, AlertTriangle, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@/utils'
import { resolveIntelligentCategory, cleanDescription, getCategoryConfig } from '@/services/merchantService'

const now = new Date()
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]

const emptyForm = () => ({
  name: '', category: 'Other', budgetAmount: '',
  budgetYear: now.getFullYear(), budgetMonth: now.getMonth() + 1, description: '',
})

const selectCls = 'w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all'
const labelCls  = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5'

export function Budgets() {
  const qc = useQueryClient()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear]   = useState(now.getFullYear())
  const [modal, setModal] = useState(false)
  const [editing, setEdit] = useState(null)
  const [form, setForm]   = useState(emptyForm())
  const [errs, setErrs]   = useState({})
  const [saving, setSave] = useState(false)
  const [delId, setDelId] = useState(null)

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => budgetService.getByPeriod(month, year),
    staleTime: 15_000,
  })

  const inv = () => qc.invalidateQueries({ queryKey: ['budgets'] })
  const createMut = useMutation({ mutationFn: budgetService.create,                   onSuccess: () => { inv(); toast.success('Budget created!'); close() }, onError: () => toast.error('Failed to create budget') })
  const updateMut = useMutation({ mutationFn: ({ id, d }) => budgetService.update(id, d), onSuccess: () => { inv(); toast.success('Budget updated!'); close() }, onError: () => toast.error('Failed to update') })
  const deleteMut = useMutation({ mutationFn: budgetService.delete,                   onSuccess: () => { inv(); toast.success('Budget deleted'); setDelId(null) }, onError: () => toast.error('Failed to delete') })

  const open = (b = null) => {
    setEdit(b)
    if (b) {
      const intCat = resolveIntelligentCategory({ description: b.description, category: b.category, title: b.name })
      setForm({ name: b.name, category: intCat, budgetAmount: Number(b.budgetAmount), budgetYear: b.budgetYear, budgetMonth: b.budgetMonth, description: cleanDescription(b.description) || '' })
    } else {
      setForm(emptyForm())
    }
    setErrs({})
    setModal(true)
  }
  const close = () => { setModal(false); setEdit(null); setForm(emptyForm()); setErrs({}) }
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Budget name is required'
    if (!form.budgetAmount || Number(form.budgetAmount) <= 0) e.budgetAmount = 'Amount must be > 0'
    setErrs(e)
    return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setSave(true)
    
    const config = getCategoryConfig(form.category)
    const backendCategory = config.backendEnum || 'OTHER'
    let finalDesc = form.description ? form.description.replace(/\[cat:.+?\]/g, '').trim() : ''
    finalDesc = finalDesc ? `${finalDesc} [cat:${form.category}]` : `[cat:${form.category}]`
    
    const payload = { ...form, budgetAmount: Number(form.budgetAmount), budgetYear: Number(form.budgetYear), budgetMonth: Number(form.budgetMonth), category: backendCategory, description: finalDesc }
    try {
      if (editing) await updateMut.mutateAsync({ id: editing.id, d: payload })
      else         await createMut.mutateAsync(payload)
    } finally { setSave(false) }
  }

  const totalBudgeted = budgets.reduce((s, b) => s + Number(b.budgetAmount), 0)
  const totalSpent    = budgets.reduce((s, b) => s + Number(b.spentAmount), 0)
  const overallPct    = totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0
  const exceededCount = budgets.filter(b => b.exceeded).length
  const monthLabel    = MONTHS[month - 1]?.l

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title="Budgets" subtitle={`${monthLabel} ${year} — ${budgets.length} budgets`}>
        <Button onClick={() => open()} size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          New Budget
        </Button>
      </PageHeader>

      {/* Period selector + overall */}
      <GlassCard>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none cursor-pointer"
            >
              {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
            </select>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none cursor-pointer"
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {exceededCount > 0 && (
              <Badge variant="red" dot>{exceededCount} over budget</Badge>
            )}
          </div>

          {budgets.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-zinc-500">
                {formatCurrency(totalSpent)} <span className="text-zinc-700">/ {formatCurrency(totalBudgeted)}</span>
              </p>
              <p className={`text-xs font-bold mt-0.5 ${overallPct >= 90 ? 'text-red-400' : overallPct >= 70 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                {overallPct.toFixed(0)}% used
              </p>
            </div>
          )}
        </div>

        {budgets.length > 0 && (
          <div className="mt-4 border-t border-white/[0.05] pt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-zinc-600 mb-1">
              <span>Overall budget utilization</span>
              <span className={overallPct >= 90 ? 'text-red-400' : overallPct >= 70 ? 'text-yellow-400' : 'text-emerald-400'}>
                {overallPct.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${overallPct >= 90 ? 'bg-red-500' : overallPct >= 70 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Budget cards */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : budgets.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<TrendingDown className="w-7 h-7" />}
            title="No budgets for this period"
            description={`Create your first budget for ${monthLabel} ${year} to start tracking your spending limits.`}
            action={() => open()}
            actionLabel="Create budget"
            actionIcon={<Plus className="w-3.5 h-3.5" />}
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {budgets.map(b => {
              const pct = Number(b.budgetAmount) > 0
                ? Math.min((Number(b.spentAmount) / Number(b.budgetAmount)) * 100, 100)
                : 0
              const barColor = b.exceeded ? '#EF4444' : pct >= 80 ? '#F59E0B' : '#10B981'
              const intCat = resolveIntelligentCategory({ description: b.description, category: b.category, title: b.name })
              const cfg = getCategoryConfig(intCat)

              return (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard
                    hover
                    className={`relative group h-full flex flex-col ${b.exceeded ? 'border-red-500/20' : ''}`}
                  >
                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={() => open(b)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDelId(b.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: cfg?.bg || 'rgba(255,255,255,0.05)' }}
                      >
                        {cfg?.emoji || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{b.name}</p>
                        <p className="text-[10px] text-zinc-500">{intCat} • {MONTHS[b.budgetMonth - 1]?.l} {b.budgetYear}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-500">
                          {formatCurrency(b.spentAmount)} <span className="text-zinc-700">spent</span>
                        </span>
                        <span className="text-white font-semibold">{formatCurrency(b.budgetAmount)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: barColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${b.exceeded ? 'text-red-400' : 'text-zinc-500'}`}>
                          {b.exceeded ? `Overspent by ${formatCurrency(Math.abs(Number(b.remainingAmount)))}` : `${formatCurrency(b.remainingAmount)} remaining`}
                        </span>
                        <span className="text-xs font-bold" style={{ color: barColor }}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Exceeded alert */}
                    {b.exceeded && (
                      <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <p className="text-[11px] text-red-400 font-medium">Budget exceeded</p>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modal} onClose={close} title={editing ? 'Edit Budget' : 'New Budget'}>
        <div className="space-y-4">
          <Input label="Budget Name *" placeholder="e.g. Groceries, Entertainment" value={form.name} onChange={set('name')} error={errs.name} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <select className={selectCls} value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {c}</option>)}
              </select>
            </div>
            <Input label="Amount (₹) *" type="number" min="1" placeholder="10000" value={form.budgetAmount} onChange={set('budgetAmount')} error={errs.budgetAmount} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Month</label>
              <select className={selectCls} value={form.budgetMonth} onChange={set('budgetMonth')}>
                {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <select className={selectCls} value={form.budgetYear} onChange={set('budgetYear')}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description (optional)</label>
            <textarea rows={2} className={`${selectCls} resize-none`} value={form.description} onChange={set('description')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={submit} isLoading={saving} className="flex-1">{editing ? 'Save Changes' : 'Create Budget'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={delId !== null} onClose={() => setDelId(null)} title="Delete Budget" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Delete this budget?</p>
            <p className="text-xs text-zinc-500 mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => delId && deleteMut.mutate(delId)} isLoading={deleteMut.isPending} variant="danger" className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
