'use client'

import { useState, useEffect, useRef } from 'react'

type Translations = Record<string, string>

// ─── Inline редактируемый текст ───────────────────────────────────────────────

function EditableText({
  value,
  tKey,
  tag = 'span',
  className = '',
  onSave,
  italic = false,
}: {
  value: string
  tKey: string
  tag?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  onSave: (key: string, value: string) => Promise<void>
  italic?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [current, setCurrent] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    setCurrent(value)
  }, [value])

  const handleSave = async () => {
    if (current === value) { setEditing(false); return }
    setSaving(true)
    await onSave(tKey, current)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') { setCurrent(value); setEditing(false) }
  }

  const Tag = tag

  if (editing) {
    return (
      <span className="relative inline-block w-full">
        <textarea
          autoFocus
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white/90 border-2 border-indigo-400 rounded px-2 py-1 text-graphite resize-none outline-none shadow-lg ${className}`}
          rows={current.length > 60 ? 3 : 1}
        />
        <span className="absolute -bottom-8 right-0 flex gap-2 z-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white text-xs px-3 py-1 rounded shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? '...' : '✓ Сохранить'}
          </button>
          <button
            onClick={() => { setCurrent(value); setEditing(false) }}
            className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded shadow hover:bg-gray-300"
          >
            ✕
          </button>
        </span>
      </span>
    )
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement & HTMLHeadingElement & HTMLParagraphElement>}
      className={`${className} relative group cursor-pointer`}
      onClick={() => setEditing(true)}
      title="Нажмите чтобы редактировать"
    >
      {italic ? <em>{current}</em> : current}
      {saved && (
        <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded shadow">
          ✓ Сохранено
        </span>
      )}
      <span className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400/60 group-hover:bg-indigo-50/20 rounded transition-all pointer-events-none" />
      <span className="absolute -top-5 right-0 hidden group-hover:block bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
        ✏️ {tKey}
      </span>
    </Tag>
  )
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function HomePageEditor() {
  const [t, setT] = useState<Translations>({})
  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/translations')
      .then((r) => r.json())
      .then((data) => {
        // Разворачиваем плоские ключи секции HomePage в удобный объект
        const flat: Translations = {}
        const sections = data.sections || {}
        for (const [section, keys] of Object.entries(sections)) {
          for (const [key, value] of Object.entries(keys as Record<string, string>)) {
            flat[`${section}.${key}`] = value
          }
        }
        setT(flat)
        setLoading(false)
      })
  }, [])

  const get = (key: string) => t[`HomePage.${key}`] ?? key

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (fullKey: string, value: string) => {
    // fullKey вида "HomePage.hero.title"
    const parts = fullKey.split('.')
    const section = parts[0]          // "HomePage"
    const key = parts.slice(1).join('.')  // "hero.title"

    setSavingSection(key)
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, key, value }),
      })
      const data = await res.json()
      if (data.success) {
        setT((prev) => ({ ...prev, [fullKey]: value }))
        showToast(`✅ Переведено на RU / PL / UK`)
      } else {
        showToast(`❌ Ошибка: ${data.error}`)
      }
    } catch {
      showToast('❌ Ошибка соединения')
    }
    setSavingSection(null)
  }

  const e = (key: string, tag: 'span' | 'h1' | 'h2' | 'h3' | 'p' = 'span', className = '', italic = false) => (
    <EditableText
      value={get(key)}
      tKey={`HomePage.${key}`}
      tag={tag}
      className={className}
      onSave={handleSave}
      italic={italic}
    />
  )

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-gray-400 text-sm">Загрузка страницы...</div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Панель инструментов */}
      <div className="sticky top-0 z-50 bg-indigo-600 text-white text-sm px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="font-semibold">✏️ Режим редактирования</span>
          <span className="text-indigo-200 text-xs">Нажмите на любой текст чтобы изменить</span>
        </div>
        <div className="flex items-center gap-4">
          {savingSection && (
            <span className="text-indigo-200 text-xs animate-pulse">
              Переводим на RU/PL/UK...
            </span>
          )}
          <a
            href="/admin/translations"
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition"
          >
            ← Таблица переводов
          </a>
        </div>
      </div>

      {/* Тост */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      {/* ═══ СТРАНИЦА КАК НА САЙТЕ ═══ */}
      <div className="overflow-hidden font-sans" style={{ fontFamily: 'inherit' }}>

        {/* HERO */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-white">
          <div className="container text-center relative z-10 px-6 max-w-5xl mx-auto">
            <div className="inline-block mb-8">
              <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm">
                {e('hero.subtitle')}
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-serif mb-8 text-gray-800 leading-tight">
              {e('hero.title', 'span', 'text-6xl md:text-7xl font-serif text-gray-800')}<br />
              <span className="text-yellow-600 italic">
                {e('hero.titleAccent', 'span', 'text-yellow-600')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              {e('hero.description')}<br />
              {e('hero.descriptionLine2')}
            </p>

            <div className="flex gap-6 justify-center flex-wrap">
              <span className="px-10 py-4 bg-yellow-600 text-white uppercase tracking-widest text-sm rounded-sm">
                {e('hero.bookButton')}
              </span>
              <span className="px-10 py-4 border-2 border-yellow-600 text-yellow-600 uppercase tracking-widest text-sm rounded-sm">
                {e('hero.servicesButton')}
              </span>
            </div>
          </div>
        </section>

        {/* УСЛУГИ */}
        <section className="py-32 bg-stone-50">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
                {e('services.subtitle')}
              </span>
              <h2 className="text-5xl font-serif text-gray-800">{e('services.title', 'h2', 'text-5xl font-serif text-gray-800')}</h2>
              <div className="w-20 h-px bg-yellow-600 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { prefix: 'services.facial', icon: get('services.facial.icon') },
                { prefix: 'services.peeling', icon: get('services.peeling.icon') },
                { prefix: 'services.massage', icon: get('services.massage.icon') },
              ].map(({ prefix, icon }) => (
                <div key={prefix} className="p-8 bg-white border border-yellow-600/20 hover:border-yellow-600 hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl mb-6">{icon}</div>
                  <h3 className="text-2xl font-serif mb-4 text-gray-800">
                    {e(`${prefix}.title`, 'h3', 'text-2xl font-serif text-gray-800')}
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    {e(`${prefix}.description`, 'p', 'text-gray-500')}
                  </p>
                  <span className="text-yellow-600 text-sm uppercase tracking-wider">
                    {e('services.learnMore')} →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* О МАСТЕРЕ */}
        <section className="py-32">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
                  {e('about.subtitle')}
                </span>
                <h2 className="text-5xl font-serif mb-8 text-gray-800 leading-tight">
                  {e('about.title', 'span', 'text-5xl font-serif text-gray-800')}<br />
                  {e('about.titleLine2', 'span', 'text-5xl font-serif text-gray-800')}
                </h2>
                <p className="text-gray-500 mb-6 leading-relaxed text-lg">
                  {e('about.paragraph1', 'p', 'text-gray-500')}
                </p>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  {e('about.paragraph2', 'p', 'text-gray-500')}
                </p>
                <span className="text-yellow-600 uppercase tracking-wider border-b-2 border-yellow-600/30 pb-2">
                  {e('about.learnMore')} →
                </span>
              </div>
              <div className="bg-stone-100 h-96 flex items-center justify-center text-gray-400 text-sm">
                📷 {get('about.imageAlt')}
              </div>
            </div>
          </div>
        </section>

        {/* СТАТИСТИКА */}
        <section className="py-32 bg-gray-800 text-white">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-serif mb-6">{e('stats.title', 'h2', 'text-5xl font-serif')}</h2>
              <div className="w-20 h-px bg-yellow-600 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { num: 'stats.experience.number', label: 'stats.experience.label' },
                { num: 'stats.clients.number', label: 'stats.clients.label' },
                { num: 'stats.procedures.number', label: 'stats.procedures.label' },
                { num: 'stats.premium.number', label: 'stats.premium.label' },
              ].map(({ num, label }) => (
                <div key={num} className="text-center">
                  <div className="text-5xl font-serif text-yellow-600 mb-4">{e(num)}</div>
                  <div className="text-sm uppercase tracking-widest text-white/70">{e(label)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* КОНТАКТЫ */}
        <section className="py-32">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
              {e('contact.subtitle')}
            </span>
            <h2 className="text-5xl font-serif mb-8 text-gray-800">
              {e('contact.title', 'h2', 'text-5xl font-serif text-gray-800')}
            </h2>
            <p className="text-gray-500 mb-4 text-lg">
              {e('contact.description', 'p', 'text-gray-500')}
            </p>
            <p className="text-yellow-600 mb-12 text-xl">
              {e('contact.address', 'p', 'text-yellow-600')}
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <span className="px-10 py-4 bg-yellow-600 text-white uppercase tracking-widest text-sm rounded-sm">
                {e('contact.contactButton')}
              </span>
              <span className="px-10 py-4 border-2 border-yellow-600 text-yellow-600 uppercase tracking-widest text-sm rounded-sm">
                {e('contact.callButton')}
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
