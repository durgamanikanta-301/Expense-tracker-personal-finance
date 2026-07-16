import { MERCHANT_DICTIONARY, INTELLIGENT_CATEGORIES } from '@/constants/merchants'

/**
 * Normalizes a string by converting to lowercase and removing all spaces/punctuation.
 */
function normalize(str) {
  if (!str) return ''
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Detects if a user-entered transaction title matches a known merchant.
 * Case insensitive and ignores spaces/punctuation.
 * Also checks if the normalized string starts with the merchant alias for things like "Uber ride"
 */
export function detectMerchant(title) {
  if (!title) return null
  const normalizedTitle = normalize(title)
  
  for (const merchant of MERCHANT_DICTIONARY) {
    if (merchant.aliases.some(alias => {
      const normalizedAlias = normalize(alias)
      // exact match or starts with (e.g. "amazon order")
      return normalizedTitle === normalizedAlias || normalizedTitle.startsWith(normalizedAlias)
    })) {
      return merchant
    }
  }
  return null
}

/**
 * Extracts a hidden category tag from the description if it exists.
 * E.g., "Dinner [cat:Food Delivery]" -> "Food Delivery"
 */
export function extractCategoryTag(description) {
  if (!description) return null
  const match = description.match(/\[cat:(.+?)\]/)
  return match ? match[1] : null
}

/**
 * Removes the hidden category tag from the description for display.
 */
export function cleanDescription(description) {
  if (!description) return ''
  return description.replace(/\[cat:.+?\]/g, '').trim()
}

/**
 * Given a transaction, resolves the best "Intelligent Category" to display.
 * Priority: 1. Manual override tag in description -> 2. Merchant detection from title -> 3. Backend enum fallback
 */
export function resolveIntelligentCategory(transaction) {
  // 1. Manual override tag
  const manualTag = extractCategoryTag(transaction.description)
  if (manualTag && INTELLIGENT_CATEGORIES[manualTag]) {
    return manualTag
  }

  // 2. Merchant detection
  const merchant = detectMerchant(transaction.title)
  if (merchant && INTELLIGENT_CATEGORIES[merchant.category]) {
    return merchant.category
  }

  // 3. Fallback to finding the first intelligent category that matches the backend enum
  const backendEnum = transaction.category
  const fallback = Object.keys(INTELLIGENT_CATEGORIES).find(
    key => INTELLIGENT_CATEGORIES[key].backendEnum === backendEnum
  )
  return fallback || 'Other'
}

/**
 * Gets the display config (emoji, color, bg) for an intelligent category name.
 */
export function getCategoryConfig(intelligentCategoryName) {
  return INTELLIGENT_CATEGORIES[intelligentCategoryName] || INTELLIGENT_CATEGORIES['Other']
}
