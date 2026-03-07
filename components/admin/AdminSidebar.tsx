'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/bookings', icon: '📅', title: 'Бронювання' },
  { href: '/admin/gallery', icon: '🖼️', title: 'Галерея' },
  { href: '/admin/services', icon: '✨', title: 'Послуги' },
  { href: '/admin/packages', icon: '🎁', title: 'Пакети' },
  { href: '/admin/translations', icon: '🌐', title: 'Переклади' },
  { href: '/admin/security', icon: '🔒', title: 'Безпека' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-[#C6A667]/20 min-h-screen p-6 hidden md:block">
      <h2 className="text-[#C6A667] text-xs uppercase tracking-[0.3em] mb-6">
        Admin Panel
      </h2>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                ${active
                  ? 'bg-[#C6A667]/10 text-[#C6A667] font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
