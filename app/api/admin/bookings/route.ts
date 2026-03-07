// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewBookingEmails, formatBookingDate } from "@/lib/booking-mail";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = Number(searchParams.get('limit')) || 100

    const bookings = await prisma.booking.findMany({
      where: status && status !== 'all' ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const total     = await prisma.booking.count()
    const pending   = await prisma.booking.count({ where: { status: 'pending' } })
    const confirmed = await prisma.booking.count({ where: { status: 'confirmed' } })
    const cancelled = await prisma.booking.count({ where: { status: 'cancelled' } })
    const completed = await prisma.booking.count({ where: { status: 'completed' } })

    return NextResponse.json({ bookings, stats: { total, pending, confirmed, cancelled, completed } })
  } catch (error) {
    console.error('[GET /api/admin/bookings]', error)
    return NextResponse.json({ error: 'Помилка завантаження' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const { firstName, lastName, phone, email, serviceName, date, time, comment } = data;

  const existing = await prisma.booking.findFirst({
    where: {
      date: new Date(date),
      time,
      status: { not: "cancelled" },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "slot_taken" }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      firstName, lastName, phone, email, serviceName,
      date: new Date(date), time, comment, status: "pending",
    },
  });

  const service = await prisma.service.findFirst({ where: { title: serviceName } });

  sendNewBookingEmails({
    firstName, lastName, phone, email, serviceName,
    servicePrice: service?.price ?? undefined,
    date: formatBookingDate(booking.date),
    time, comment: comment || undefined,
  }).catch((err) => console.error("[booking-mail]", err));

  return NextResponse.json({ success: true, booking });
}