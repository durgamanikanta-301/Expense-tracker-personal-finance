import { cn } from '@/utils'

export function GlassCard({ children, className, glow = 'none', hover = false, onClick }) {
  const glowClass = glow === 'blue'
    ? 'hover:shadow-glow-blue hover:border-blue-500/20'
    : glow === 'green'
    ? 'hover:shadow-glow-green hover:border-green-500/20'
    : ''

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl p-5 border border-white/5',
        hover && 'transition-all duration-300 hover:bg-white/[0.04]',
        hover && glowClass,
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
