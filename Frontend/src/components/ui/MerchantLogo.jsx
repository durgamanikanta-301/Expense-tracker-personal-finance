import { useState } from 'react'
import { cn } from '@/utils'

export function MerchantLogo({ merchant, name, size = 'md', className }) {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  }

  const baseClasses = cn(
    'rounded-xl flex items-center justify-center shrink-0 font-bold text-white shadow-sm overflow-hidden',
    sizeClasses[size],
    className
  )

  // Use initials if logo is broken or not provided
  const initials = (name || merchant?.name || '?').substring(0, 2).toUpperCase()

  // Generate a determinisitic color based on the name length and first letter
  const charCode = (name || merchant?.name || 'A').charCodeAt(0)
  const colors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-400 to-teal-500',
    'from-rose-400 to-red-500',
    'from-amber-400 to-orange-500',
    'from-purple-500 to-fuchsia-600',
    'from-cyan-400 to-blue-500',
  ]
  const gradient = colors[charCode % colors.length]

  if (merchant?.logo && !imgError) {
    return (
      <div className={cn(baseClasses, 'bg-white')}>
        <img 
          src={merchant.logo} 
          alt={merchant.name} 
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-1.5"
        />
      </div>
    )
  }

  return (
    <div className={cn(baseClasses, `bg-gradient-to-tr ${gradient}`)}>
      {initials}
    </div>
  )
}
