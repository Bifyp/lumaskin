import { randomInt } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmailCode } from '@/lib/mail'
import { withRateLimit, LIMITS } from '@/lib/rate-limiter'
import { hashVerificationCode } from '@/lib/verification-code'
import { createLogger } from '@/lib/logger'

const logger = createLogger('register')
const schema = z.object({ email: z.string().trim().toLowerCase().email() })

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.auth)
  if (limited) return limited

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { email } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })

  // Do not reveal whether an account exists.
  if (existing) return NextResponse.json({ ok: true })

  const code = randomInt(100000, 1000000).toString()
  const codeHash = hashVerificationCode(email, code)

  await prisma.$transaction([
    prisma.emailCode.deleteMany({ where: { email } }),
    prisma.emailCode.create({
      data: { email, code: codeHash, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    }),
  ])

  try {
    await sendEmailCode(email, code)
  } catch (error) {
    await prisma.emailCode.deleteMany({ where: { email } })
    logger.error({ error }, 'Failed to send verification email')
    return NextResponse.json({ error: 'Unable to send verification email' }, { status: 503 })
  }

  return NextResponse.json({ ok: true })
}
