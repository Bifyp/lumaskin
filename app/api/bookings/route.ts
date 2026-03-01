import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  const { firstName, lastName, phone, email, serviceName, date, time, comment } = data;

  // Проверка занятости
  const existing = await prisma.booking.findFirst({
    where: {
      date: new Date(date),
      time,
      status: { not: "cancelled" }
    }
  });

  if (existing) {
    return NextResponse.json({ error: "slot_taken" }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      firstName,
      lastName,
      phone,
      email,
      serviceName,
      date: new Date(date),
      time,
      comment,
      status: "pending"
    }
  });

  return NextResponse.json({ success: true, booking });
}
