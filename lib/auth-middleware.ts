import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from './logger'

const logger = createLogger('auth-middleware')

export async function requireAuth(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    logger.warn({ path: req.nextUrl.pathname }, 'Unauthorized access attempt')
    return null
  }

  return session
}

export async function requireAdminAuth(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    logger.warn({ path: req.nextUrl.pathname }, 'Unauthorized access')
    return null
  }

  const role = (session.user as any).role ?? 'user'
  if (role !== 'admin') {
    logger.warn({ email: session.user.email }, 'Non-admin access attempt')
    return null
  }

  return session
}

export function checkAdminAuth(session: any): boolean {
  const role = session?.user?.role ?? 'user'
  return role === 'admin'
}