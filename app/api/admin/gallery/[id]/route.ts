import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/admin/gallery/[id] — обновить alt/category/page
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await req.json().catch(() => ({}))
    console.log('PATCH body:', body)          // <-- лог
    const alt = typeof body.alt === 'string' ? body.alt : undefined
    const category = typeof body.category === 'string' ? body.category : undefined
    const page = typeof body.page === 'string' ? body.page : undefined
    let order: number | undefined
    if (body.order !== undefined && body.order !== null) {
      order = Number(body.order)
      if (Number.isNaN(order)) order = undefined
    }

    const photo = await prisma.gallery.findUnique({ where: { id } })
    if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

    const targetPage = page ?? photo.page

    if (order !== undefined) {
      // сдвигаем остальные кадры на той же странице
      await prisma.gallery.updateMany({
        where: {
          page: targetPage,
          id: { not: id },
          order: { gte: order },
        },
        data: { order: { increment: 1 } },
      })
    }

    const updated = await prisma.gallery.update({
      where: { id },
      data: {
        alt: alt === undefined ? undefined : alt || null,
        category: category === undefined ? undefined : category || null,
        page: targetPage,
        ...(order !== undefined ? { order } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/admin/gallery/[id] error:', error)
    return NextResponse.json(
      { error: 'Update failed', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/gallery/[id] — удалить фото
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params; // Разворачиваем промис
    const photo = await prisma.gallery.findUnique({ where: { id: resolvedParams.id } });

    if (!photo) {
      return NextResponse.json({ error: 'Не знайдено' }, { status: 404 });
    }

    await prisma.gallery.delete({ where: { id: resolvedParams.id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Gallery delete error:', err)
    return NextResponse.json({ error: 'Помилка видалення' }, { status: 500 })
  }
}