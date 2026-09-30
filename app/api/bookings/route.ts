import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewBookingEmails, formatBookingDate } from '@/lib/booking-mail'
import { createLogger } from '@/lib/logger'
import { z } from 'zod'

const logger = createLogger('bookings')
const bookingSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().toLowerCase().email(),
  serviceName: z.string().trim().min(1).max(200),
  date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  comment: z.string().trim().max(1000).optional(),
})

class SlotTakenError extends Error {}

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get('date')
  if (!date || Number.isNaN(Date.parse(date))) {
    return NextResponse.json({ error: 'Valid date required' }, { status: 400 })
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { date: new Date(date), status: { not: 'cancelled' } },
      select: { time: true },
    })
    return NextResponse.json({ bookedSlots: bookings.map(({ time }) => time) })
  } catch (error) {
    logger.error({ error }, 'Failed to fetch bookings')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const parsed = bookingSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const bookingDate = new Date(data.date)
  if (bookingDate.getTime() < Date.now() - 86_400_000) {
    return NextResponse.json({ error: 'Date is in the past' }, { status: 400 })
  }

  try {
    // SQLite serializes this interactive transaction, preventing the common
    // check-then-create race on a single production database.
    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findFirst({
        where: { date: bookingDate, time: data.time, status: { not: 'cancelled' } },
        select: { id: true },
      })
      if (existing) throw new SlotTakenError()

      return tx.booking.create({
        data: { ...data, date: bookingDate, comment: data.comment || null, status: 'pending' },
      })
    })

    const service = await prisma.service.findFirst({ where: { title: data.serviceName } })
    try {
      await sendNewBookingEmails({
        ...data,
        servicePrice: service?.price ?? undefined,
        date: formatBookingDate(booking.date),
        comment: data.comment || undefined,
      })
    } catch (error) {
      logger.error({ error, bookingId: booking.id }, 'Booking created but email delivery failed')
    }

    return NextResponse.json({
      success: true,
      booking: { id: booking.id, status: booking.status, date: booking.date, time: booking.time },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return NextResponse.json({ error: 'slot_taken' }, { status: 409 })
    }
    logger.error({ error }, 'Failed to create booking')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
