import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'

export function Button({ variant = 'primary', size = 'md', isLoading = false, children, className, disabled, ...rest }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border border-blue-500/30 hover:brightness-110 hover:shadow-glow-blue active:scale-[0.98]',
    ghost: 'glass border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 active:scale-[0.98]',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-1.5',
    lg: 'px-5 py-2.5 text-sm gap-2',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  )
}
