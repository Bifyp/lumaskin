// app/api/page-photos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const page = String(req.nextUrl.searchParams.get('page') || '')
  const photos = await prisma.gallery.findMany({
    where: { page },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(photos)
}