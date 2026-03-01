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

      {/* 🔥 ТВОЙ АДМИНСКИЙ ХЕДЕР */}
      <AdminHeader />

      {/* 🔥 ОСНОВНАЯ СЕТКА: sidebar + content */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Адмін‑панель</h2>

          <nav className="space-y-2 text-sm font-medium flex-1">
            <Link className="block py-2 hover:text-blue-600" href="/admin">Головна</Link>
            <Separator />
            <Link className="block py-2 hover:text-blue-600" href="/admin/bookings">Бронювання</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/translations">Переклади</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/gallery">Галерея</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/packages">Пакети</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/services">Послуги</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/contact">Контакти</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/hours">Графік роботи</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/cta">CTA блок</Link>
            <Link className="block py-2 hover:text-blue-600" href="/admin/settings">Налаштування сайту</Link>
          </nav>

          <Separator className="my-4" />

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Admin
          </p>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
