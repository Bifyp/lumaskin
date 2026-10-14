import { createHmac, timingSafeEqual } from 'node:crypto'

function secret(): string {
  const value = process.env.EMAIL_CODE_SECRET ?? process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!value) throw new Error('EMAIL_CODE_SECRET or AUTH_SECRET must be configured')
  return value
}

export function hashVerificationCode(email: string, code: string): string {
  return createHmac('sha256', secret())
    .update(`${email.trim().toLowerCase()}:${code}`)
    .digest('hex')
}

export function verificationCodeMatches(email: string, code: string, storedHash: string): boolean {
  const actual = Buffer.from(hashVerificationCode(email, code), 'hex')
  const expected = Buffer.from(storedHash, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
