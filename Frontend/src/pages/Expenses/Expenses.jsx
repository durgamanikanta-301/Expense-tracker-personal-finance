import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expenseService } from '@/services/expenseService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { RowSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { MerchantLogo } from '@/components/ui/MerchantLogo'
import { CATEGORY_CONFIG, CATEGORIES } from '@/constants'
import { Plus, Search, Pencil, Trash2, ArrowUpRight, ArrowDownLeft, Filter, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDateShort, formatCurrency } from '@/utils'
import { resolveIntelligentCategory, cleanDescription, getCategoryConfig, detectMerchant } from '@/services/merchantService'
import CountUp from 'react-countup'

const emptyForm = () => ({
  title: '', amount: '', category: 'Other', transactionType: 'EXPENSE',
  description: '', expenseDate: new Date().toISOString().split('T')[0],
})

/* Shared select class */
const selectCls = 'w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-blue-500/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all'
const labelCls  = 'block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5'

export function Expenses() {
  const qc = useQueryClient()
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(emptyForm())
  const [errs, setErrs]       = useState({})
  const [saving, setSaving]   = useState(false)
  const [delId, setDelId]     = useState(null)
  const [search, setSearch]   = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [catFilter, setCatFilter]   = useState('ALL')
  const [detectedMerchant, setDetectedMerchant] = useState(null)

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getAll,
    staleTime: 15_000,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['expenses'] })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createMut = useMutation({ mutationFn: expenseService.create,       onSuccess: () => { invalidate(); toast.success('Transaction added!'); close() }, onError: () => toast.error('Failed to add') })
  const updateMut = useMutation({ mutationFn: ({ id, data }) => expenseService.update(id, data), onSuccess: () => { invalidate(); toast.success('Updated!'); close() }, onError: () => toast.error('Failed to update') })
  const deleteMut = useMutation({ mutationFn: expenseService.delete,       onSuccess: () => { invalidate(); toast.success('Deleted'); setDelId(null) }, onError: () => toast.error('Failed to delete') })

  const filtered = useMemo(() => expenses.filter(e => {
    const mT = typeFilter === 'ALL' || e.transactionType === typeFilter
    const mC = catFilter === 'ALL' || resolveIntelligentCategory(e) === catFilter
    const mS = !search || e.title.toLowerCase().includes(search.toLowerCase())
    return mT && mC && mS
  }), [expenses, typeFilter, catFilter, search])

  const totalIncome  = useMemo(() => expenses.filter(e => e.transactionType === 'INCOME').reduce((s, e) => s + Number(e.amount), 0), [expenses])
  const totalExpense = useMemo(() => expenses.filter(e => e.transactionType === 'EXPENSE').reduce((s, e) => s + Number(e.amount), 0), [expenses])
  const netBalance   = totalIncome - totalExpense

  const open = (exp = null) => {
    setEditing(exp)
    if (exp) {
      const intCat = resolveIntelligentCategory(exp)
      setForm({ 
        title: exp.title, amount: Number(exp.amount), category: intCat, 
        transactionType: exp.transactionType, description: cleanDescription(exp.description) || '', expenseDate: exp.expenseDate 
      })
    } else {
      setForm(emptyForm())
    }
    setDetectedMerchant(null)
    setErrs({})
    setModal(true)
  }
  const close = () => { setModal(false); setEditing(null); setForm(emptyForm()); setErrs({}); setDetectedMerchant(null) }
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Amount must be > 0'
    if (!form.expenseDate) e.expenseDate = 'Date is required'
    setErrs(e)
    return !Object.keys(e).length
  }

  const submit = async () => {
    if (!validate()) return
    setSaving(true)
    
    const config = getCategoryConfig(form.category)
    const backendCategory = config.backendEnum || 'OTHER'
    let finalDesc = form.description ? form.description.replace(/\[cat:.+?\]/g, '').trim() : ''
    finalDesc = finalDesc ? `${finalDesc} [cat:${form.category}]` : `[cat:${form.category}]`
    
    const payload = { ...form, amount: Number(form.amount), category: backendCategory, description: finalDesc }
    
    try {
      if (editing) await updateMut.mutateAsync({ id: editing.id, data: payload })
      else         await createMut.mutateAsync(payload)
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <PageHeader title="Transactions" subtitle={`${expenses.length} total records`}>
        <Button onClick={() => open()} size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Add Transaction
        </Button>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard glow="green" hover>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Income</p>
          <p className="text-xl font-bold text-emerald-400 font-display tabular-nums">
            ₹<CountUp end={totalIncome} duration={1.0} separator="," preserveValue />
          </p>
        </GlassCard>
        <GlassCard hover>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Expenses</p>
          <p className="text-xl font-bold text-red-400 font-display tabular-nums">
            ₹<CountUp end={totalExpense} duration={1.0} separator="," preserveValue />
          </p>
        </GlassCard>
        <GlassCard glow={netBalance >= 0 ? 'blue' : 'none'} hover>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Net Balance</p>
          <p className={`text-xl font-bold font-display tabular-nums ${netBalance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {netBalance < 0 ? '-' : ''}₹<CountUp end={Math.abs(netBalance)} duration={1.0} separator="," preserveValue />
          </p>
        </GlassCard>
      </div>

      {/* Toolbar */}
      <GlassCard>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.03] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.10)] transition-all"
              placeholder="Search transactions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Type pills */}
          <div className="flex items-center gap-0.5 p-1 glass-light rounded-xl border border-white/[0.06]">
            {['ALL', 'INCOME', 'EXPENSE'].map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === f
                    ? f === 'INCOME'  ? 'bg-emerald-500/20 text-emerald-400'
                    : f === 'EXPENSE' ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'INCOME' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-400 focus:outline-none cursor-pointer"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>)}
          </select>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard noPad>
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Showing {filtered.length} of {expenses.length}
          </h3>
          {(search || typeFilter !== 'ALL' || catFilter !== 'ALL') && (
            <button
              onClick={() => { setSearch(''); setTypeFilter('ALL'); setCatFilter('ALL') }}
              className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <Filter className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {error ? (
          <EmptyState
            icon={<AlertCircle className="w-7 h-7" />}
            title="Failed to load transactions"
            description="Could not reach the backend. Please check your connection."
          />
        ) : isLoading ? (
          <div className="p-5"><RowSkeleton count={6} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            emoji="💸"
            title={expenses.length === 0 ? 'No transactions yet' : 'No results match your filters'}
            description={
              expenses.length === 0
                ? 'Add your first income or expense to get started.'
                : 'Try adjusting your search or filters to find what you\'re looking for.'
            }
            action={expenses.length === 0 ? () => open() : null}
            actionLabel="Add first transaction"
            actionIcon={<Plus className="w-3.5 h-3.5" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.04] text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                  <th className="px-5 py-3">Transaction</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                <AnimatePresence>
                  {filtered.map(tx => {
                    const isIncome = tx.transactionType === 'INCOME'
                    const intCat = resolveIntelligentCategory(tx)
                    const cfg = getCategoryConfig(intCat)
                    const merchant = detectMerchant(tx.title)
                    const displayDesc = cleanDescription(tx.description)
                    return (
                      <motion.tr
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.15 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <MerchantLogo merchant={merchant} name={tx.title} size="md" />
                            <div>
                              <p className="text-sm text-white font-medium leading-none truncate max-w-[140px] lg:max-w-[220px]">
                                {tx.title}
                              </p>
                              {displayDesc && (
                                <p className="text-[10px] text-zinc-600 mt-0.5 truncate max-w-[140px]">
                                  {displayDesc}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: cfg?.bg, color: cfg?.color }}
                          >
                            <span>{cfg?.emoji}</span>
                            <span className="hidden lg:inline">{intCat}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <Badge variant={isIncome ? 'green' : 'default'} dot>
                            {isIncome ? 'Income' : 'Expense'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell text-[11px] text-zinc-500 whitespace-nowrap">
                          {formatDateShort(tx.expenseDate)}
                        </td>
                        <td className={`px-4 py-3.5 text-right text-sm font-bold tabular-nums ${isIncome ? 'text-emerald-400' : 'text-white'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => open(tx)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                              aria-label="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDelId(tx.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Create/Edit Modal */}
      <Modal isOpen={modal} onClose={close} title={editing ? 'Edit Transaction' : 'Add Transaction'}>
        <div className="space-y-4">
          <div className="relative">
            <Input 
              label="Title *" 
              placeholder="e.g. Monthly salary, Zomato order" 
              value={form.title} 
              onChange={e => {
                const val = e.target.value
                set('title')(e)
                const m = detectMerchant(val)
                setDetectedMerchant(m && val.length > 1 ? m : null)
              }} 
              error={errs.title} 
            />
            <AnimatePresence>
              {detectedMerchant && !editing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 top-full mt-2 w-full glass rounded-xl border border-white/[0.08] shadow-elevated p-2 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
                  onClick={() => {
                    setForm(p => ({
                      ...p,
                      title: detectedMerchant.name,
                      category: detectedMerchant.category,
                      description: detectedMerchant.desc || p.description
                    }))
                    setDetectedMerchant(null)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <MerchantLogo merchant={detectedMerchant} name={detectedMerchant.name} size="md" />
                    <div>
                      <p className="text-sm font-bold text-white font-display">{detectedMerchant.name} <span className="font-normal opacity-50 ml-1">Suggestion</span></p>
                      <p className="text-[11px] text-zinc-400">{detectedMerchant.category} • {detectedMerchant.desc}</p>
                    </div>
                  </div>
                  <Button size="xs" variant="ghost" className="pointer-events-none">Auto-fill</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount (₹) *" type="number" min="0.01" step="0.01" placeholder="5000" value={form.amount} onChange={set('amount')} error={errs.amount} />
            <Input label="Date *" type="date" value={form.expenseDate} onChange={set('expenseDate')} error={errs.expenseDate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <select className={selectCls} value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <select className={selectCls} value={form.transactionType} onChange={set('transactionType')}>
                <option value="EXPENSE">↓ Expense</option>
                <option value="INCOME">↑ Income</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description (optional)</label>
            <textarea
              rows={2}
              className={`${selectCls} resize-none`}
              placeholder="Additional details…"
              value={form.description}
              onChange={set('description')}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={close} className="flex-1">Cancel</Button>
            <Button onClick={submit} isLoading={saving} className="flex-1">
              {editing ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={delId !== null} onClose={() => setDelId(null)} title="Delete Transaction" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Delete this transaction?</p>
            <p className="text-xs text-zinc-500 mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setDelId(null)} className="flex-1">Cancel</Button>
            <Button
              onClick={() => delId && deleteMut.mutate(delId)}
              isLoading={deleteMut.isPending}
              variant="danger"
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}
