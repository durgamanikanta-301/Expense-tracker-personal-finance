export const INTELLIGENT_CATEGORIES = {
  'Food Delivery': { emoji: '🍔', color: '#F97316', bg: 'rgba(249,115,22,0.12)', backendEnum: 'FOOD' },
  'Groceries':     { emoji: '🛒', color: '#10B981', bg: 'rgba(16,185,129,0.12)', backendEnum: 'FOOD' },
  'Medical':       { emoji: '💊', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', backendEnum: 'HEALTH' },
  'Transport':     { emoji: '🚕', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', backendEnum: 'TRANSPORT' },
  'Entertainment': { emoji: '🎬', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', backendEnum: 'ENTERTAINMENT' },
  'Shopping':      { emoji: '🛍️', color: '#EC4899', bg: 'rgba(236,72,153,0.12)', backendEnum: 'SHOPPING' },
  'Investments':   { emoji: '📈', color: '#14B8A6', bg: 'rgba(20,184,166,0.12)', backendEnum: 'OTHER' },
  'Salary':        { emoji: '💰', color: '#10B981', bg: 'rgba(16,185,129,0.12)', backendEnum: 'SALARY' },
  'Utilities':     { emoji: '⚡', color: '#EAB308', bg: 'rgba(234,179,8,0.12)', backendEnum: 'BILLS' },
  'Education':     { emoji: '📚', color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', backendEnum: 'EDUCATION' },
  'Electronics':   { emoji: '💻', color: '#6366F1', bg: 'rgba(99,102,241,0.12)', backendEnum: 'SHOPPING' },
  'Bills':         { emoji: '📄', color: '#F43F5E', bg: 'rgba(244,63,94,0.12)', backendEnum: 'BILLS' },
  'Subscriptions': { emoji: '🔄', color: '#A855F7', bg: 'rgba(168,85,247,0.12)', backendEnum: 'ENTERTAINMENT' },
  'Other':         { emoji: '📦', color: '#71717A', bg: 'rgba(113,113,122,0.12)', backendEnum: 'OTHER' },
  'Freelance':     { emoji: '💻', color: '#10B981', bg: 'rgba(16,185,129,0.12)', backendEnum: 'SALARY' },
  'Digital':       { emoji: '📱', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', backendEnum: 'ENTERTAINMENT' }
}

export const MERCHANT_DICTIONARY = [
  { name: 'Blinkit', aliases: ['blinkit', 'blink it', 'blink-it'], category: 'Groceries', desc: 'Groceries & Essentials', logo: 'https://logo.clearbit.com/blinkit.com' },
  { name: 'Swiggy', aliases: ['swiggy'], category: 'Food Delivery', desc: 'Dinner Order', logo: 'https://logo.clearbit.com/swiggy.com' },
  { name: 'Zomato', aliases: ['zomato'], category: 'Food Delivery', desc: 'Food Delivery', logo: 'https://logo.clearbit.com/zomato.com' },
  { name: 'Dominos', aliases: ['dominos', "domino's"], category: 'Food Delivery', desc: 'Pizza', logo: 'https://logo.clearbit.com/dominos.co.in' },
  { name: 'KFC', aliases: ['kfc', 'kentucky fried chicken'], category: 'Food Delivery', desc: 'Food Order', logo: 'https://logo.clearbit.com/kfc.co.in' },
  { name: "McDonald's", aliases: ['mcdonalds', "mcdonald's", 'mcd'], category: 'Food Delivery', desc: 'Food Order', logo: 'https://logo.clearbit.com/mcdonalds.com' },
  { name: 'Starbucks', aliases: ['starbucks'], category: 'Food Delivery', desc: 'Coffee', logo: 'https://logo.clearbit.com/starbucks.in' },

  { name: 'Apollo Pharmacy', aliases: ['apollo', 'apollo pharmacy'], category: 'Medical', desc: 'Medicines', logo: 'https://logo.clearbit.com/apollopharmacy.in' },
  { name: 'MedPlus', aliases: ['medplus', 'med plus'], category: 'Medical', desc: 'Medicines', logo: 'https://logo.clearbit.com/medplusmart.com' },

  { name: 'Uber', aliases: ['uber'], category: 'Transport', desc: 'Ride to Office', logo: 'https://logo.clearbit.com/uber.com' },
  { name: 'Rapido', aliases: ['rapido'], category: 'Transport', desc: 'Bike Ride', logo: 'https://logo.clearbit.com/rapido.bike' },
  { name: 'Ola', aliases: ['ola', 'ola cabs'], category: 'Transport', desc: 'Cab Ride', logo: 'https://logo.clearbit.com/olacabs.com' },

  { name: 'Amazon', aliases: ['amazon', 'amazon.in', 'amazon.com'], category: 'Shopping', desc: 'Online Shopping', logo: 'https://logo.clearbit.com/amazon.in' },
  { name: 'Flipkart', aliases: ['flipkart'], category: 'Shopping', desc: 'Online Shopping', logo: 'https://logo.clearbit.com/flipkart.com' },
  { name: 'Myntra', aliases: ['myntra'], category: 'Shopping', desc: 'Clothing', logo: 'https://logo.clearbit.com/myntra.com' },
  { name: 'Ajio', aliases: ['ajio'], category: 'Shopping', desc: 'Clothing', logo: 'https://logo.clearbit.com/ajio.com' },

  { name: 'Netflix', aliases: ['netflix'], category: 'Subscriptions', desc: 'Monthly Subscription', logo: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Spotify', aliases: ['spotify'], category: 'Subscriptions', desc: 'Monthly Subscription', logo: 'https://logo.clearbit.com/spotify.com' },
  { name: 'Steam', aliases: ['steam', 'valve'], category: 'Entertainment', desc: 'Gaming', logo: 'https://logo.clearbit.com/steampowered.com' },
  { name: 'BookMyShow', aliases: ['bookmyshow', 'book my show'], category: 'Entertainment', desc: 'Movie Tickets', logo: 'https://logo.clearbit.com/bookmyshow.com' },

  { name: 'Google Play', aliases: ['google play', 'play store', 'google'], category: 'Digital', desc: 'App Purchase', logo: 'https://logo.clearbit.com/play.google.com' },
  { name: 'Apple', aliases: ['apple', 'apple store', 'app store', 'itunes'], category: 'Digital', desc: 'App Purchase', logo: 'https://logo.clearbit.com/apple.com' },

  { name: 'Croma', aliases: ['croma'], category: 'Electronics', desc: 'Electronics', logo: 'https://logo.clearbit.com/croma.com' },
  { name: 'Vijay Sales', aliases: ['vijay sales'], category: 'Electronics', desc: 'Electronics', logo: 'https://logo.clearbit.com/vijaysales.com' },

  { name: 'Reliance Fresh', aliases: ['reliance fresh', 'reliance smart'], category: 'Groceries', desc: 'Groceries', logo: 'https://logo.clearbit.com/relianceretail.com' },
  { name: 'DMart', aliases: ['dmart', 'd mart'], category: 'Groceries', desc: 'Groceries', logo: 'https://logo.clearbit.com/dmart.in' },
  { name: 'BigBasket', aliases: ['bigbasket', 'big basket'], category: 'Groceries', desc: 'Groceries', logo: 'https://logo.clearbit.com/bigbasket.com' },

  { name: 'Paytm', aliases: ['paytm'], category: 'Utilities', desc: 'Bill Payment', logo: 'https://logo.clearbit.com/paytm.com' },
  { name: 'PhonePe', aliases: ['phonepe', 'phone pe'], category: 'Utilities', desc: 'UPI Payment', logo: 'https://logo.clearbit.com/phonepe.com' }
]
