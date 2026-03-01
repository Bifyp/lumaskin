import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();

  await prisma.translation.create({
  data: {
    key: data.get("key") as string,
    locale: data.get("locale") as string,
    value: data.get("value") as string,
    namespace: data.get("namespace") as string
  }
});
  return NextResponse.redirect("/admin/translations");
}
