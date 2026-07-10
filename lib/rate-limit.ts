import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
})

interface RateLimitConfig {
  max: number
  windowMs: number
  keyPrefix?: string
}

const defaultConfig: RateLimitConfig = {
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  keyPrefix: 'ratelimit',
}

export async function rateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const { max, windowMs, keyPrefix } = { ...defaultConfig, ...config }
  const key = `${keyPrefix}:${identifier}`
  const now = Date.now()
  const windowStart = now - windowMs

  try {
    const pipeline = redis.pipeline()
    pipeline.zremrangebyscore(key, 0, windowStart)
    pipeline.zadd(key, { score: now, member: `${now}:${Math.random()}` })
    pipeline.zcard(key)
    pipeline.pexpire(key, windowMs)
    const results = await pipeline.exec()

    const count = results[2] as number
    const allowed = count <= max
    const remaining = Math.max(0, max - count)
    const resetTime = now + windowMs

    return { allowed, remaining, resetTime }
  } catch {
    // Fail open if Redis is unavailable
    return { allowed: true, remaining: max, resetTime: now + windowMs }
  }
}

export function rateLimitMiddleware(config: Partial<RateLimitConfig> = {}) {
  return async (req: Request): Promise<{ allowed: boolean; headers: Record<string, string> }> => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const identifier = `${ip}:${userAgent}`

    const result = await rateLimit(identifier, config)

    const headers: Record<string, string> = {
      'X-RateLimit-Limit': config.max?.toString() || defaultConfig.max.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
    }

    if (!result.allowed) {
      headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString()
    }

    return { allowed: result.allowed, headers }
  }
}

export async function checkRateLimit(
  req: Request,
  config: Partial<RateLimitConfig> = {}
): Promise<Response | null> {
  const { allowed, headers } = await rateLimitMiddleware(config)(req)

  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  }

  return null
}