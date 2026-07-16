import { INTELLIGENT_CATEGORIES } from './merchants'

// Category config — maps every intelligent Category to display metadata
export const CATEGORY_CONFIG = INTELLIGENT_CATEGORIES
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
