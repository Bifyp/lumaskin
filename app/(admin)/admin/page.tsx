import Link from "next/link";
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { getCurrentSession } from "@/auth";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/*  ТВОЙ АДМИНСКИЙ ХЕДЕР */}
    
      {/*  ОСНОВНАЯ СЕТКА: sidebar + content */}
      <div className="flex flex-1">

      

        {/* CONTENT */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}