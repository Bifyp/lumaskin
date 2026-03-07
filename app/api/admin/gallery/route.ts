import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const photos = await prisma.gallery.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(photos) // Возвращаем массив напрямую
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}