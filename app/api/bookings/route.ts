import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewBookingEmails, formatBookingDate } from "@/lib/booking-mail";

// GET /api/bookings?date=2025-05-12
// Возвращает занятые слоты для указанной даты
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      date: new Date(date),
      status: { not: "cancelled" },
    },
    select: { time: true },
  });

  const bookedSlots = bookings.map((b) => b.time);

  return NextResponse.json({ bookedSlots });
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

  const service = await prisma.service.findFirst({
    where: { title: serviceName },
  });

  try {
    await sendNewBookingEmails({
      firstName, lastName, phone, email, serviceName,
      servicePrice: service?.price ?? undefined,
      date: formatBookingDate(booking.date),
      time,
      comment: comment || undefined,
    });
    console.log("✅ Письма отправлены");
  } catch (err) {
    console.error("❌ Ошибка отправки письма:", err);
  }

  return NextResponse.json({ success: true, booking });
}