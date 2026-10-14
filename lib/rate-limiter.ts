import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { createLogger } from './logger'

const log = createLogger('rate-limiter')

export interface RateLimitConfig {
  windowMs: number
  max: number
  keyPrefix?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  total: number
}

const memoryStore = new Map<string, { count: number; resetAt: number }>()
const limiters = new Map<string, Ratelimit>()

const upstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

function configKey(config: RateLimitConfig): string {
  return `${config.keyPrefix ?? 'rl'}:${config.max}:${config.windowMs}`
}

function memoryLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const key = `${config.keyPrefix ?? 'rl'}:${identifier}`
  const current = memoryStore.get(key)

  if (!current || current.resetAt <= now) {
    const resetAt = now + config.windowMs
    memoryStore.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: config.max - 1, resetAt, total: 1 }
  }

  current.count += 1
  return {
    allowed: current.count <= config.max,
    remaining: Math.max(0, config.max - current.count),
    resetAt: current.resetAt,
    total: current.count,
  }
}

function getUpstashLimiter(config: RateLimitConfig): Ratelimit | null {
  if (!upstash) return null

  const key = configKey(config)
  const cached = limiters.get(key)
  if (cached) return cached

  const seconds = Math.max(1, Math.ceil(config.windowMs / 1000))
  const duration = `${seconds} s` as Parameters<typeof Ratelimit.slidingWindow>[1]
  const limiter = new Ratelimit({
    redis: upstash,
    limiter: Ratelimit.slidingWindow(config.max, duration),
    prefix: config.keyPrefix ?? 'rl',
  })
  limiters.set(key, limiter)
  return limiter
}

export async function checkRateLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(config)
  if (limiter) {
    try {
      const result = await limiter.limit(identifier)
      return {
        allowed: result.success,
        remaining: Math.max(0, result.remaining),
        resetAt: result.reset,
        total: 0,
      }
    } catch (error) {
      log.error({ error }, 'Upstash unavailable; using in-memory fallback')
    }
  }

  return memoryLimit(identifier, config)
}

export async function withRateLimit(request: NextRequest, config: RateLimitConfig): Promise<NextResponse | null> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const result = await checkRateLimit(ip, config)

  if (result.allowed) return null

  log.warn({ ip, path: request.nextUrl.pathname }, 'Rate limit exceeded')
  return NextResponse.json(
    { error: 'Too Many Requests' },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))),
        'X-RateLimit-Limit': String(config.max),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.resetAt),
      },
    },
  )
}

export const LIMITS = {
  auth: { max: 5, windowMs: 15 * 60 * 1000, keyPrefix: 'rl:auth' },
  passwordReset: { max: 3, windowMs: 60 * 60 * 1000, keyPrefix: 'rl:pwd' },
  verifyCode: { max: 5, windowMs: 15 * 60 * 1000, keyPrefix: 'rl:verify' },
  api: { max: 100, windowMs: 60 * 1000, keyPrefix: 'rl:api' },
  upload: { max: 10, windowMs: 60 * 1000, keyPrefix: 'rl:upload' },
} satisfies Record<string, RateLimitConfig>

export function getRateLimiter() {
  return upstash
}
