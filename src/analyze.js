export const SAMPLE_EXPENSES = `$8 coffee
$14 lunch
$6 subway
$27 dinner
$5 snack
$40 shopping`

export const PRESETS = {
  default: SAMPLE_EXPENSES,
  caffeine: `$7 latte
$6 iced coffee
$5 espresso
$8 matcha
$12 brunch
$4 pastry
$9 cold brew
$18 lunch`,
  responsible: `$1200 rent
$86 groceries
$45 gym
$32 metro card
$18 pharmacy
$12 lunch
$9 coffee`,
  menace: `$220 sneakers
$89 concert
$64 uber
$48 dinner
$35 shopping
$18 cocktail
$12 late night snack
$9 impulse candy`,
}

export const CATEGORIES = {
  coffee: { id: 'coffee', label: 'Coffee', emoji: '☕', color: '#8B5A2B' },
  food: { id: 'food', label: 'Food', emoji: '🍔', color: '#E24B3C' },
  transportation: { id: 'transportation', label: 'Transportation', emoji: '🚇', color: '#3D7A9A' },
  shopping: { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#C45BAA' },
  entertainment: { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#7B5EA7' },
  bills: { id: 'bills', label: 'Bills / Rent', emoji: '🏠', color: '#5C6B73' },
  health: { id: 'health', label: 'Health & Fitness', emoji: '🏋️', color: '#3D7A5A' },
  education: { id: 'education', label: 'Education', emoji: '📚', color: '#D4920A' },
  travel: { id: 'travel', label: 'Travel', emoji: '✈️', color: '#2A9D8F' },
  technology: { id: 'technology', label: 'Technology', emoji: '💻', color: '#4361EE' },
  other: { id: 'other', label: 'Other', emoji: '📦', color: '#9A8C82' },
}

const RULES = [
  {
    id: 'coffee',
    keywords: [
      'coffee', 'latte', 'espresso', 'cappuccino', 'mocha', 'americano',
      'starbucks', 'dunkin', 'matcha', 'cold brew', 'cafe', 'caffeine',
      'macchiato', 'frappuccino', 'tea',
    ],
  },
  {
    id: 'entertainment',
    keywords: [
      'netflix', 'spotify', 'hulu', 'disney', 'movie', 'cinema', 'concert',
      'ticket', 'game', 'steam', 'twitch', 'youtube', 'entertainment',
      'bar', 'club', 'party', 'festival', 'bowling', 'karaoke',
    ],
  },
  {
    id: 'travel',
    keywords: [
      'hotel', 'airbnb', 'flight', 'airfare', 'vacation', 'trip', 'travel',
      'hostel', 'resort', 'airline', 'suitcase',
    ],
  },
  {
    id: 'bills',
    keywords: [
      'rent', 'bill', 'electric', 'electricity', 'utilities', 'wifi',
      'internet', 'phone bill', 'insurance', 'water', 'gas bill',
      'mortgage', 'lease',
    ],
  },
  {
    id: 'health',
    keywords: [
      'gym', 'fitness', 'yoga', 'doctor', 'pharmacy', 'vitamin', 'protein',
      'workout', 'peloton', 'health', 'dentist', 'therapy', 'medicine',
      'supplement',
    ],
  },
  {
    id: 'education',
    keywords: [
      'tuition', 'textbook', 'course', 'udemy', 'class', 'school',
      'education', 'book', 'notebook', 'coursera',
    ],
  },
  {
    id: 'technology',
    keywords: [
      'laptop', 'iphone', 'computer', 'headphones', 'airpods', 'software',
      'app store', 'tech', 'keyboard', 'monitor', 'charger', 'apple',
      'samsung', 'gadget',
    ],
  },
  {
    id: 'shopping',
    keywords: [
      'shopping', 'shoes', 'clothes', 'clothing', 'amazon', 'target',
      'mall', 'shirt', 'pants', 'dress', 'makeup', 'sephora', 'sneakers',
      'jacket', 'bag', 'purse', 'zara', 'h&m', 'uniqlo', 'shein',
    ],
  },
  {
    id: 'food',
    keywords: [
      'lunch', 'dinner', 'breakfast', 'groceries', 'grocery', 'pizza',
      'burger', 'restaurant', 'snack', 'food', 'meal', 'sushi', 'taco',
      'chipotle', 'mcdonald', 'ramen', 'takeout', 'take-out', 'doordash',
      'grubhub', 'uber eats', 'brunch', 'pastry', 'candy', 'dessert',
      'ice cream', 'sandwich', 'bagel', 'donut', 'burrito', 'steak',
      'cocktail', 'drink', 'alcohol', 'beer', 'wine',
    ],
  },
  {
    id: 'transportation',
    keywords: [
      'uber', 'lyft', 'subway', 'metro', 'bus', 'train', 'gas', 'taxi',
      'parking', 'transit', 'bike', 'scooter', 'lyft', 'toll', 'car',
      'metro card',
    ],
  },
]

const PERSONALITY_WEIGHTS = {
  coffee: [0.15, 0.5, 0.35],
  food: [0.45, 0.4, 0.15],
  transportation: [0.85, 0.1, 0.05],
  shopping: [0.1, 0.4, 0.5],
  entertainment: [0.05, 0.65, 0.3],
  bills: [0.95, 0.05, 0],
  health: [0.8, 0.2, 0],
  education: [0.9, 0.1, 0],
  travel: [0.2, 0.55, 0.25],
  technology: [0.35, 0.35, 0.3],
  other: [0.4, 0.3, 0.3],
}

export function formatMoney(n) {
  return `$${Number(n).toFixed(2).replace(/\.00$/, '')}`
}

export function formatMoneyExact(n) {
  return `$${Number(n).toFixed(2)}`
}

function capitalize(text) {
  if (!text) return 'Purchase'
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function parseExpenses(text) {
  const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean)
  const expenses = []

  lines.forEach((line, index) => {
    const match = line.match(/\$?\s*(\d+(?:\.\d{1,2})?)/)
    if (!match) return
    const amount = parseFloat(match[1])
    if (!Number.isFinite(amount) || amount <= 0) return

    const description = capitalize(
      line.replace(match[0], '').replace(/^[\s\-–—,.:|/]+|[\s\-–—,.:|/]+$/g, '').trim(),
    )

    expenses.push({
      id: `${index}-${amount}-${description}`,
      amount,
      description,
      raw: line,
    })
  })

  return expenses
}

export function categorize(description) {
  const haystack = description.toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return CATEGORIES[rule.id]
    }
  }
  return CATEGORIES.other
}

