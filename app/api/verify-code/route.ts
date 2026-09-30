import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withRateLimit, LIMITS } from '@/lib/rate-limiter'
import { hashVerificationCode } from '@/lib/verification-code'

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().regex(/^\d{6}$/),
  password: z.string().min(10).max(128),
  name: z.string().trim().min(1).max(100).optional(),
})

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.verifyCode)
  if (limited) return limited

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { email, code, password, name } = parsed.data
  const codeHash = hashVerificationCode(email, code)
  const record = await prisma.emailCode.findFirst({ where: { email, code: codeHash } })

  if (!record || record.expiresAt < new Date()) {
    if (record) await prisma.emailCode.delete({ where: { id: record.id } })
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  const passwordHash = await hash(password, 12)

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { email }, select: { id: true } })
      if (existing) throw new Error('ACCOUNT_EXISTS')

      await tx.user.create({ data: { email, password: passwordHash, name: name ?? null } })
      await tx.emailCode.deleteMany({ where: { email } })
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'ACCOUNT_EXISTS') {
      return NextResponse.json({ error: 'Account already exists' }, { status: 409 })
    }
    throw error
  }

  return NextResponse.json({ success: true })
}
