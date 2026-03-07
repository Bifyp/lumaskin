import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// Надёжная загрузка конфигурации Cloudinary (серверные переменные)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET
const cloudinaryUrl = process.env.CLOUDINARY_URL

if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl })
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
} else {
  console.error('Cloudinary not configured: set CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET or CLOUDINARY_URL')
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const alt = String(formData.get('alt') ?? '')
    const category = String(formData.get('category') ?? '')
    const page = String(formData.get('page') ?? 'gallery')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // вычисляем следующий order
    const agg = await prisma.gallery.aggregate({
      where: { page },
      _max: { order: true },
    })
    const nextOrder = (agg._max.order ?? -1) + 1

    // загрузка в Cloudinary…
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'gallery', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    const photo = await prisma.gallery.create({
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        alt: alt || null,
        category: category || null,
        page,
        order: nextOrder,
      },
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    )
  }
}