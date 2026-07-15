import { cn } from '@/utils'

export function Input({ label, error, icon, className, id, ...rest }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={inputId} className="block text-xs font-semibold text-zinc-400">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">{icon}</span>}
        <input
          id={inputId}
          className={cn(
            'w-full py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors',
            icon ? 'pl-9 pr-3' : 'px-3',
            error ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-blue-500/50',
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  )
}
