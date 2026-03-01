import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, code, password } = await req.json();

  const record = await prisma.emailCode.findFirst({
    where: { email, code },
  });

  if (!record) {
    return new Response(JSON.stringify({ error: "Invalid code" }), { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    return new Response(JSON.stringify({ error: "Code expired" }), { status: 400 });
  }

  // Удаляем код
  await prisma.emailCode.delete({ where: { id: record.id } });

  // Создаём пользователя
  const hashed = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });

  return new Response(JSON.stringify({ success: true }));
}
