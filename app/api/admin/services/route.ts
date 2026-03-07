import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany()
    return NextResponse.json({ services })
  } catch (error) {
    console.error('[GET /api/admin/services]', error)
    return NextResponse.json({ error: 'Помилка завантаження' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== POST /api/admin/services HIT ===')
    
    const body = await req.json()
    console.log('body:', body)
    
    const { icon, title, desc, price } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 })
    }

   const service = await prisma.service.create({
  data: {
    icon: icon || '✨',
    title: title.trim(),
    desc: desc?.trim() || '',
    price: price?.trim() || '',  // ← этого нет у тебя
  },
})

    console.log('created:', service)
    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('[POST /api/admin/services]', error)
    return NextResponse.json({ error: 'Помилка створення' }, { status: 500 })
  }
}