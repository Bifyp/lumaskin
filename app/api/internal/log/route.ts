// app/api/internal/log/route.ts
// Endpoint для логирования из middleware (edge runtime не поддерживает pino напрямую)

import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const log = createLogger('middleware');

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get('x-internal-secret');
  return !!secret && secret === process.env.INTERNAL_LOG_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { level = 'info', msg = '', ...meta } = body;

  switch (String(level)) {
    case 'security':
    case 'warn':
      log.warn(meta, String(msg));
      break;
    case 'error':
      log.error(meta, String(msg));
      break;
    default:
      log.info(meta, String(msg));
  }

  return NextResponse.json({ ok: true });
}