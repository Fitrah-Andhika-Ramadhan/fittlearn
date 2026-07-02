/**
 * Simple in-memory LRU rate limiter for Next.js API Routes / Edge Middleware.
 * 
 * Note: In a Serverless environment (like Vercel), memory is not shared across instances.
 * This means this in-memory rate limiter is per-instance. It's not perfectly strict globally,
 * but it is highly effective at preventing aggressive brute-force attacks from a single source
 * hitting the same instance repeatedly.
 */

type CacheEntry = {
  count: number
  lastRequest: number
}

const LRU_CACHE = new Map<string, CacheEntry>()
const MAX_CACHE_SIZE = 5000 // Prevent memory leaks by capping the IPs stored

export function checkRateLimit(ip: string, limit: number, windowMs: number): { success: boolean, limit: number, remaining: number } {
  const now = Date.now()
  const entry = LRU_CACHE.get(ip)

  // Clear cache if too large (rudimentary LRU behavior to prevent memory leak)
  if (LRU_CACHE.size > MAX_CACHE_SIZE) {
    LRU_CACHE.clear()
  }

  if (!entry) {
    LRU_CACHE.set(ip, { count: 1, lastRequest: now })
    return { success: true, limit, remaining: limit - 1 }
  }

  // If the window has passed, reset the counter
  if (now - entry.lastRequest > windowMs) {
    entry.count = 1
    entry.lastRequest = now
    return { success: true, limit, remaining: limit - 1 }
  }

  // Otherwise increment counter
  entry.count += 1
  entry.lastRequest = now

  if (entry.count > limit) {
    return { success: false, limit, remaining: 0 }
  }

  return { success: true, limit, remaining: limit - entry.count }
}
