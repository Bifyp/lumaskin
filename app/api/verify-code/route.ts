// app/api/verify-code/route.ts
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { withRateLimit, LIMITS } from "@/lib/rate-limiter";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.verifyCode);
  if (limited) return limited;

  const { email, code, password, name } = await req.json();

  const record = await prisma.emailCode.findFirst({
    where: { email, code },
  });

  if (!record) {
    return new Response(JSON.stringify({ error: "Invalid code" }), { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    return new Response(JSON.stringify({ error: "Code expired" }), { status: 400 });
  }

  await prisma.emailCode.delete({ where: { id: record.id } });

  const hashed = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: name || null,
    },
  });

  return new Response(JSON.stringify({ success: true }));
}