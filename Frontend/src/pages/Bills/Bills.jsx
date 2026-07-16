import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billService } from '@/services/billService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { CardGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_CONFIG, CATEGORIES, FREQUENCIES } from '@/constants'
import { Plus, Pencil, Trash2, CheckCircle2, Clock, AlertTriangle, Zap, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateShort, daysUntil, formatCurrency } from '@/utils'
import { resolveIntelligentCategory, cleanDescription, getCategoryConfig } from '@/services/merchantService'
import CountUp from 'react-countup'

const nextMonth = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] }
const emptyForm = () => ({
  name: '', amount: '', category: 'Other', frequency: 'MONTHLY',
  nextDueDate: nextMonth(), autoDebit: false, reminderDays: 3, description: '',
})

const selectCls = 'w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all'
const labelCls  = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5'

export function Bills() {
  const qc = useQueryClient()
  const [tab, setTab]       = useState('ALL')
  const [modal, setModal]   = useState(false)
  const [editing, setEdit]  = useState(null)
  const [form, setForm]     = useState(emptyForm())
  const [errs, setErrs]     = useState({})
  const [saving, setSave]   = useState(false)
  const [delId, setDelId]   = useState(null)

  const { data: allBills  = [], isLoading: la  } = useQuery({ queryKey: ['bills', 'all'],     queryFn: billService.getAll,             enabled: tab === 'ALL',      staleTime: 15_000 })
  const { data: unpaid    = [], isLoading: lu  } = useQuery({ queryKey: ['bills', 'unpaid'],  queryFn: billService.getUnpaid,          enabled: tab === 'UNPAID',   staleTime: 15_000 })
  const { data: upcoming  = [], isLoading: lup } = useQuery({ queryKey: ['bills', 'upcoming'],queryFn: () => billService.getUpcoming(30), enabled: tab === 'UPCOMING', staleTime: 15_000 })

  const bills     = tab === 'ALL' ? allBills : tab === 'UNPAID' ? unpaid : upcoming
  const isLoading = tab === 'ALL' ? la : tab === 'UNPAID' ? lu : lup

  const inv = () => { qc.invalidateQueries({ queryKey: ['bills'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }) }

  const createMut = useMutation({ mutationFn: billService.create,                     onSuccess: () => { inv(); toast.success('Bill created!'); close() },        onError: () => toast.error('Failed to create bill') })
  const updateMut = useMutation({ mutationFn: ({ id, d }) => billService.update(id, d), onSuccess: () => { inv(); toast.success('Bill updated!'); close() },      onError: () => toast.error('Failed to update') })
  const paidMut   = useMutation({ mutationFn: billService.markAsPaid,                 onSuccess: () => { inv(); toast.success('Marked as paid ✅') },               onError: () => toast.error('Failed to update') })
  const deleteMut = useMutation({ mutationFn: billService.delete,                     onSuccess: () => { inv(); toast.success('Bill deleted'); setDelId(null) },   onError: () => toast.error('Failed to delete') })

  const open = (b = null) => {
    setEdit(b)
    if (b) {
      const intCat = resolveIntelligentCategory({ description: b.description, category: b.category, title: b.name })
      setForm({ name: b.name, amount: Number(b.amount), category: intCat, frequency: b.frequency, nextDueDate: b.nextDueDate, autoDebit: b.autoDebit, reminderDays: b.reminderDays ?? 3, description: cleanDescription(b.description) || '' })
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
    if (!form.name.trim()) e.name = 'Bill name is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be > 0'
    if (!form.nextDueDate) e.nextDueDate = 'Due date is required'
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
    
    const payload = { ...form, amount: Number(form.amount), reminderDays: Number(form.reminderDays) || 0, category: backendCategory, description: finalDesc }
    
    try {
      if (editing) await updateMut.mutateAsync({ id: editing.id, d: payload })
      else         await createMut.mutateAsync(payload)
    } finally { setSave(false) }
  }

  const totalUnpaid  = allBills.filter(b => !b.paid).reduce((s, b) => s + Number(b.amount), 0)
  const overdueCount = allBills.filter(b => b.overdue).length
  const paidCount    = allBills.filter(b => b.paid).length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title="Bills" subtitle={`${allBills.length} total — ${paidCount} paid`}>
        <Button onClick={() => open()} size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add Bill
        </Button>
      </PageHeader>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard hover>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Bills</p>
          <p className="text-xl font-bold text-white font-display">
            <CountUp end={allBills.length} duration={0.8} preserveValue />
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">{paidCount} paid</p>
        </GlassCard>

        <GlassCard hover>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Unpaid Amount</p>
          <p className="text-xl font-bold text-red-400 font-display tabular-nums">
            ₹<CountUp end={totalUnpaid} duration={0.8} separator="," preserveValue />
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">{allBills.filter(b => !b.paid).length} bills pending</p>
        </GlassCard>

        <GlassCard hover glow={overdueCount > 0 ? 'none' : 'green'}
          className={overdueCount > 0 ? 'border-red-500/20' : ''}
        >
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Overdue</p>
          <p className={`text-xl font-bold font-display ${overdueCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {overdueCount > 0 ? overdueCount : '✓ None'}
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">
            {overdueCount > 0 ? 'immediate attention needed' : 'All bills up to date'}
          </p>
        </GlassCard>
      </div>

      {/* Tab bar */}
      <GlassCard>
        <div className="flex items-center gap-0.5 p-1 glass-light rounded-xl border border-white/[0.06] w-fit">
          {[
            { id: 'ALL',      label: 'All Bills' },
            { id: 'UNPAID',   label: 'Unpaid' },
            { id: 'UPCOMING', label: 'Next 30 Days' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === t.id ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Bill cards */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : bills.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={<Receipt className="w-7 h-7" />}
            title={tab === 'ALL' ? 'No bills yet' : tab === 'UNPAID' ? 'No unpaid bills 🎉' : 'No upcoming bills'}
            description={
              tab === 'ALL'
                ? 'Track your recurring bills and never miss a payment again.'
                : tab === 'UNPAID'
                ? 'All your bills are paid up! Great job.'
                : 'No bills due in the next 30 days.'
            }
            action={tab === 'ALL' ? () => open() : null}
            actionLabel="Add your first bill"
            actionIcon={<Plus className="w-3.5 h-3.5" />}
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {bills.map(bill => {
              const intCat = resolveIntelligentCategory({ description: bill.description, category: bill.category, title: bill.name })
              const cfg   = getCategoryConfig(intCat)
              const days  = daysUntil(bill.nextDueDate)
              const urgent = !bill.paid && days <= 3 && !bill.overdue

              return (
                <motion.div
                  key={bill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <GlassCard
                    hover
                    className={`relative group h-full flex flex-col ${
                      bill.overdue ? 'border-red-500/25' : urgent ? 'border-yellow-500/20' : ''
                    }`}
                  >
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {!bill.paid && (
                        <button
                          onClick={() => paidMut.mutate(bill.id)}
                          className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-400 transition-colors"
                          title="Mark as Paid"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => open(bill)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDelId(bill.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: cfg?.bg || 'rgba(255,255,255,0.05)' }}
                      >
                        {cfg?.emoji || '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-white truncate">{bill.name}</p>
                          {bill.autoDebit && <Zap className="w-3 h-3 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-zinc-500">{intCat} • {bill.frequency}</p>
                      </div>
                    </div>

                    {/* Amount + status */}
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <p className="text-lg font-bold text-white font-display tabular-nums">
                          {formatCurrency(bill.amount)}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Due: {formatDateShort(bill.nextDueDate)}</p>
                      </div>

                      <div>
                        {bill.paid ? (
                          <Badge variant="green" dot>Paid</Badge>
                        ) : bill.overdue ? (
                          <Badge variant="red" dot>Overdue</Badge>
                        ) : urgent ? (
                          <Badge variant="yellow" dot>
                            {days === 0 ? 'Due Today' : `${days}d left`}
                          </Badge>
                        ) : (
                          <Badge variant="default" dot>
                            <Clock className="w-2.5 h-2.5" />
                            {days}d left
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Overdue banner */}
                    {bill.overdue && (
                      <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <p className="text-[11px] text-red-400 font-medium">Payment overdue</p>
                      </div>
                    )}

                    {/* Mark paid CTA */}
                    {!bill.paid && (
                      <button
                        onClick={() => paidMut.mutate(bill.id)}
                        className="mt-3 w-full py-2 rounded-xl glass-medium border border-white/[0.07] text-xs font-semibold text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] transition-all"
                      >
                        ✓ Mark as Paid
                      </button>
                    )}
                  </GlassCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modal} onClose={close} title={editing ? 'Edit Bill' : 'Add Bill'}>
        <div className="space-y-4">
          <Input label="Bill Name *" placeholder="e.g. Netflix, Electricity" value={form.name} onChange={set('name')} error={errs.name} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount (₹) *" type="number" min="0.01" placeholder="999" value={form.amount} onChange={set('amount')} error={errs.amount} />
            <Input label="Next Due Date *" type="date" value={form.nextDueDate} onChange={set('nextDueDate')} error={errs.nextDueDate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <select className={selectCls} value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Frequency *</label>
              <select className={selectCls} value={form.frequency} onChange={set('frequency')}>
                {FREQUENCIES.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Reminder Days" type="number" min="0" max="30" placeholder="3" value={form.reminderDays} onChange={set('reminderDays')} hint="Days before due date" />
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(p => ({ ...p, autoDebit: !p.autoDebit }))}
                  className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${form.autoDebit ? 'bg-blue-500 shadow-glow-blue' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.autoDebit ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-300">Auto Debit</p>
                  <p className="text-[10px] text-zinc-600">Mark if auto-paid</p>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description (optional)</label>
            <textarea rows={2} className={`${selectCls} resize-none`} value={form.description} onChange={set('description')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={submit} isLoading={saving} className="flex-1">{editing ? 'Save Changes' : 'Add Bill'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={delId !== null} onClose={() => setDelId(null)} title="Delete Bill" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Delete this bill?</p>
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
