import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/authService'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Mail, Phone, Shield, Calendar, LogOut, Save } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { formatDateShort } from '@/utils'

export function Profile() {
  const { user, logout, updateUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName,  setLastName]  = useState(user?.lastName  || '')
  const [phone,     setPhone]     = useState(user?.phone     || '')
  const [saving, setSaving]       = useState(false)

  const updateMut = useMutation({
    mutationFn: (data) => authService.updateProfile(data),
    onSuccess: (updated) => { updateUser(updated); toast.success('Profile updated!') },
    onError: () => toast.error('Failed to update profile'),
  })

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) { toast.error('First and last name are required'); return }
    setSaving(true)
    try { await updateMut.mutateAsync({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() || undefined }) }
    finally { setSaving(false) }
  }

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?'

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-2xl">
      {/* Header card */}
      <GlassCard>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white font-display shrink-0 shadow-glow-blue">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white font-display">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-zinc-400">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} isLoading={saving}><Save className="w-4 h-4 mr-1" />Save</Button>
            <Button size="sm" variant="ghost" onClick={logout} className="!text-red-400 hover:!bg-red-500/10"><LogOut className="w-4 h-4 mr-1" />Logout</Button>
          </div>
        </div>
      </GlassCard>

      {/* Edit form */}
      <GlassCard>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-5">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" icon={<User className="w-4 h-4" />} value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Input label="Last Name"  icon={<User className="w-4 h-4" />} value={lastName}  onChange={e => setLastName(e.target.value)} />
          </div>
          {/* Email read-only */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400">Email Address</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <Mail className="w-4 h-4 text-zinc-600" />
              <span className="text-sm text-zinc-500">{user?.email}</span>
              <span className="ml-auto text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Read only</span>
            </div>
          </div>
          <Input label="Phone Number" type="tel" icon={<Phone className="w-4 h-4" />} placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
      </GlassCard>

      {/* Account info */}
      <GlassCard>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-5">Account Details</h3>
        <div className="space-y-3">
          {[
            { icon: <Calendar className="w-4 h-4 text-zinc-500" />, label: 'Member since', value: user?.createdAt ? formatDateShort(user.createdAt.split('T')[0]) : '—' },
            { icon: <Shield className="w-4 h-4 text-zinc-500" />,   label: 'Account Role', value: user?.role },
            { icon: <Mail className="w-4 h-4 text-zinc-500" />,     label: 'User ID',      value: `#${user?.id}` },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-2">{row.icon}<span className="text-sm text-zinc-400">{row.label}</span></div>
              <span className="text-sm text-white font-medium font-mono">{row.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Danger zone */}
      <GlassCard className="border-red-500/10">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">Sign out of FinFlow</p>
            <p className="text-xs text-zinc-500 mt-0.5">You will be redirected to the login page</p>
          </div>
          <Button size="sm" onClick={logout} className="!bg-red-500/15 !border-red-500/30 !text-red-400 hover:!bg-red-500/25">
            <LogOut className="w-4 h-4 mr-1" />Sign Out
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  )
}
