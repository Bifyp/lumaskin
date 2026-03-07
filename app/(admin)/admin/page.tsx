'use client'

// app/(admin)/admin/page.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Booking = {
  id: string
  firstName: string
  lastName: string
  serviceName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

type Stats = {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}

const STATUS_CONFIG = {
  pending:   { label: 'Очікує',       color: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Підтверджено', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Скасовано',    color: 'bg-red-50 text-red-500 border-red-200' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

const NAV_SECTIONS = [
  {
    href: '/admin/bookings',
    icon: '📅',
    title: 'Бронювання',
    desc: 'Перегляд та управління записами клієнтів',
    accent: 'from-amber-50 to-orange-50 border-amber-200/60',
    iconBg: 'bg-amber-100',
  },
  {
    href: '/admin/gallery',
    icon: '🖼️',
    title: 'Галерея',
    desc: 'Завантаження та організація фотографій',
    accent: 'from-sky-50 to-blue-50 border-sky-200/60',
    iconBg: 'bg-sky-100',
  },
  {
    href: '/admin/packages',
    icon: '📦',
    title: 'Пакети',
    desc: 'Налаштування пакетів та цін',
    accent: 'from-violet-50 to-purple-50 border-violet-200/60',
    iconBg: 'bg-violet-100',
  },
  {
    href: '/admin/services',
    icon: '✨',
    title: 'Послуги',
    desc: 'Управління переліком послуг студії',
    accent: 'from-emerald-50 to-teal-50 border-emerald-200/60',
    iconBg: 'bg-emerald-100',
  },
  {
    href: '/admin/translations',
    icon: '🌐',
    title: 'Переклади',
    desc: 'Редагування текстів сайту (uk/ru/pl/en)',
    accent: 'from-rose-50 to-pink-50 border-rose-200/60',
    iconBg: 'bg-rose-100',
  },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, cancelled: 0 })
  const [recent, setRecent] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats ?? { total: 0, pending: 0, confirmed: 0, cancelled: 0 })
        // Останні 5 бронювань, відсортовані за датою створення
        const sorted = (data.bookings ?? [])
          .slice()
          .sort((a: Booking & { createdAt: string }, b: Booking & { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
        setRecent(sorted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const greeting =
    now.getHours() < 12 ? 'Доброго ранку' :
    now.getHours() < 17 ? 'Доброго дня' : 'Доброго вечора'

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6 md:p-10 space-y-10">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="border-b border-[#C6A667]/30 pb-7">
        <span className="text-[#C6A667] text-xs uppercase tracking-[0.3em] font-medium mb-2 block">
          Luma Skin Laser Studio
        </span>
        <h1 className="text-4xl font-serif text-[#1a1a1a]">{greeting} 👋</h1>
        <p className="text-[#1a1a1a]/40 text-sm mt-1.5 font-light">
          {now.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]/40 font-medium mb-4">
          Статистика бронювань
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'total',     label: 'Всього',        icon: '📋', bg: 'bg-[#F8F4EE]',   text: 'text-[#1a1a1a]' },
            { key: 'pending',   label: 'Очікують',      icon: '⏳', bg: 'bg-amber-50',    text: 'text-amber-700' },
            { key: 'confirmed', label: 'Підтверджено',  icon: '✅', bg: 'bg-emerald-50',  text: 'text-emerald-700' },
            { key: 'cancelled', label: 'Скасовано',     icon: '❌', bg: 'bg-red-50',      text: 'text-red-500' },
          ].map(({ key, label, icon, bg, text }) => (
            <Link
              key={key}
              href={key === 'total' ? '/admin/bookings' : `/admin/bookings?filter=${key}`}
              className={`${bg} rounded-2xl p-5 border border-[#C6A667]/10 hover:border-[#C6A667]/40 transition-all group`}
            >
              <div className="text-2xl mb-3">{icon}</div>
              <p className={`text-3xl font-serif ${text}`}>
                {loading ? <span className="inline-block w-8 h-7 bg-current/10 rounded animate-pulse" /> : stats[key as keyof Stats]}
              </p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent bookings ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]/40 font-medium">
            Останні бронювання
          </h2>
          <Link href="/admin/bookings" className="text-xs text-[#C6A667] hover:underline">
            Всі →
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#C6A667]/20 divide-y divide-gray-50">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C6A667]/20 flex items-center justify-center h-32 text-sm text-[#1a1a1a]/30">
            Бронювань ще немає
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#C6A667]/20 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F4EE] border-b border-[#C6A667]/20">
                  <th className="text-left py-3 px-5 text-[#1a1a1a]/40 text-xs uppercase tracking-wider font-medium">Клієнт</th>
                  <th className="text-left py-3 px-5 text-[#1a1a1a]/40 text-xs uppercase tracking-wider font-medium hidden md:table-cell">Послуга</th>
                  <th className="text-left py-3 px-5 text-[#1a1a1a]/40 text-xs uppercase tracking-wider font-medium">Дата</th>
                  <th className="text-left py-3 px-5 text-[#1a1a1a]/40 text-xs uppercase tracking-wider font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((b) => {
                  const cfg = STATUS_CONFIG[b.status]
                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[#FAFAF8] transition-colors cursor-pointer"
                      onClick={() => window.location.href = '/admin/bookings'}
                    >
                      <td className="py-3.5 px-5 font-medium text-[#1a1a1a]">
                        {b.firstName} {b.lastName}
                      </td>
                      <td className="py-3.5 px-5 text-[#1a1a1a]/70 hidden md:table-cell">
                        {b.serviceName}
                      </td>
                      <td className="py-3.5 px-5 text-[#1a1a1a]/70">
                        {formatDate(b.date)}
                        <span className="ml-1.5 text-xs text-gray-400">{b.time}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Navigation cards ─────────────────────────────────────── */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]/40 font-medium mb-4">
          Розділи адмін-панелі
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_SECTIONS.map(({ href, icon, title, desc, accent, iconBg }) => (
            <Link
              key={href}
              href={href}
              className={`bg-linear-to-br ${accent} border rounded-2xl p-5 hover:shadow-md transition-all group flex items-start gap-4`}
            >
              <div className={`${iconBg} w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <div>
                <p className="font-semibold text-[#1a1a1a] text-sm">{title}</p>
                <p className="text-xs text-[#1a1a1a]/50 mt-1 leading-relaxed">{desc}</p>
              </div>
              <span className="ml-auto text-[#C6A667]/40 group-hover:text-[#C6A667] transition-colors text-lg self-center">→</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}