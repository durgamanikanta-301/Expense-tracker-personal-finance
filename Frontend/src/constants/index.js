// Category config — maps every backend Category enum to display metadata
export const CATEGORY_CONFIG = {
  FOOD:          { label: 'Food & Dining',   emoji: '🍜', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  TRANSPORT:     { label: 'Transport',        emoji: '🚗', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  ENTERTAINMENT: { label: 'Entertainment',   emoji: '🎬', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  HEALTHCARE:    { label: 'Healthcare',       emoji: '💊', color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
  EDUCATION:     { label: 'Education',        emoji: '📚', color: '#06B6D4', bg: 'rgba(6,182,212,0.12)'  },
  SHOPPING:      { label: 'Shopping',         emoji: '🛍️', color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  UTILITIES:     { label: 'Utilities',        emoji: '⚡', color: '#EAB308', bg: 'rgba(234,179,8,0.12)'  },
  HOUSING:       { label: 'Housing',          emoji: '🏠', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  INVESTMENT:    { label: 'Investment',       emoji: '📈', color: '#14B8A6', bg: 'rgba(20,184,166,0.12)' },
  INSURANCE:     { label: 'Insurance',        emoji: '🛡️', color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
  TRAVEL:        { label: 'Travel',           emoji: '✈️', color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
  PERSONAL_CARE: { label: 'Personal Care',   emoji: '💅', color: '#F472B6', bg: 'rgba(244,114,182,0.12)' },
  GIFTS:         { label: 'Gifts',            emoji: '🎁', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  BUSINESS:      { label: 'Business',         emoji: '💼', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
  OTHER:         { label: 'Other',            emoji: '📦', color: '#71717A', bg: 'rgba(113,113,122,0.12)' },
}

export const CATEGORIES = Object.keys(CATEGORY_CONFIG)

export const FINANCIAL_QUOTES = [
  'Do not save what is left after spending, but spend what is left after saving. — Warren Buffett',
  'Wealth is not about having a lot of money; it is about having a lot of options. — Chris Rock',
  'Financial freedom is available to those who learn about it and work for it. — Robert Kiyosaki',
  'The habit of saving is itself an education; it fosters every virtue, teaches self-denial. — T.T. Munger',
  'It is not your salary that makes you rich, it is your spending habits. — Charles A. Jaffe',
  'Beware of little expenses; a small leak will sink a great ship. — Benjamin Franklin',
  'A budget tells your money where to go instead of wondering where it went. — Dave Ramsey',
  'The goal is not to be rich. The goal is to be free. — T. Harv Eker',
]

export const MONTHS = [
  { v: 1, l: 'January' }, { v: 2, l: 'February' }, { v: 3, l: 'March' },
  { v: 4, l: 'April' },   { v: 5, l: 'May' },       { v: 6, l: 'June' },
  { v: 7, l: 'July' },    { v: 8, l: 'August' },    { v: 9, l: 'September' },
  { v: 10, l: 'October' },{ v: 11, l: 'November' }, { v: 12, l: 'December' },
]

export const FREQUENCIES = [
  { v: 'DAILY',     l: 'Daily' },
  { v: 'WEEKLY',    l: 'Weekly' },
  { v: 'MONTHLY',   l: 'Monthly' },
  { v: 'QUARTERLY', l: 'Quarterly' },
  { v: 'YEARLY',    l: 'Yearly' },
]
