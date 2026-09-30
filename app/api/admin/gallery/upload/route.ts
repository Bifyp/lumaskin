import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import { withRateLimit, LIMITS } from '@/lib/rate-limiter'

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (process.env.CLOUDINARY_URL) cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL })
else if (cloudName && apiKey && apiSecret) cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.upload)
  if (limited) return limited

  let uploaded: UploadApiResponse | null = null
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 })
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Image must be at most 8 MB' }, { status: 413 })

    const alt = String(formData.get('alt') ?? '').trim().slice(0, 250)
    const category = String(formData.get('category') ?? '').trim().slice(0, 80)
    const page = String(formData.get('page') ?? 'gallery').trim().slice(0, 80) || 'gallery'
    const maxOrder = await prisma.gallery.aggregate({ where: { page }, _max: { order: true } })
    const buffer = Buffer.from(await file.arrayBuffer())

    uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'gallery', resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'] },
        (error, result) => error || !result ? reject(error ?? new Error('Empty Cloudinary response')) : resolve(result),
      )
      stream.end(buffer)
    })

    const photo = await prisma.gallery.create({
      data: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        alt: alt || null,
        category: category || null,
        page,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })
    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    if (uploaded?.public_id) await cloudinary.uploader.destroy(uploaded.public_id).catch(() => undefined)
    console.error('Gallery upload failed', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
