/**
 * Rate limiting utility with fallback support
 * Uses Vercel KV in production, in-memory fallback for development
 */

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per window

// In-memory fallback for development
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Get rate limit client (Vercel KV or fallback)
 */
async function getRateLimitClient() {
  // Try to use Vercel KV if available
  try {
    // Dynamic import to avoid bundling issues if KV is not configured
    const { kv } = await import('@vercel/kv');
    if (kv) {
      return { type: 'kv' as const, client: kv };
    }
  } catch (error) {
    // KV not available, use in-memory fallback
    console.log('Vercel KV not available, using in-memory rate limiting');
  }
  
  return { type: 'memory' as const, client: inMemoryStore };
}

/**
 * Check and increment rate limit for an IP address
 * Returns true if within limit, false if exceeded
 */
export async function checkRateLimit(
  identifier: string
): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}> {
  const { type, client } = await getRateLimitClient();
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  
  if (type === 'kv') {
    // Use Vercel KV
    const kv = client as Awaited<ReturnType<typeof import('@vercel/kv').kv>>;
    
    try {
      // Get current count
      const count = await kv.incr(key);
      
      // Set expiration on first request
      if (count === 1) {
        await kv.expire(key, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));
      }
      
      const resetAt = now + RATE_LIMIT_WINDOW_MS;
      const remaining = Math.max(0, RATE_LIMIT_MAX - count);
      const allowed = count <= RATE_LIMIT_MAX;
      
      return {
        allowed,
        remaining,
        resetAt,
        retryAfter: allowed ? undefined : Math.ceil((resetAt - now) / 1000),
      };
    } catch (error) {
      console.error('Rate limit KV error:', error);
      // Fallback to allowing request if KV fails
      return {
        allowed: true,
        remaining: RATE_LIMIT_MAX - 1,
        resetAt: now + RATE_LIMIT_WINDOW_MS,
      };
    }
  } else {
    // Use in-memory store
    const store = client as Map<string, { count: number; resetAt: number }>;
    const entry = store.get(key);
    const resetAt = entry && entry.resetAt > now ? entry.resetAt : now + RATE_LIMIT_WINDOW_MS;
    const count = entry && entry.resetAt > now ? entry.count : 0;
    
    const newCount = count + 1;
    store.set(key, { count: newCount, resetAt });
    
    // Clean up old entries periodically (simple cleanup)
    if (store.size > 1000) {
      const now = Date.now();
      for (const [k, v] of store.entries()) {
        if (v.resetAt < now) {
          store.delete(k);
        }
      }
    }
    
    const remaining = Math.max(0, RATE_LIMIT_MAX - newCount);
    const allowed = newCount <= RATE_LIMIT_MAX;
    
    return {
      allowed,
      remaining,
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((resetAt - now) / 1000),
    };
  }
}

export { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX };
