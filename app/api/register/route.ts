import { PrismaClient } from "@prisma/client";
import { sendEmailCode } from "@/lib/mail";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.emailCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  try {
    await sendEmailCode(email, code);
    console.log("✅ Письмо отправлено на", email);
  } catch (err) {
    console.error("❌ Ошибка отправки письма:", err);
    return new Response(JSON.stringify({ error: "MAIL_FAILED", details: String(err) }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }));
}