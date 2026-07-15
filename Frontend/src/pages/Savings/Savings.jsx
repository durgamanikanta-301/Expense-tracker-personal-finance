import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { savingsService } from '@/services/savingsService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { RowSkeleton } from '@/components/ui/Skeleton'
import { Plus, Pencil, Trash2, PiggyBank, PlusCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateShort, daysUntil } from '@/utils'

const EMOJIS = ['🎯','🏠','✈️','🚗','💻','📱','🎓','💍','🏖️','💰']
const inSixMonths = () => { const d = new Date(); d.setMonth(d.getMonth() + 6); return d.toISOString().split('T')[0] }
const emptyForm = () => ({ name: '', description: '', targetAmount: '', savedAmount: '', deadline: inSixMonths() })

export function Savings() {
  const qc = useQueryClient()
  const [modal, setModal]   = useState(false)
  const [editing, setEdit]  = useState(null)
  const [form, setForm]     = useState(emptyForm())
  const [errs, setErrs]     = useState({})
  const [saving, setSave]   = useState(false)
  const [delId, setDelId]   = useState(null)
  const [contGoal, setContGoal] = useState(null)
  const [contAmt, setContAmt]   = useState('')
  const [contributing, setContributing] = useState(false)

  const { data: goals = [], isLoading } = useQuery({ queryKey: ['savings'], queryFn: savingsService.getAll, staleTime: 15_000 })

  const inv = () => qc.invalidateQueries({ queryKey: ['savings'] })

  const createMut = useMutation({ mutationFn: savingsService.create,           onSuccess: () => { inv(); toast.success('Goal created!'); close() },     onError: () => toast.error('Failed') })
  const updateMut = useMutation({ mutationFn: ({ id, d }) => savingsService.update(id, d), onSuccess: () => { inv(); toast.success('Updated!'); close() }, onError: () => toast.error('Failed') })
  const contMut   = useMutation({ mutationFn: ({ id, a }) => savingsService.addContribution(id, a), onSuccess: () => { inv(); toast.success('Contribution added! 🎉'); setContGoal(null); setContAmt('') }, onError: () => toast.error('Failed') })
  const deleteMut = useMutation({ mutationFn: savingsService.delete,           onSuccess: () => { inv(); toast.success('Deleted'); setDelId(null) },      onError: () => toast.error('Failed') })

  const open = (g = null) => {
    setEdit(g)
    setForm(g ? { name: g.name, description: g.description || '', targetAmount: Number(g.targetAmount), savedAmount: Number(g.savedAmount), deadline: g.deadline } : emptyForm())
    setErrs({}); setModal(true)
  }
  const close = () => { setModal(false); setEdit(null); setForm(emptyForm()); setErrs({}) }
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.targetAmount || Number(form.targetAmount) <= 0) e.targetAmount = 'Target must be > 0'
    if (!form.deadline) e.deadline = 'Deadline is required'
    setErrs(e); return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setSave(true)
    const payload = { ...form, targetAmount: Number(form.targetAmount), savedAmount: Number(form.savedAmount) || 0 }
    try {
      if (editing) await updateMut.mutateAsync({ id: editing.id, d: payload })
      else         await createMut.mutateAsync(payload)
    } finally { setSave(false) }
  }

  const handleContribute = async () => {
    const amount = parseFloat(contAmt)
    if (!amount || amount <= 0) { toast.error('Enter a valid positive amount'); return }
    setContributing(true)
    try { await contMut.mutateAsync({ id: contGoal.id, a: amount }) }
    finally { setContributing(false) }
  }

  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0)
  const totalSaved  = goals.reduce((s, g) => s + Number(g.savedAmount), 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <GlassCard><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Goals</p><p className="text-xl font-bold text-white font-display">{goals.length}</p></GlassCard>
        <GlassCard glow="green"><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Saved</p><p className="text-xl font-bold text-green-400 font-display">₹{totalSaved.toLocaleString()}</p></GlassCard>
        <GlassCard glow="blue"><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Completed</p><p className="text-xl font-bold text-cyan-400 font-display">{goals.filter(g => g.completed).length} / {goals.length}</p></GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Overall Progress</p>
            {totalTarget > 0 && <p className="text-sm text-white mt-0.5 font-medium">₹{totalSaved.toLocaleString()} saved of ₹{totalTarget.toLocaleString()}</p>}
          </div>
          <Button onClick={() => open()} size="sm"><Plus className="w-4 h-4 mr-1" />New Goal</Button>
        </div>
        {totalTarget > 0 && (
          <div className="mt-4">
            <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }} animate={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }} transition={{ duration: 1 }} />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1.5 text-right">{((totalSaved / totalTarget) * 100).toFixed(1)}% achieved</p>
          </div>
        )}
      </GlassCard>

      {isLoading ? (
        <GlassCard><RowSkeleton count={4} /></GlassCard>
      ) : goals.length === 0 ? (
        <GlassCard>
          <div className="py-16 text-center">
            <PiggyBank className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm text-white font-medium">No savings goals yet</p>
            <Button onClick={() => open()} size="sm" className="mt-4"><Plus className="w-4 h-4 mr-1" />Create goal</Button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {goals.map((g, idx) => {
              const pct  = Math.min(g.progressPercentage, 100)
              const days = daysUntil(g.deadline)
              return (
                <motion.div key={g.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <GlassCard hover className={`relative group ${g.completed ? 'border-green-500/30' : ''}`}>
                    {g.completed && <div className="mb-2"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-green-400 bg-green-500/10"><CheckCircle2 className="w-3 h-3" />Completed</span></div>}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!g.completed && <button onClick={() => setContGoal(g)} className="p-1.5 rounded-lg hover:bg-green-500/10 text-zinc-500 hover:text-green-400 transition-colors"><PlusCircle className="w-3.5 h-3.5" /></button>}
                      <button onClick={() => open(g)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDelId(g.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl glass-light border border-white/10 flex items-center justify-center text-2xl shrink-0">{EMOJIS[idx % EMOJIS.length]}</div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">{g.name}</p>{g.description && <p className="text-[10px] text-zinc-500 truncate">{g.description}</p>}</div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="32" cy="32" r="26" className="fill-none stroke-white/5" strokeWidth="5" />
                          <circle cx="32" cy="32" r="26" className="fill-none transition-all duration-1000"
                            stroke={g.completed ? '#10B981' : '#3B82F6'} strokeWidth="5" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 26}`}
                            strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Saved</span><span className="text-green-400 font-semibold">₹{Number(g.savedAmount).toLocaleString()}</span></div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-zinc-500">Target</span><span className="text-white font-semibold">₹{Number(g.targetAmount).toLocaleString()}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-zinc-500">Left</span><span className={`font-semibold ${g.completed ? 'text-green-400' : 'text-zinc-400'}`}>{g.completed ? '✅ Done' : `₹${Number(g.remainingAmount).toLocaleString()}`}</span></div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">Deadline: {formatDateShort(g.deadline)}</span>
                      <span className={`text-[10px] font-medium ${days < 0 ? 'text-red-400' : days <= 30 ? 'text-yellow-400' : 'text-zinc-500'}`}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today!' : `${days}d left`}
                      </span>
                    </div>

                    {!g.completed && (
                      <button onClick={() => setContGoal(g)} className="mt-3 w-full py-1.5 rounded-xl glass-light border border-white/10 text-xs font-semibold text-zinc-400 hover:text-green-400 hover:border-green-500/30 transition-all">
                        + Add Contribution
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
      <Modal isOpen={modal} onClose={close} title={editing ? 'Edit Goal' : 'New Savings Goal'}>
        <div className="space-y-4">
          <Input label="Goal Name *" placeholder="e.g. Emergency Fund, Trip to Goa" value={form.name} onChange={set('name')} error={errs.name} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Target Amount (₹) *" type="number" min="1" placeholder="50000" value={form.targetAmount} onChange={set('targetAmount')} error={errs.targetAmount} />
            <Input label="Already Saved (₹)" type="number" min="0" placeholder="0" value={form.savedAmount} onChange={set('savedAmount')} />
          </div>
          <Input label="Deadline *" type="date" value={form.deadline} onChange={set('deadline')} error={errs.deadline} />
          <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-400">Description (optional)</label>
            <textarea rows={2} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none resize-none"
              placeholder="What are you saving for?" value={form.description} onChange={set('description')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={submit} isLoading={saving} className="flex-1">{editing ? 'Save Changes' : 'Create Goal'}</Button>
          </div>
        </div>
      </Modal>

      {/* Contribute Modal */}
      <Modal isOpen={contGoal !== null} onClose={() => { setContGoal(null); setContAmt('') }} title={`Add to: ${contGoal?.name}`}>
        <div className="space-y-4">
          <div className="glass-light rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between text-sm mb-2"><span className="text-zinc-500">Current saved</span><span className="text-white font-semibold">₹{Number(contGoal?.savedAmount ?? 0).toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Still needed</span><span className="text-green-400 font-semibold">₹{Number(contGoal?.remainingAmount ?? 0).toLocaleString()}</span></div>
          </div>
          <Input label="Contribution Amount (₹) *" type="number" min="0.01" placeholder="5000" value={contAmt} onChange={e => setContAmt(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setContGoal(null); setContAmt('') }} className="flex-1">Cancel</Button>
            <Button onClick={handleContribute} isLoading={contributing} className="flex-1">Add Contribution</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={delId !== null} onClose={() => setDelId(null)} title="Delete Goal">
        <div className="text-center space-y-4">
          <p className="text-3xl">🗑️</p>
          <p className="text-sm text-white/90">Delete this savings goal permanently?</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => delId && deleteMut.mutate(delId)} isLoading={deleteMut.isPending} className="flex-1 !bg-red-500/20 !border-red-500/30 !text-red-400">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
