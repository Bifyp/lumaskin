import createMiddleware from 'next-intl/middleware';
import { routing } from 'src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { getRateLimiter } from '@/lib/rate-limiter';

const RATE_LIMIT = {
  windowMs: 60 * 1000,
  maxRequests: 60,
  apiMaxRequests: 200,
};

const memStore = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, isApi: boolean) {
  const now = Date.now();
  const max = isApi ? RATE_LIMIT.apiMaxRequests : RATE_LIMIT.maxRequests;
  const key = `${isApi ? 'api' : 'web'}:${ip}`;
  const entry = memStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + RATE_LIMIT.windowMs;
    memStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  entry.count += 1;
  if (entry.count > max) return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

const IS_DEV =
  process.env.NODE_ENV === 'development' ||
  process.env.SKIP_SECURITY === '1';   // <- новая переменная

function checkCsrf(request: NextRequest): boolean {
  if (IS_DEV) return true;            // полностью пропускаем в dev / при тэсте

  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;

  const origin  = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host    = request.headers.get('host');
  if (!host) return false;

  const allowed = [
    `https://${host}`,
    `http://${host}`,
    'http://localhost:3000',      // <–– добавили
    'http://127.0.0.1:3000',      // <–– добавили
    process.env.NEXTAUTH_URL,
  ].filter(Boolean) as string[];

  if (origin)  return allowed.some((o) => origin.startsWith(o));
  if (referer) return allowed.some((o) => referer.startsWith(o));
  return false;
}

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
].join('; ');

function applySecurityHeaders(res: NextResponse): void {
  res.headers.set('Content-Security-Policy', CSP);
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function sendLog(
  request: NextRequest,
  payload: { level: string; msg: string; ip: string; [k: string]: unknown },
) {
  void fetch(new URL('/api/internal/log', request.url).toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-secret': process.env.INTERNAL_LOG_SECRET ?? '',
    },
    body: JSON.stringify(payload),
  }).catch(() => null);
}

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api');
  const method = request.method;

  // Rate limit
  const rl = rateLimit(ip, isApi);

  if (!rl.allowed) {
    sendLog(request, { level: 'warn', msg: 'Rate limit exceeded', ip, method, path: pathname });
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        'X-RateLimit-Limit': String(isApi ? RATE_LIMIT.apiMaxRequests : RATE_LIMIT.maxRequests),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(rl.resetAt),
      },
    });
  }

  // CSRF только для API
  if (isApi && !checkCsrf(request)) {
    sendLog(request, { level: 'warn', msg: 'CSRF check failed', ip, method, path: pathname });
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── API — NextResponse.next() без intl, иначе URL получает локаль ──
  if (isApi) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT.apiMaxRequests));
    response.headers.set('X-RateLimit-Remaining', String(rl.remaining));
    response.headers.set('X-RateLimit-Reset', String(rl.resetAt));
    return response;
  }

  // ── Страницы — intl + security headers ──
  const response = intlMiddleware(request);
  applySecurityHeaders(response);
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT.maxRequests));
  response.headers.set('X-RateLimit-Remaining', String(rl.remaining));
  response.headers.set('X-RateLimit-Reset', String(rl.resetAt));
  return response;
}

export const config = {
  matcher: [
    '/',
    '/(pl|ru|uk|en)',
    '/(pl|ru|uk|en)/((?!api|_next).*)',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/(.*)',
  ],
};