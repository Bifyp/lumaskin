'use client'

import { useState, useEffect, useCallback } from 'react'

type Benefit = { id: string; text: string }

type Package = {
  id: string
  title: string
  badge: string | null
  sessions: string
  price: number
  oldPrice: number
  savings: string
  popular: boolean
  benefits: Benefit[]
}

type FormData = {
  title: string
  badge: string
  sessions: string
  price: string
  oldPrice: string
  savings: string
  popular: boolean
  benefits: string[]
}

const EMPTY_FORM: FormData = {
  title: '',
  badge: '',
  sessions: '',
  price: '',
  oldPrice: '',
  savings: '',
  popular: false,
  benefits: [''],
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-sm text-white font-medium ${ok ? 'bg-emerald-600' : 'bg-red-500'}`}>
      {msg}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function PackageModal({
  initial,
  onClose,
  onSave,
}: {
  initial: FormData & { id?: string }
  onClose: () => void
  onSave: (data: FormData, id?: string) => Promise<void>
}) {
  const [form, setForm] = useState<FormData>({ ...initial })
  const [saving, setSaving] = useState(false)
  const isEdit = !!initial.id

  const set = (field: keyof FormData, value: any) =>
    setForm((p) => ({ ...p, [field]: value }))

  const setBenefit = (idx: number, value: string) => {
    const benefits = [...form.benefits]
    benefits[idx] = value
    set('benefits', benefits)
  }

  const addBenefit = () => set('benefits', [...form.benefits, ''])
  const removeBenefit = (idx: number) => set('benefits', form.benefits.filter((_, i) => i !== idx))

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert("Назва обов'язкова"); return }
    setSaving(true)
    try {
      await onSave(form, initial.id)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <p className="text-[#C6A667] text-xs uppercase tracking-[0.2em] mb-0.5">
              {isEdit ? 'Редагування' : 'Новий пакет'}
            </p>
            <h2 className="text-xl font-serif text-[#1a1a1a]">
              {form.title || (isEdit ? 'Пакет' : 'Додати пакет')}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Title */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">
              Назва <span className="text-red-400">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Наприклад: Стартовий пакет"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Badge + Popular */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Бейдж</label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => set('badge', e.target.value)}
                placeholder="Популярний"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Сесії</label>
              <input
                type="text"
                value={form.sessions}
                onChange={(e) => set('sessions', e.target.value)}
                placeholder="5 сесій"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Ціна PLN</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="500"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Стара ціна</label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => set('oldPrice', e.target.value)}
                placeholder="700"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Економія</label>
              <input
                type="text"
                value={form.savings}
                onChange={(e) => set('savings', e.target.value)}
                placeholder="200 PLN"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Popular toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => set('popular', !form.popular)}
              className={`w-10 h-6 rounded-full transition-colors relative ${form.popular ? 'bg-[#C6A667]' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.popular ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
            <label className="text-sm text-gray-600">Популярний пакет</label>
          </div>

          {/* Benefits */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">Переваги</label>
            <div className="space-y-2">
              {form.benefits.map((b, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => setBenefit(idx, e.target.value)}
                    placeholder={`Перевага ${idx + 1}`}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
                  />
                  {form.benefits.length > 1 && (
                    <button
                      onClick={() => removeBenefit(idx)}
                      className="w-8 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addBenefit}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#C6A667]/40 hover:text-[#C6A667] transition-colors"
              >
                + Додати перевагу
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#FAFAF8] rounded-xl p-4 border border-[#C6A667]/10">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Попередній перегляд</p>
            <div className={`rounded-xl p-4 border-2 ${form.popular ? 'border-[#C6A667] bg-[#FDF8F0]' : 'border-gray-100 bg-white'}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-[#1a1a1a]">{form.title || 'Назва пакету'}</h3>
                {form.badge && <span className="text-xs bg-[#C6A667] text-white px-2 py-0.5 rounded-full">{form.badge}</span>}
              </div>
              {form.sessions && <p className="text-xs text-gray-400 mb-2">{form.sessions}</p>}
              <div className="flex items-baseline gap-2 mb-3">
                {form.price && <span className="text-xl font-serif text-[#C6A667]">{form.price} PLN</span>}
                {form.oldPrice && <span className="text-sm text-gray-400 line-through">{form.oldPrice} PLN</span>}
              </div>
              {form.benefits.filter(b => b.trim()).length > 0 && (
                <ul className="space-y-1">
                  {form.benefits.filter(b => b.trim()).map((b, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                      <span className="text-[#C6A667]">✓</span> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#C6A667] text-white text-sm font-medium hover:bg-[#b8955a] disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Зберігаємо...</>
            ) : (
              isEdit ? '💾 Зберегти' : '✨ Створити'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑</div>
        <h3 className="text-lg font-serif text-[#1a1a1a] mb-2">Видалити пакет?</h3>
        <p className="text-sm text-gray-500 mb-6">«{name}» буде видалено назавжди.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Скасувати</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">Видалити</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<(FormData & { id?: string }) | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [search, setSearch] = useState('')

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/packages')
      const data = await res.json()
      setPackages(data.packages || [])
    } catch {
      showToast('❌ Помилка завантаження', false)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (form: FormData, id?: string) => {
    try {
      const res = await fetch(
        id ? `/api/admin/packages/${id}` : '/api/admin/packages',
        {
          method: id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )
      const data = await res.json()
      if (data.success) {
        showToast(id ? '✅ Пакет оновлено' : '✅ Пакет створено', true)
        setModal(null)
        await load()
      } else {
        showToast(`❌ ${data.error || 'Помилка'}`, false)
      }
    } catch {
      showToast('❌ Помилка збереження', false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/packages/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('🗑 Пакет видалено', true)
        setDeleteTarget(null)
        await load()
      } else {
        showToast(`❌ ${data.error}`, false)
      }
    } catch {
      showToast('❌ Помилка видалення', false)
    }
  }

  const toForm = (p: Package): FormData & { id: string } => ({
    id: p.id,
    title: p.title,
    badge: p.badge || '',
    sessions: p.sessions,
    price: String(p.price),
    oldPrice: String(p.oldPrice),
    savings: p.savings,
    popular: p.popular,
    benefits: p.benefits.length > 0 ? p.benefits.map(b => b.text) : [''],
  })

  const filtered = packages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6 md:p-8">

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      {modal && <PackageModal initial={modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {deleteTarget && <DeleteConfirm name={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />}

      {/* Header */}
      <header className="border-b border-[#C6A667]/30 pb-7 mb-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-[#C6A667] text-xs uppercase tracking-[0.3em] font-medium mb-2 block">Luma Skin Laser Studio</span>
            <h1 className="text-4xl font-serif text-[#1a1a1a]">Пакети</h1>
            <p className="text-[#1a1a1a]/50 text-sm mt-1.5 font-light">
              {packages.length} {packages.length === 1 ? 'пакет' : packages.length < 5 ? 'пакети' : 'пакетів'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-sm text-[#C6A667]/70 hover:text-[#C6A667] transition-colors">← Адмін-панель</a>
            <button
              onClick={() => setModal(EMPTY_FORM)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C6A667] text-white rounded-xl text-sm font-medium hover:bg-[#b8955a] transition-colors shadow-sm"
            >
              <span className="text-base leading-none">+</span> Додати пакет
            </button>
          </div>
        </div>

        <div className="mt-5 relative max-w-xs">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук..."
            className="w-full pl-9 pr-4 py-2 border border-[#C6A667]/20 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#C6A667]/60 bg-white placeholder:text-gray-300 transition-colors"
          />
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#C6A667]/30 border-t-[#C6A667] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-5xl mb-4">{search ? '🔍' : '🎁'}</div>
          <p className="text-[#1a1a1a]/40 text-sm mb-5">
            {search ? `Нічого не знайдено за «${search}»` : 'Пакетів ще немає'}
          </p>
          {!search && (
            <button onClick={() => setModal(EMPTY_FORM)} className="px-5 py-2.5 bg-[#C6A667] text-white rounded-xl text-sm hover:bg-[#b8955a] transition-colors">
              Додати перший пакет
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`group bg-white border-2 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col gap-3 ${p.popular ? 'border-[#C6A667]/40' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-[#1a1a1a]">{p.title}</h3>
                    {p.badge && <span className="text-xs bg-[#C6A667] text-white px-2 py-0.5 rounded-full">{p.badge}</span>}
                    {p.popular && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐</span>}
                  </div>
                  {p.sessions && <p className="text-xs text-gray-400">{p.sessions}</p>}
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => setModal(toForm(p))} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center text-sm transition-colors">✏️</button>
                  <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-sm transition-colors">🗑</button>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-serif text-[#C6A667]">{p.price} PLN</span>
                {p.oldPrice > 0 && <span className="text-sm text-gray-400 line-through">{p.oldPrice} PLN</span>}
                {p.savings && <span className="text-xs text-emerald-600 font-medium">−{p.savings}</span>}
              </div>

              {p.benefits.length > 0 && (
                <ul className="space-y-1">
                  {p.benefits.slice(0, 3).map((b) => (
                    <li key={b.id} className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className="text-[#C6A667]">✓</span> {b.text}
                    </li>
                  ))}
                  {p.benefits.length > 3 && (
                    <li className="text-xs text-gray-400">+{p.benefits.length - 3} ще...</li>
                  )}
                </ul>
              )}

              <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-gray-300">ID: {p.id.slice(-6)}</span>
                <button onClick={() => setModal(toForm(p))} className="text-xs text-[#C6A667] hover:text-[#b8955a] transition-colors opacity-0 group-hover:opacity-100">
                  Редагувати →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}