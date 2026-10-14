import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

const updateSchema = z.object({
  alt: z.string().trim().max(250).optional(),
  category: z.string().trim().max(80).optional(),
  page: z.string().trim().min(1).max(80).optional(),
  order: z.coerce.number().int().min(0).optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parsed = updateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  try {
    const current = await prisma.gallery.findUnique({ where: { id } })
    if (!current) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

    const { alt, category, page, order } = parsed.data
    const targetPage = page ?? current.page
    const updated = await prisma.$transaction(async (tx) => {
      if (order !== undefined) {
        await tx.gallery.updateMany({
          where: { page: targetPage, id: { not: id }, order: { gte: order } },
          data: { order: { increment: 1 } },
        })
      }
      return tx.gallery.update({
        where: { id },
        data: {
          ...(alt !== undefined && { alt: alt || null }),
          ...(category !== undefined && { category: category || null }),
          ...(page !== undefined && { page }),
          ...(order !== undefined && { order }),
        },
      })
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Gallery update failed', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const photo = await prisma.gallery.findUnique({ where: { id } })
    if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 })

    await cloudinary.uploader.destroy(photo.publicId, { resource_type: 'image' })
    await prisma.gallery.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery delete failed', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
