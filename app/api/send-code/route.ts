import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailCode } from "@/lib/mail";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "EMAIL_NOT_FOUND" }, { status: 404 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.emailCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10)
    }
  });

  try {
    await sendEmailCode(email, code);
    console.log("✅ Письмо отправлено на", email);
  } catch (err) {
    console.error("❌ Ошибка отправки письма:", err); // ВОТ ЭТО ГЛАВНОЕ
    return NextResponse.json({ error: "MAIL_SEND_FAILED", details: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}