function roundPercents(values) {
  const floored = values.map((v) => Math.floor(v))
  let remainder = 100 - floored.reduce((sum, v) => sum + v, 0)
  const order = values
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)

  const result = [...floored]
  let idx = 0
  while (remainder > 0 && order.length) {
    result[order[idx % order.length].i] += 1
    remainder -= 1
    idx += 1
  }
  return result
}

function personalityFromScores(responsible, treat, questionable) {
  const scores = [
    { key: 'responsible', value: responsible },
    { key: 'treat', value: treat },
    { key: 'questionable', value: questionable },
  ].sort((a, b) => b.value - a.value)

  const spread = scores[0].value - scores[2].value
  if (spread <= 12) {
    return {
      name: 'The Balanced One ⚖️',
      blurb: 'You somehow managed to have fun without completely destroying your finances.',
    }
  }

  if (scores[0].key === 'responsible') {
    return {
      name: 'The Responsible Adult 🧾',
      blurb: 'You actually know where your money goes. Suspiciously mature.',
    }
  }
  if (scores[0].key === 'treat') {
    return {
      name: 'The Treat Yourself Specialist ✨',
      blurb: 'You believe money is temporary but a good dinner is forever.',
    }
  }
  return {
    name: 'The Financial Menace 💀',
    blurb: 'Your bank account has officially requested a meeting.',
  }
}

