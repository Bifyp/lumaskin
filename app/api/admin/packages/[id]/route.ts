import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  title: z.string().trim().min(1).max(150),
  badge: z.string().trim().max(80).nullable().optional(),
  sessions: z.string().trim().max(80),
  price: z.coerce.number().int().min(0),
  oldPrice: z.coerce.number().int().min(0),
  savings: z.string().trim().max(120),
  popular: z.boolean(),
  benefits: z.array(z.string().trim().min(1).max(300)).max(30),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  try {
    const { benefits, ...data } = parsed.data
    const result = await prisma.$transaction(async (tx) => {
      await tx.benefit.deleteMany({ where: { packageId: id } })
      return tx.package.update({
        where: { id },
        data: {
          ...data,
          badge: data.badge || null,
          benefits: { create: benefits.map((text) => ({ text })) },
        },
        include: { benefits: true },
      })
    })
    return NextResponse.json({ success: true, package: result })
  } catch (error) {
    console.error('Package update failed', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.package.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Package delete failed', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
