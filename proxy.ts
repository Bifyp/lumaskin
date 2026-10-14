import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'
import { routing } from './src/i18n/routing'

const RATE_LIMIT = { windowMs: 60_000, maxRequests: 60, apiMaxRequests: 200 }
const store = new Map<string, { count: number; resetAt: number }>()
const IS_DEV = process.env.NODE_ENV === 'development'

function rateLimit(ip: string, isApi: boolean) {
  const now = Date.now()
  const max = isApi ? RATE_LIMIT.apiMaxRequests : RATE_LIMIT.maxRequests
  const key = `${isApi ? 'api' : 'web'}:${ip}`
  const entry = store.get(key)
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + RATE_LIMIT.windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: max - 1, resetAt }
  }
  entry.count += 1
  return { allowed: entry.count <= max, remaining: Math.max(0, max - entry.count), resetAt: entry.resetAt }
}

function sourceOrigin(value: string | null): string | null {
  if (!value) return null
  try { return new URL(value).origin } catch { return null }
}

function checkCsrf(request: NextRequest): boolean {
  if (IS_DEV || ['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase())) return true

  const configured = [process.env.APP_URL, process.env.AUTH_URL, process.env.NEXTAUTH_URL]
    .filter((value): value is string => Boolean(value))
    .map(sourceOrigin)
    .filter((value): value is string => Boolean(value))
  const allowed = new Set([request.nextUrl.origin, ...configured])
  const incoming = sourceOrigin(request.headers.get('origin')) ?? sourceOrigin(request.headers.get('referer'))
  return incoming !== null && allowed.has(incoming)
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  const scripts = IS_DEV ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'"
  const csp = [
    "default-src 'self'", scripts,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self'", "frame-ancestors 'none'", "form-action 'self'", "base-uri 'self'", "object-src 'none'",
  ].join('; ')
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

const intlMiddleware = createMiddleware(routing)

export default auth(async function proxy(request) {
  const { pathname } = request.nextUrl
  const isApi = pathname.startsWith('/api')
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  if (pathname.startsWith('/api/admin')) {
    if (!request.auth?.user) return applySecurityHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
    const role = (request.auth.user as { role?: string }).role
    if (role !== 'admin') return applySecurityHeaders(NextResponse.json({ error: 'Forbidden' }, { status: 403 }))
  }

  const limit = rateLimit(ip, isApi)
  if (!limit.allowed) {
    return applySecurityHeaders(NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))) } },
    ))
  }

  if (isApi && !checkCsrf(request)) {
    return applySecurityHeaders(NextResponse.json({ error: 'Forbidden' }, { status: 403 }))
  }

  const response = isApi ? NextResponse.next() : intlMiddleware(request)
  response.headers.set('X-RateLimit-Remaining', String(limit.remaining))
  response.headers.set('X-RateLimit-Reset', String(limit.resetAt))
  return applySecurityHeaders(response)
})

export const config = {
  matcher: ['/', '/(pl|ru|uk|en)', '/(pl|ru|uk|en)/((?!api|_next).*)', '/login', '/register', '/forgot-password', '/reset-password', '/api/(.*)'],
}
