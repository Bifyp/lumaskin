// lib/rate-limiter.ts
// Redis sliding window rate limiter для route handlers
// (middleware использует in-memory из-за edge runtime ограничений)

import { createClient } from 'redis';
import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from './logger';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const log = createLogger('rate-limiter');

// ── Redis singleton ───────────────────────────────────────────
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
    redisClient.on('error', (err) => log.error({ err }, 'Redis error'));
    await redisClient.connect();
  }
  return redisClient;
}

// ── Types ─────────────────────────────────────────────────────
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  total: number;
}

// ── In-memory fallback ────────────────────────────────────────
const memStore = new Map<string, { count: number; resetAt: number }>();

function checkMemoryLimit(
  identifier: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const key = config.keyPrefix ? `${config.keyPrefix}:${identifier}` : identifier;
  const entry = memStore.get(key);

  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs, total: 1 };
  }

  entry.count += 1;
  if (entry.count > config.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, total: entry.count };
  }

  return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt, total: entry.count };
}

// ── Upstash Redis (если есть переменные) ──────────────────────
let upstashLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    upstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
    });
    log.info('Upstash rate limiter initialized');
  } catch (e) {
    log.warn({ err: e }, 'Failed to initialize Upstash rate limiter, falling back to memory');
  }
} else {
  log.info('UPSTASH_REDIS_REST_URL/TOKEN not set, using in-memory rate limiter');
}

// ── Main rate limit function ──────────────────────────────────
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  if (upstashLimiter) {
    try {
      const { success, remaining, reset } = await upstashLimiter.limit(identifier);
      const resetAt = reset;
      return {
        allowed: success,
        remaining: Math.max(0, remaining),
        resetAt,
        total: 0,
      };
    } catch (e) {
      log.error({ err: e }, 'Upstash error, falling back to memory');
    }
  }

  return checkMemoryLimit(identifier, config);
}

// ── Хелпер для route handlers ─────────────────────────────────
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const result = await checkRateLimit(ip, config);

  if (!result.allowed) {
    log.warn({ ip, path: request.nextUrl.pathname }, 'Rate limit exceeded');

    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        'X-RateLimit-Limit': String(config.max),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.resetAt),
      },
    });
  }

  return null;
}

// ── Готовые конфиги ───────────────────────────────────────────
export const LIMITS = {
  auth:          { max: 5,   windowMs: 15 * 60 * 1000, keyPrefix: 'rl:auth'   } satisfies RateLimitConfig,
  passwordReset: { max: 3,   windowMs: 60 * 60 * 1000, keyPrefix: 'rl:pwd'    } satisfies RateLimitConfig,
  verifyCode:    { max: 100,  windowMs: 15 * 60 * 1000, keyPrefix: 'rl:verify' } satisfies RateLimitConfig,
  api:           { max: 100, windowMs: 60 * 1000,       keyPrefix: 'rl:api'    } satisfies RateLimitConfig,
  upload:        { max: 10,  windowMs: 60 * 1000,       keyPrefix: 'rl:upload' } satisfies RateLimitConfig,
};

export function getRateLimiter() {
  return upstashLimiter;
}