function buildRoast(expenses, byCategory, total, biggest, smallCount) {
  const observations = []
  const coffee = byCategory.coffee?.total || 0
  const food = byCategory.food?.total || 0
  const shopping = byCategory.shopping?.total || 0
  const transport = byCategory.transportation?.total || 0
  const entertainment = byCategory.entertainment?.total || 0
  const top = Object.values(byCategory).sort((a, b) => b.total - a.total)[0]

  if (coffee / total >= 0.15 || coffee >= 20) {
    observations.push(
      `You spent ${formatMoney(coffee)} on coffee. At this point, the coffee shop considers you an investor.`,
    )
  }
  if (top?.id === 'shopping' || shopping / total >= 0.3) {
    observations.push(
      `Shopping was pulling serious rank at ${formatMoney(shopping)}. Your cart apparently had more financial authority than you did.`,
    )
  }
  if (food / total >= 0.25) {
    observations.push(
      `You spent a suspicious ${formatMoney(food)} on food. Honestly, though, we respect the commitment.`,
    )
  }
  if (transport / total >= 0.2 || transport >= 30) {
    observations.push(
      `You spent ${formatMoney(transport)} on getting places. At least you physically went somewhere.`,
    )
  }
  if (entertainment / total >= 0.15) {
    observations.push(
      `Entertainment took ${formatMoney(entertainment)}. Your future self will thank you for the memories, and possibly also for the debt.`,
    )
  }
  if (smallCount >= 3) {
    observations.push(
      `You have mastered the art of the $5 purchase. Individually harmless. Collectively terrifying.`,
    )
  }
  if (biggest.amount / total >= 0.35) {
    observations.push(
      `That ${formatMoney(biggest.amount)} ${biggest.description.toLowerCase()} is doing some serious damage to the average.`,
    )
  }
  if (expenses.length >= 8) {
    observations.push(
      `${expenses.length} purchases in one list? Your wallet didn’t stand a chance — it was death by a thousand taps.`,
    )
  }
  if (byCategory.bills?.total / total >= 0.5) {
    observations.push(
      `Most of this went to bills. Not spicy, but extremely adult. We’re almost disappointed.`,
    )
  }

  if (observations.length === 0) {
    observations.push(
      `Your spending is oddly reasonable. We came here to roast you and now we feel personally attacked.`,
    )
  }

  const picked = observations.slice(0, 3)
  return picked.join(' ')
}

function buildInsights(expenses, byCategory, total, average, biggest, smallCount) {
  const ranked = Object.values(byCategory).sort((a, b) => b.total - a.total)
  const top = ranked[0]
  const second = ranked[1]
  const insights = []

  insights.push(`Your biggest spending category is ${top.label}.`)
  insights.push(`Your average purchase is ${formatMoneyExact(average)}.`)

  if (smallCount > 0) {
    insights.push(`You made ${smallCount} purchase${smallCount === 1 ? '' : 's'} under $10.`)
  }

  const topShare = Math.round((top.total / total) * 100)
  insights.push(`${top.label} accounts for ${topShare}% of your spending.`)

  const biggestShare = Math.round((biggest.amount / total) * 100)
  insights.push(
    `Your largest purchase (${biggest.description}) was ${biggestShare}% of your total spending.`,
  )

  if (second && second.total > 0) {
    if (top.total > second.total) {
      insights.push(
        `You spent ${formatMoney(top.total - second.total)} more on ${top.label.toLowerCase()} than ${second.label.toLowerCase()}.`,
      )
    }
  }

  const coffee = byCategory.coffee
  const transport = byCategory.transportation
  if (coffee && transport && coffee.total > transport.total) {
    insights.push(
      `You spent more on coffee (${formatMoney(coffee.total)}) than transportation (${formatMoney(transport.total)}).`,
    )
  }

  const unique = [...new Set(insights)]
  return unique.slice(0, 5)
}

