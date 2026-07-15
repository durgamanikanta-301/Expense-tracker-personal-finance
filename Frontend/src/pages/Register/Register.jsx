import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }))
    setErrors(p => { const n = { ...p }; delete n[field]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim())               e.firstName = 'First name is required'
    if (!form.lastName.trim())                e.lastName  = 'Last name is required'
    if (!form.email.trim())                   e.email     = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = 'Enter a valid email'
    if (!form.password)                       e.password  = 'Password is required'
    else if (form.password.length < 6)        e.password  = 'Minimum 6 characters'
    if (form.phone && form.phone.length > 20) e.phone     = 'Max 20 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
      })
      toast.success('Account created! Welcome to FinFlow 🎉')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const status = err.response?.status
      const msg    = err.response?.data?.message
      if (status === 409) toast.error('An account with this email already exists.')
      else if (msg)       toast.error(msg)
      else                toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className="glass rounded-3xl p-8 border border-white/5 shadow-elevated">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">Create account</h1>
          <p className="text-sm text-zinc-400 mt-1.5">Start your financial journey with FinFlow</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name *" placeholder="Jai" icon={<User className="w-4 h-4" />}
              value={form.firstName} onChange={set('firstName')} error={errors.firstName} autoComplete="given-name" />
            <Input label="Last Name *" placeholder="Singh" icon={<User className="w-4 h-4" />}
              value={form.lastName} onChange={set('lastName')} error={errors.lastName} autoComplete="family-name" />
          </div>
          <Input label="Email Address *" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />}
            value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Input label="Phone (optional)" type="tel" placeholder="9876543210" icon={<Phone className="w-4 h-4" />}
            value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
          <div className="relative">
            <Input label="Password * (min 6 chars)" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />} value={form.password} onChange={set('password')}
              error={errors.password} autoComplete="new-password" className="pr-11" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-[34px] text-zinc-500 hover:text-white transition-colors p-1">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>Create Account</Button>
        </form>

        <div className="mt-6 text-center border-t border-white/5 pt-5">
          <p className="text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
