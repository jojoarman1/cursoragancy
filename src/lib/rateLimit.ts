// In memory: one pm2 process serves the site
const hitsByKey = new Map<string, number[]>()
const PRUNE_SIZE = 1000

interface RateLimit {
  limit: number
  windowMs: number
}

export const isRateLimited = (key: string, { limit, windowMs }: RateLimit) => {
  const now = Date.now()
  const recentHits = (hitsByKey.get(key) ?? []).filter(time => now - time < windowMs)
  const isLimited = recentHits.length >= limit
  if (!isLimited) recentHits.push(now)
  hitsByKey.set(key, recentHits)

  if (hitsByKey.size > PRUNE_SIZE) {
    for (const [staleKey, times] of hitsByKey) {
      if (times.every(time => now - time >= windowMs)) hitsByKey.delete(staleKey)
    }
  }

  return isLimited
}
