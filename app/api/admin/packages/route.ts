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
    const body = await req.json()
    console.log('[POST /api/admin/packages] body:', JSON.stringify(body, null, 2))

    const { title, badge, sessions, price, oldPrice, savings, popular, benefits } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 })
    }

    const data = {
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
    }

    console.log('[POST /api/admin/packages] data to create:', JSON.stringify(data, null, 2))

    const pkg = await prisma.package.create({
      data,
      include: { benefits: true },
    })

    return NextResponse.json({ success: true, package: pkg })
  } catch (error) {
    // Подробный лог ошибки
    console.error('[POST /api/admin/packages] FULL ERROR:', error)
    console.error('[POST /api/admin/packages] ERROR MESSAGE:', (error as Error)?.message)
    console.error('[POST /api/admin/packages] ERROR STACK:', (error as Error)?.stack)

    const message = (error as Error)?.message || 'Невідома помилка'
    return NextResponse.json({ error: 'Помилка створення', details: message }, { status: 500 })
  }
}