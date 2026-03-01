import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.formData();
  const method = data.get("_method");

  if (method === "PUT") {
    await prisma.translation.update({
      where: { id: params.id },
      data: {
        key: data.get("key") as string,
        locale: data.get("locale") as string,
        value: data.get("value") as string
      }
    });
  }

  return NextResponse.redirect("/admin/translations");
}
