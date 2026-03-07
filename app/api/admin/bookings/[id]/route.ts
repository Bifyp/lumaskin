// app/api/admin/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendStatusChangeEmail, formatBookingDate } from '@/lib/booking-mail'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await req.json()

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Невірний статус' }, { status: 400 })
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    })

    sendStatusChangeEmail({
      firstName: booking.firstName,
      lastName: booking.lastName,
      phone: booking.phone,
      email: booking.email,
      serviceName: booking.serviceName,
      date: formatBookingDate(booking.date),
      time: booking.time,
      status,
    }).catch((err) => console.error('[status-mail]', err))

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('[PATCH /api/admin/bookings/:id]', error)
    return NextResponse.json({ error: 'Помилка оновлення' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.booking.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/bookings/:id]', error)
    return NextResponse.json({ error: 'Помилка видалення' }, { status: 500 })
  }
}