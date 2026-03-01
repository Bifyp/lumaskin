"use client";

import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="w-full bg-white border-b shadow-sm p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Admin Panel</h1>

      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Главная
      </Link>
    </header>
  );
}
