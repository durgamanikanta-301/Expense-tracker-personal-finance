import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billService } from '@/services/billService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { RowSkeleton } from '@/components/ui/Skeleton'
import { CATEGORY_CONFIG, CATEGORIES, FREQUENCIES } from '@/constants'
import { Plus, Pencil, Trash2, CheckCircle2, Clock, AlertTriangle, Zap, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateShort, daysUntil } from '@/utils'

const nextMonth = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] }
const emptyForm = () => ({ name: '', amount: '', category: 'UTILITIES', frequency: 'MONTHLY', nextDueDate: nextMonth(), autoDebit: false, reminderDays: 3, description: '' })

export function Bills() {
  const qc = useQueryClient()
  const [tab, setTab]     = useState('ALL')
  const [modal, setModal] = useState(false)
  const [editing, setEdit] = useState(null)
  const [form, setForm]   = useState(emptyForm())
  const [errs, setErrs]   = useState({})
  const [saving, setSave] = useState(false)
  const [delId, setDelId] = useState(null)

  const { data: allBills = [], isLoading: la } = useQuery({ queryKey: ['bills','all'],      queryFn: billService.getAll,               enabled: tab === 'ALL',      staleTime: 15_000 })
  const { data: unpaid  = [], isLoading: lu }  = useQuery({ queryKey: ['bills','unpaid'],   queryFn: billService.getUnpaid,            enabled: tab === 'UNPAID',   staleTime: 15_000 })
  const { data: upcoming= [], isLoading: lup } = useQuery({ queryKey: ['bills','upcoming'], queryFn: () => billService.getUpcoming(30),enabled: tab === 'UPCOMING', staleTime: 15_000 })

  const bills = tab === 'ALL' ? allBills : tab === 'UNPAID' ? unpaid : upcoming
  const isLoading = tab === 'ALL' ? la : tab === 'UNPAID' ? lu : lup

  const inv = () => { qc.invalidateQueries({ queryKey: ['bills'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }) }

  const createMut  = useMutation({ mutationFn: billService.create,    onSuccess: () => { inv(); toast.success('Bill created!'); close() },        onError: () => toast.error('Failed') })
  const updateMut  = useMutation({ mutationFn: ({ id, d }) => billService.update(id, d), onSuccess: () => { inv(); toast.success('Updated!'); close() }, onError: () => toast.error('Failed') })
  const paidMut    = useMutation({ mutationFn: billService.markAsPaid, onSuccess: () => { inv(); toast.success('Marked as paid ✅') },              onError: () => toast.error('Failed') })
  const deleteMut  = useMutation({ mutationFn: billService.delete,     onSuccess: () => { inv(); toast.success('Deleted'); setDelId(null) },         onError: () => toast.error('Failed') })

  const open = (b = null) => {
    setEdit(b)
    setForm(b ? { name: b.name, amount: Number(b.amount), category: b.category, frequency: b.frequency, nextDueDate: b.nextDueDate, autoDebit: b.autoDebit, reminderDays: b.reminderDays ?? 3, description: b.description || '' } : emptyForm())
    setErrs({}); setModal(true)
  }
  const close = () => { setModal(false); setEdit(null); setForm(emptyForm()); setErrs({}) }
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Bill name is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be > 0'
    if (!form.nextDueDate) e.nextDueDate = 'Due date is required'
    setErrs(e); return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setSave(true)
    const payload = { ...form, amount: Number(form.amount), reminderDays: Number(form.reminderDays) || 0 }
    try {
      if (editing) await updateMut.mutateAsync({ id: editing.id, d: payload })
      else         await createMut.mutateAsync(payload)
    } finally { setSave(false) }
  }

  const totalUnpaid = allBills.filter(b => !b.paid).reduce((s, b) => s + Number(b.amount), 0)
  const overdueCount = allBills.filter(b => b.overdue).length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <GlassCard><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Bills</p><p className="text-xl font-bold text-white font-display">{allBills.length}</p></GlassCard>
        <GlassCard><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Unpaid Amount</p><p className="text-xl font-bold text-red-400 font-display">₹{totalUnpaid.toLocaleString()}</p></GlassCard>
        <GlassCard><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Overdue</p><p className={`text-xl font-bold font-display ${overdueCount > 0 ? 'text-red-400' : 'text-green-400'}`}>{overdueCount > 0 ? `${overdueCount} bills` : 'None 🎉'}</p></GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 glass-light rounded-xl border border-white/5">
            {['ALL', 'UNPAID', 'UPCOMING'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === t ? 'bg-blue-500 text-white shadow-glow-blue' : 'text-zinc-400 hover:text-white'}`}>
                {t === 'UPCOMING' ? 'Next 30 Days' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <Button onClick={() => open()} size="sm"><Plus className="w-4 h-4 mr-1" />Add Bill</Button>
        </div>
      </GlassCard>

      {isLoading ? (
        <GlassCard><RowSkeleton count={4} /></GlassCard>
      ) : bills.length === 0 ? (
        <GlassCard>
          <div className="py-16 text-center">
            <Receipt className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm text-white font-medium">No bills found</p>
            <Button onClick={() => open()} size="sm" className="mt-4"><Plus className="w-4 h-4 mr-1" />Add your first bill</Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {bills.map(bill => {
              const cfg  = CATEGORY_CONFIG[bill.category]
              const days = daysUntil(bill.nextDueDate)
              const urgent = !bill.paid && days <= 3
              return (
                <motion.div key={bill.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <GlassCard hover className={`relative group ${bill.overdue ? 'border-red-500/30' : ''}`}>
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!bill.paid && <button onClick={() => paidMut.mutate(bill.id)} className="p-1.5 rounded-lg hover:bg-green-500/10 text-zinc-500 hover:text-green-400 transition-colors" title="Mark Paid"><CheckCircle2 className="w-3.5 h-3.5" /></button>}
                      <button onClick={() => open(bill)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDelId(bill.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: cfg?.bg }}>{cfg?.emoji || '📄'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">{bill.name}</p>
                          {bill.autoDebit && <Zap className="w-3 h-3 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-zinc-500">{cfg?.label || bill.category} • {bill.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-white font-display">₹{Number(bill.amount).toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Due: {formatDateShort(bill.nextDueDate)}</p>
                      </div>
                      <div>
                        {bill.paid
                          ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-green-400 bg-green-500/10"><CheckCircle2 className="w-3 h-3" />Paid</span>
                          : bill.overdue
                          ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-red-400 bg-red-500/10"><AlertTriangle className="w-3 h-3" />Overdue</span>
                          : <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${urgent ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400 bg-white/5'}`}><Clock className="w-3 h-3" />{days === 0 ? 'Today' : `${days}d left`}</span>
                        }
                      </div>
                    </div>
                    {!bill.paid && (
                      <button onClick={() => paidMut.mutate(bill.id)} className="mt-3 w-full py-1.5 rounded-xl glass-light border border-white/10 text-xs font-semibold text-zinc-400 hover:text-green-400 hover:border-green-500/30 transition-all">
                        Mark as Paid
                      </button>
                    )}
                  </GlassCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={modal} onClose={close} title={editing ? 'Edit Bill' : 'Add Bill'}>
        <div className="space-y-4">
          <Input label="Bill Name *" placeholder="e.g. Netflix, Electricity" value={form.name} onChange={set('name')} error={errs.name} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount (₹) *" type="number" min="0.01" placeholder="999" value={form.amount} onChange={set('amount')} error={errs.amount} />
            <Input label="Next Due Date *" type="date" value={form.nextDueDate} onChange={set('nextDueDate')} error={errs.nextDueDate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400">Category *</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400">Frequency *</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none" value={form.frequency} onChange={set('frequency')}>
                {FREQUENCIES.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Reminder Days" type="number" min="0" max="30" placeholder="3" value={form.reminderDays} onChange={set('reminderDays')} />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => setForm(p => ({ ...p, autoDebit: !p.autoDebit }))}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.autoDebit ? 'bg-blue-500' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.autoDebit ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-zinc-400">Auto Debit</span>
              </label>
            </div>
          </div>
          <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400">Description (optional)</label>
            <textarea rows={2} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none resize-none" value={form.description} onChange={set('description')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={submit} isLoading={saving} className="flex-1">{editing ? 'Save Changes' : 'Add Bill'}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={delId !== null} onClose={() => setDelId(null)} title="Delete Bill">
        <div className="text-center space-y-4">
          <p className="text-3xl">🗑️</p>
          <p className="text-sm text-white/90">Delete this bill permanently?</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => delId && deleteMut.mutate(delId)} isLoading={deleteMut.isPending} className="flex-1 !bg-red-500/20 !border-red-500/30 !text-red-400">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
