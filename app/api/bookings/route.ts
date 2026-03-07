// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNewBookingEmails, formatBookingDate } from "@/lib/booking-mail";
import { createLogger } from "@/lib/logger";
import { z } from "zod";

const logger = createLogger("bookings");

// ✅ FIX: Zod-схема для валидации
const bookingSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  serviceName: z.string().min(1).max(200),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  comment: z.string().max(1000).optional(),
});

// GET /api/bookings?date=2025-05-12
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || isNaN(Date.parse(date))) {
    return NextResponse.json({ error: "Valid date required" }, { status: 400 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { not: "cancelled" },
      },
      select: { time: true },
    });

    return NextResponse.json({ bookedSlots: bookings.map((b) => b.time) });
  } catch (err) {
    logger.error(err, "Failed to fetch bookings");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // ✅ FIX: валидация входных данных
  let data: z.infer<typeof bookingSchema>;
  try {
    data = bookingSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { firstName, lastName, phone, email, serviceName, date, time, comment } = data;

  try {
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

    // ✅ FIX: logger вместо console.log
    try {
      await sendNewBookingEmails({
        firstName, lastName, phone, email, serviceName,
        servicePrice: service?.price ?? undefined,
        date: formatBookingDate(booking.date),
        time,
        comment: comment || undefined,
      });
      logger.info({ bookingId: booking.id }, "Booking emails sent");
    } catch (err) {
      logger.error(err, "Failed to send booking emails");
      // Не возвращаем ошибку — букинг создан успешно, письмо второстепенно
    }

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    logger.error(err, "Failed to create booking");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}