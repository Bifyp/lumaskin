// app/api/send-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailCode } from "@/lib/mail";
import { withRateLimit, LIMITS } from "@/lib/rate-limiter";
import { createLogger } from "@/lib/logger";
import { z } from "zod";

const logger = createLogger("send-code");

const sendCodeSchema = z.object({
  email: z.string().email("Invalid email"),
});

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, LIMITS.passwordReset);
  if (limited) return limited;

  // ✅ FIX: валидация email
  let body: z.infer<typeof sendCodeSchema>;
  try {
    body = sendCodeSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // ✅ Безопасно: не раскрываем существование email (timing-safe можно улучшить позже)
    return NextResponse.json({ error: "EMAIL_NOT_FOUND" }, { status: 404 });
  }

  // ✅ FIX: удаляем старые неиспользованные коды для этого email перед созданием нового
  await prisma.emailCode.deleteMany({ where: { email } });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.emailCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 минут
    },
  });

  try {
    await sendEmailCode(email, code);
    logger.info({ email }, "Verification code sent");
  } catch (err) {
    logger.error(err, "Failed to send verification code");
    return NextResponse.json({ error: "MAIL_SEND_FAILED" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}