function financialScore({ responsible, questionable, total, biggest, smallCount, ranked }) {
  let score = 72
  score += responsible * 0.22
  score -= questionable * 0.28

  const biggestShare = biggest.amount / total
  if (biggestShare > 0.3) score -= (biggestShare - 0.3) * 40
  score -= Math.min(smallCount * 2.2, 14)

  if (ranked[0] && ranked[0].total / total > 0.55) score -= 8
  if (ranked.length >= 4) score += 4

  return Math.max(12, Math.min(98, Math.round(score)))
}

function scoreBlurb(score, topCategory, questionable) {
  if (score >= 85) {
    return 'Impressive. Either you have your spending together, or you only entered the boring expenses.'
  }
  if (score >= 70) {
    return `Not bad! You have your spending mostly under control, but your ${topCategory.label.toLowerCase()} habits are starting to look suspicious.`
  }
  if (score >= 50) {
    return `Mixed bag. Some responsible choices, some “I’ll deal with it later” energy — especially around ${topCategory.label.toLowerCase()}.`
  }
  if (questionable >= 40) {
    return 'Your wallet called. It said it needs space. And also a nap.'
  }
  return 'The math is not mathing in your favor. Consider this a friendly intervention.'
}

export function analyzeExpenses(text) {
  const parsed = parseExpenses(text).map((expense) => ({
    ...expense,
    category: categorize(expense.description),
  }))

  if (parsed.length === 0) return null

  const total = parsed.reduce((sum, e) => sum + e.amount, 0)
  const average = total / parsed.length
  const biggest = parsed.reduce((max, e) => (e.amount > max.amount ? e : max), parsed[0])
  const smallCount = parsed.filter((e) => e.amount < 10).length

  const byCategory = {}
  for (const expense of parsed) {
    const id = expense.category.id
    if (!byCategory[id]) {
      byCategory[id] = { ...expense.category, total: 0, count: 0 }
    }
    byCategory[id].total += expense.amount
    byCategory[id].count += 1
  }

  const ranked = Object.values(byCategory).sort((a, b) => b.total - a.total)

  let r = 0
  let t = 0
  let q = 0
  for (const expense of parsed) {
    let [wr, wt, wq] = PERSONALITY_WEIGHTS[expense.category.id] || PERSONALITY_WEIGHTS.other
    if (expense.amount < 8) {
      wq += 0.12
      wt += 0.05
      wr -= 0.17
    }
    if (expense.amount / total >= 0.35 && expense.category.id !== 'bills') {
      wq += 0.12
      wr -= 0.12
    }
    const sumW = Math.max(wr, 0) + Math.max(wt, 0) + Math.max(wq, 0)
    r += (Math.max(wr, 0) / sumW) * expense.amount
    t += (Math.max(wt, 0) / sumW) * expense.amount
    q += (Math.max(wq, 0) / sumW) * expense.amount
  }

  const raw = [r, t, q].map((v) => (v / (r + t + q)) * 100)
  const [responsible, treat, questionable] = roundPercents(raw)

  const personality = personalityFromScores(responsible, treat, questionable)
  const score = financialScore({
    responsible,
    questionable,
    total,
    biggest,
    smallCount,
    ranked,
  })

  return {
    expenses: parsed,
    total,
    count: parsed.length,
    average,
    biggest,
    smallCount,
    byCategory,
    ranked,
    personalityScores: { responsible, treat, questionable },
    personality,
    roast: buildRoast(parsed, byCategory, total, biggest, smallCount),
    insights: buildInsights(parsed, byCategory, total, average, biggest, smallCount),
    score,
    scoreBlurb: scoreBlurb(score, ranked[0], questionable),
  }
}
