// app/api/admin/packages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: { benefits: true },
      orderBy: { title: 'asc' },
    })
    return NextResponse.json({ packages })
  } catch (error) {
    console.error('[GET /api/admin/packages]', error)
    return NextResponse.json({ error: 'Помилка завантаження' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, badge, sessions, price, oldPrice, savings, popular, benefits } = await req.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 })
    }

    const pkg = await prisma.package.create({
      data: {
        title: title.trim(),
        badge: badge?.trim() || null,
        sessions: sessions?.trim() || '',
        price: Number(price) || 0,
        oldPrice: Number(oldPrice) || 0,
        savings: savings?.trim() || '',
        popular: !!popular,
        benefits: {
          create: (benefits || []).filter((b: string) => b.trim()).map((text: string) => ({ text: text.trim() })),
        },
      },
      include: { benefits: true },
    })

    return NextResponse.json({ success: true, package: pkg })
  } catch (error) {
    console.error('[POST /api/admin/packages]', error)
    return NextResponse.json({ error: 'Помилка створення' }, { status: 500 })
  }
}