import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FINANCIAL_QUOTES } from '@/constants'

/** Tailwind class merge helper */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats "YYYY-MM-DD" → "14 Jul 2025"
 * Forces local midnight to avoid timezone off-by-one
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  try {
    const date = new Date(`${dateStr.split('T')[0]}T00:00:00`)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

/** Days from today to dateStr (negative = past) */
export function daysUntil(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Deterministic daily quote (rotates each day) */
export function getRandomQuote() {
  const idx = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % FINANCIAL_QUOTES.length
  return FINANCIAL_QUOTES[idx]
}

/** Health score 0–100 based on savings rate + balance */
export function getHealthScore(monthlyIncome, monthlyExpense, balance) {
  if (!monthlyIncome) return balance > 0 ? 50 : 30
  const rate = (monthlyIncome - monthlyExpense) / monthlyIncome
  let score = Math.round(50 + rate * 50)
  if (balance > 0)  score += 5
  if (rate > 0.3)   score += 10
  if (rate < 0)     score -= 20
  return Math.min(100, Math.max(0, score))
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}
