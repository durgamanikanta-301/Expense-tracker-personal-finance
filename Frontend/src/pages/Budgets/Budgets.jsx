import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService } from '@/services/budgetService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { RowSkeleton } from '@/components/ui/Skeleton'
import { CATEGORY_CONFIG, CATEGORIES, MONTHS } from '@/constants'
import { Plus, Pencil, Trash2, TrendingDown, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const now = new Date()
const YEARS = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]

const emptyForm = () => ({
  name: '', category: 'OTHER', budgetAmount: '', budgetYear: now.getFullYear(),
  budgetMonth: now.getMonth() + 1, description: '',
})

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
  const createMut = useMutation({ mutationFn: budgetService.create, onSuccess: () => { inv(); toast.success('Budget created!'); close() }, onError: () => toast.error('Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, d }) => budgetService.update(id, d), onSuccess: () => { inv(); toast.success('Updated!'); close() }, onError: () => toast.error('Failed') })
  const deleteMut = useMutation({ mutationFn: budgetService.delete, onSuccess: () => { inv(); toast.success('Deleted'); setDelId(null) }, onError: () => toast.error('Failed') })

  const open = (b = null) => {
    setEdit(b)
    setForm(b ? { name: b.name, category: b.category, budgetAmount: Number(b.budgetAmount), budgetYear: b.budgetYear, budgetMonth: b.budgetMonth, description: b.description || '' } : emptyForm())
    setErrs({}); setModal(true)
  }
  const close = () => { setModal(false); setEdit(null); setForm(emptyForm()); setErrs({}) }
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.budgetAmount || Number(form.budgetAmount) <= 0) e.budgetAmount = 'Amount must be > 0'
    setErrs(e); return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setSave(true)
    const payload = { ...form, budgetAmount: Number(form.budgetAmount), budgetYear: Number(form.budgetYear), budgetMonth: Number(form.budgetMonth) }
    try {
      if (editing) await updateMut.mutateAsync({ id: editing.id, d: payload })
      else         await createMut.mutateAsync(payload)
    } finally { setSave(false) }
  }

  const totalBudgeted = budgets.reduce((s, b) => s + Number(b.budgetAmount), 0)
  const totalSpent    = budgets.reduce((s, b) => s + Number(b.spentAmount), 0)
  const overallPct    = totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0

  return (
    <div className="space-y-5">
      {/* Filter + overall progress */}
      <GlassCard>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none">
              {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
            </select>
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <Button onClick={() => open()} size="sm"><Plus className="w-4 h-4 mr-1" />New Budget</Button>
        </div>

        {budgets.length > 0 && (
          <div className="mt-5 border-t border-white/5 pt-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-500">Overall: ₹{totalSpent.toLocaleString()} / ₹{totalBudgeted.toLocaleString()}</span>
              <span className={`font-bold ${overallPct >= 90 ? 'text-red-400' : overallPct >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>{overallPct.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div className={`h-full rounded-full ${overallPct >= 90 ? 'bg-red-500' : overallPct >= 70 ? 'bg-yellow-400' : 'bg-green-500'}`}
                initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Budget cards */}
      {isLoading ? (
        <GlassCard><RowSkeleton count={4} /></GlassCard>
      ) : budgets.length === 0 ? (
        <GlassCard>
          <div className="py-16 text-center">
            <TrendingDown className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm text-white font-medium">No budgets for this period</p>
            <Button onClick={() => open()} size="sm" className="mt-4"><Plus className="w-4 h-4 mr-1" />Create your first budget</Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {budgets.map(b => {
              const pct = Number(b.budgetAmount) > 0 ? Math.min((Number(b.spentAmount) / Number(b.budgetAmount)) * 100, 100) : 0
              const barColor = b.exceeded ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-400' : 'bg-green-500'
              const cfg = CATEGORY_CONFIG[b.category]
              return (
                <motion.div key={b.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <GlassCard hover className="relative group">
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => open(b)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDelId(b.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: cfg?.bg }}>
                        {cfg?.emoji || '📦'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{b.name}</p>
                        <p className="text-[10px] text-zinc-500">{cfg?.label || b.category} • {MONTHS[b.budgetMonth - 1]?.l} {b.budgetYear}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">₹{Number(b.spentAmount).toLocaleString()} spent</span>
                        <span className="text-white font-semibold">₹{Number(b.budgetAmount).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div className={`h-full rounded-full ${barColor}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${b.exceeded ? 'text-red-400' : 'text-zinc-500'}`}>
                          {b.exceeded ? '⚠️ Over budget!' : `₹${Number(b.remainingAmount).toLocaleString()} left`}
                        </span>
                        <span className={`text-xs font-bold ${b.exceeded ? 'text-red-400' : pct >= 80 ? 'text-yellow-400' : 'text-green-400'}`}>{pct.toFixed(0)}%</span>
                      </div>
                    </div>
                    {b.exceeded && (
                      <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <p className="text-[10px] text-red-400">Overspent by ₹{Math.abs(Number(b.remainingAmount)).toLocaleString()}</p>
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
          <Input label="Budget Name *" placeholder="e.g. Groceries" value={form.name} onChange={set('name')} error={errs.name} />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Category *</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>)}
              </select>
            </div>
            <Input label="Budget Amount (₹) *" type="number" min="1" placeholder="10000" value={form.budgetAmount} onChange={set('budgetAmount')} error={errs.budgetAmount} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Month</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none" value={form.budgetMonth} onChange={set('budgetMonth')}>
                {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Year</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none" value={form.budgetYear} onChange={set('budgetYear')}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Description (optional)</label>
            <textarea rows={2} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
              value={form.description} onChange={set('description')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={submit} isLoading={saving} className="flex-1">{editing ? 'Save Changes' : 'Create Budget'}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={delId !== null} onClose={() => setDelId(null)} title="Delete Budget">
        <div className="text-center space-y-4">
          <p className="text-3xl">🗑️</p>
          <p className="text-sm text-white/90">Delete this budget? This cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => delId && deleteMut.mutate(delId)} isLoading={deleteMut.isPending} className="flex-1 !bg-red-500/20 !border-red-500/30 !text-red-400">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
