interface RateLimitEntry {
  hits: number[]
  expiresAt: number
}

// In memory: one pm2 process serves the site. Never evict active clients to admit new ones.
const hitsByKey = new Map<string, RateLimitEntry>()
const MAX_KEYS = 1000

interface RateLimit {
  limit: number
  windowMs: number
}

export const isRateLimited = (key: string, { limit, windowMs }: RateLimit) => {
  const now = Date.now()
  const entry = hitsByKey.get(key)
  const recentHits = (entry?.hits ?? []).filter(time => now - time < windowMs)
  if (recentHits.length >= limit) return true

  if (!entry && hitsByKey.size >= MAX_KEYS) {
    for (const [staleKey, staleEntry] of hitsByKey) {
      if (staleEntry.expiresAt <= now) hitsByKey.delete(staleKey)
    }
    // Fail closed until a slot expires instead of allowing unbounded memory growth.
    if (hitsByKey.size >= MAX_KEYS) return true
  }

  recentHits.push(now)
  hitsByKey.set(key, { hits: recentHits, expiresAt: now + windowMs })
  return false
}
