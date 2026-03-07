import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { icon, title, desc, price } = await req.json()

    if (title !== undefined && !title?.trim()) {
      return NextResponse.json({ error: "Назва обов'язкова" }, { status: 400 })
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(icon !== undefined && { icon }),
        ...(title !== undefined && { title: title.trim() }),
        ...(desc !== undefined && { desc: desc.trim() }),
        ...(price !== undefined && { price: price.trim() }),
      },
    })

    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('[PATCH /api/admin/services/:id]', error)
    return NextResponse.json({ error: 'Помилка оновлення' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/services/:id]', error)
    return NextResponse.json({ error: 'Помилка видалення' }, { status: 500 })
  }
}