import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { date, time } = await req.json();

  if (!date || !time) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.booking.findFirst({
    where: {
      date: new Date(date),
      time,
      status: { not: "cancelled" }
    }
  });

  return NextResponse.json({ taken: !!existing });
}
