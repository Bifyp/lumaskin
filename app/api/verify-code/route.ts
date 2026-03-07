// app/api/verify-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ FIX 1: используем singleton, не new PrismaClient()
import { hash } from "bcryptjs";
import { withRateLimit, LIMITS } from "@/lib/rate-limiter";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.verifyCode);
  if (limited) return limited;

  // ✅ FIX: валидация входных данных
  let body: z.infer<typeof verifySchema>;
  try {
    body = verifySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, code, password, name } = body;

  const record = await prisma.emailCode.findFirst({
    where: { email, code },
  });

  if (!record) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    await prisma.emailCode.delete({ where: { id: record.id } });
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }

  // ✅ FIX 2: проверяем что пользователь ещё не существует
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.emailCode.delete({ where: { id: record.id } });
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  await prisma.emailCode.delete({ where: { id: record.id } });

  const hashed = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: name ?? null,
    },
  });

  return NextResponse.json({ success: true });
}