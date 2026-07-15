import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expenseService } from '@/services/expenseService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { RowSkeleton } from '@/components/ui/Skeleton'
import { CATEGORY_CONFIG, CATEGORIES } from '@/constants'
import { Plus, Search, Pencil, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateShort } from '@/utils'

const emptyForm = () => ({
  title: '', amount: '', category: 'OTHER', transactionType: 'EXPENSE',
  description: '', expenseDate: new Date().toISOString().split('T')[0],
})

export function Expenses() {
  const qc = useQueryClient()
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(emptyForm())
  const [errs, setErrs]       = useState({})
  const [saving, setSaving]   = useState(false)
  const [delId, setDelId]     = useState(null)
  const [search, setSearch]   = useState('')
  const [typeFilter, setTypeFilter]     = useState('ALL')
  const [catFilter, setCatFilter]       = useState('ALL')

  const { data: expenses = [], isLoading } = useQuery({ queryKey: ['expenses'], queryFn: expenseService.getAll, staleTime: 15_000 })

  const invalidate = () => { qc.invalidateQueries({ queryKey: ['expenses'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }) }

  const createMut = useMutation({ mutationFn: expenseService.create, onSuccess: () => { invalidate(); toast.success('Transaction added!'); close() }, onError: () => toast.error('Failed to add') })
  const updateMut = useMutation({ mutationFn: ({ id, data }) => expenseService.update(id, data), onSuccess: () => { invalidate(); toast.success('Updated!'); close() }, onError: () => toast.error('Failed to update') })
  const deleteMut = useMutation({ mutationFn: expenseService.delete, onSuccess: () => { invalidate(); toast.success('Deleted'); setDelId(null) }, onError: () => toast.error('Failed to delete') })

  const filtered = useMemo(() => expenses.filter(e => {
    const mT = typeFilter === 'ALL' || e.transactionType === typeFilter
    const mC = catFilter === 'ALL' || e.category === catFilter
    const mS = !search || e.title.toLowerCase().includes(search.toLowerCase())
    return mT && mC && mS
  }), [expenses, typeFilter, catFilter, search])

  const totalIncome  = useMemo(() => expenses.filter(e => e.transactionType === 'INCOME').reduce((s, e) => s + Number(e.amount), 0), [expenses])
  const totalExpense = useMemo(() => expenses.filter(e => e.transactionType === 'EXPENSE').reduce((s, e) => s + Number(e.amount), 0), [expenses])

  const open = (exp = null) => {
    setEditing(exp)
    setForm(exp ? { title: exp.title, amount: Number(exp.amount), category: exp.category, transactionType: exp.transactionType, description: exp.description || '', expenseDate: exp.expenseDate } : emptyForm())
    setErrs({})
    setModal(true)
  }
  const close = () => { setModal(false); setEditing(null); setForm(emptyForm()); setErrs({}) }
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be > 0'
    if (!form.expenseDate) e.expenseDate = 'Date is required'
    setErrs(e); return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = { ...form, amount: Number(form.amount) }
    try {
      if (editing) await updateMut.mutateAsync({ id: editing.id, data: payload })
      else         await createMut.mutateAsync(payload)
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Income</p><p className="text-xl font-bold text-green-400 font-display">₹{totalIncome.toLocaleString()}</p></GlassCard>
        <GlassCard><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Expenses</p><p className="text-xl font-bold text-red-400 font-display">₹{totalExpense.toLocaleString()}</p></GlassCard>
        <GlassCard glow="blue"><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Net Balance</p><p className={`text-xl font-bold font-display ${totalIncome - totalExpense >= 0 ? 'text-green-400' : 'text-red-400'}`}>₹{Math.abs(totalIncome - totalExpense).toLocaleString()}</p></GlassCard>
      </div>

      {/* Toolbar */}
      <GlassCard>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/40"
              placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 p-1 glass-light rounded-xl border border-white/5">
            {['ALL', 'INCOME', 'EXPENSE'].map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${typeFilter === f ? 'bg-blue-500 text-white shadow-glow-blue' : 'text-zinc-400 hover:text-white'}`}>
                {f === 'ALL' ? 'All' : f === 'INCOME' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>
          <select className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400 focus:outline-none"
            value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>)}
          </select>
          <Button onClick={() => open()} size="sm"><Plus className="w-4 h-4 mr-1" />Add</Button>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard>
        {isLoading ? <RowSkeleton count={6} /> : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl mb-3">💸</p>
            <p className="text-sm text-white font-medium">{expenses.length === 0 ? 'No transactions yet' : 'No results match your filter'}</p>
            {expenses.length === 0 && <Button onClick={() => open()} size="sm" className="mt-4"><Plus className="w-4 h-4 mr-1" />Add your first transaction</Button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Transaction</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4 text-right">Amount</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                <AnimatePresence>
                  {filtered.map(tx => (
                    <motion.tr key={tx.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 pr-4">
                        <p className="text-sm text-white font-medium max-w-[180px] truncate">{tx.title}</p>
                        {tx.description && <p className="text-[10px] text-zinc-500 truncate max-w-[180px]">{tx.description}</p>}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: CATEGORY_CONFIG[tx.category]?.bg, color: CATEGORY_CONFIG[tx.category]?.color }}>
                          <span>{CATEGORY_CONFIG[tx.category]?.emoji}</span>
                          <span>{CATEGORY_CONFIG[tx.category]?.label || tx.category}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${tx.transactionType === 'INCOME' ? 'text-green-400' : 'text-zinc-400'}`}>
                          {tx.transactionType === 'INCOME' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[11px] text-zinc-500 whitespace-nowrap">{formatDateShort(tx.expenseDate)}</td>
                      <td className={`py-3 pr-4 text-right text-sm font-bold ${tx.transactionType === 'INCOME' ? 'text-green-400' : 'text-white'}`}>
                        {tx.transactionType === 'INCOME' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => open(tx)} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDelId(tx.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Create/Edit Modal */}
      <Modal isOpen={modal} onClose={close} title={editing ? 'Edit Transaction' : 'Add Transaction'}>
        <div className="space-y-4">
          <Input label="Title *" placeholder="e.g. Monthly salary, Zomato order" value={form.title} onChange={set('title')} error={errs.title} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount (₹) *" type="number" min="0.01" step="0.01" placeholder="5000" value={form.amount} onChange={set('amount')} error={errs.amount} />
            <Input label="Date *" type="date" value={form.expenseDate} onChange={set('expenseDate')} error={errs.expenseDate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Category *</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/40" value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Type *</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/40" value={form.transactionType} onChange={set('transactionType')}>
                <option value="EXPENSE">↓ Expense</option>
                <option value="INCOME">↑ Income</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Description (optional)</label>
            <textarea rows={2} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/40 resize-none"
              placeholder="Additional details..." value={form.description} onChange={set('description')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={submit} isLoading={saving} className="flex-1">{editing ? 'Save Changes' : 'Add Transaction'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={delId !== null} onClose={() => setDelId(null)} title="Delete Transaction">
        <div className="text-center space-y-4">
          <p className="text-3xl">🗑️</p>
          <p className="text-sm text-white/90">Delete this transaction? This cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => delId && deleteMut.mutate(delId)} isLoading={deleteMut.isPending} className="flex-1 !bg-red-500/20 !border-red-500/30 !text-red-400">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
