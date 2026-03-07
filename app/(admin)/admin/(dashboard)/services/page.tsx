'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Service = {
  id: string
  icon: string
  title: string
  desc: string
  price: string
}

type FormData = Omit<Service, 'id'>

const EMPTY_FORM: FormData = { icon: '✨', title: '', desc: '', price: '' }

const ICONS = ['✨', '💎', '🌿', '🔬', '💧', '🌸', '⚡', '🌙', '☀️', '🎯', '💆', '🧴', '🪷', '🫧', '🩺', '🌺']

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-sm text-white font-medium ${ok ? 'bg-emerald-600' : 'bg-red-500'}`}>
      {msg}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ServiceModal({
  initial,
  onClose,
  onSave,
}: {
  initial: FormData & { id?: string }
  onClose: () => void
  onSave: (data: FormData, id?: string) => Promise<void>
}) {
  const [form, setForm] = useState<FormData>({
    icon: initial.icon,
    title: initial.title,
    desc: initial.desc,
    price: initial.price || '',
  })
  const [saving, setSaving] = useState(false)
  const isEdit = !!initial.id

  const set = (field: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert("Назва обов'язкова"); return }
    setSaving(true)
    try {
      await onSave(form, initial.id)
    } finally {
      setSaving(false)
    }
  }

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-[#C6A667] text-xs uppercase tracking-[0.2em] mb-0.5">
              {isEdit ? 'Редагування' : 'Нова послуга'}
            </p>
            <h2 className="text-xl font-serif text-[#1a1a1a]">
              {isEdit ? form.title || 'Послуга' : 'Додати послугу'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Icon picker */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">Іконка</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => set('icon', ic)}
                  className={`w-10 h-10 text-xl rounded-xl border-2 transition-all ${
                    form.icon === ic
                      ? 'border-[#C6A667] bg-[#FDF8F0] scale-110 shadow-sm'
                      : 'border-gray-200 hover:border-[#C6A667]/40 hover:bg-[#FDF8F0]/50'
                  }`}
                >
                  {ic}
                </button>
              ))}
              <input
                type="text"
                value={ICONS.includes(form.icon) ? '' : form.icon}
                onChange={(e) => {
                  const val = [...e.target.value].slice(-2).join('')
                  if (val) set('icon', val)
                }}
                placeholder="або своя"
                className="w-24 px-2 text-sm border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500 focus:outline-none focus:border-[#C6A667]/60 placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">
              Назва <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Наприклад: Ліфтинг обличчя"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Desc */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Опис</label>
            <textarea
              value={form.desc}
              onChange={(e) => set('desc', e.target.value)}
              rows={3}
              placeholder="Короткий опис процедури..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300 resize-none leading-relaxed"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Ціна</label>
            <div className="relative">
              <input
                type="text"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="Наприклад: від 500 грн"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C6A667] transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#FAFAF8] rounded-xl p-4 border border-[#C6A667]/10">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Попередній перегляд</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl border border-[#C6A667]/20 flex items-center justify-center text-xl shrink-0 shadow-sm">
                {form.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#1a1a1a] text-sm">{form.title || 'Назва послуги'}</p>
                  {form.price && (
                    <span className="text-xs text-[#C6A667] font-medium">{form.price} PLN</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  {form.desc || "Опис процедури з'явиться тут..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#C6A667] text-white text-sm font-medium hover:bg-[#b8955a] disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                Зберігаємо...
              </>
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

function DeleteConfirm({
  name,
  onCancel,
  onConfirm,
}: {
  name: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑</div>
        <h3 className="text-lg font-serif text-[#1a1a1a] mb-2">Видалити послугу?</h3>
        <p className="text-sm text-gray-500 mb-6">
          «{name}» буде видалено назавжди. Це не можна скасувати.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<(FormData & { id?: string }) | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [search, setSearch] = useState('')

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(data.services || [])
    } catch {
      showToast('❌ Помилка завантаження', false)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (form: FormData, id?: string) => {
    try {
      const res = await fetch(
        id ? `/api/admin/services/${id}` : '/api/admin/services',
        {
          method: id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )

      const data = await res.json()
      console.log('handleSave response:', data)

      if (data.success) {
        showToast(id ? '✅ Послугу оновлено' : '✅ Послугу створено', true)
        setModal(null)
        await load()
      } else {
        showToast(`❌ ${data.error || 'Помилка'}`, false)
      }
    } catch (err) {
      console.error('handleSave error:', err)
      showToast('❌ Помилка збереження', false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/services/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('🗑 Послугу видалено', true)
        setDeleteTarget(null)
        await load()
      } else {
        showToast(`❌ ${data.error}`, false)
      }
    } catch {
      showToast('❌ Помилка видалення', false)
    }
  }

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6 md:p-8">

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {modal && (
        <ServiceModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* Header */}
      <header className="border-b border-[#C6A667]/30 pb-7 mb-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="text-[#C6A667] text-xs uppercase tracking-[0.3em] font-medium mb-2 block">
              Luma Skin Laser Studio
            </span>
            <h1 className="text-4xl font-serif text-[#1a1a1a]">Послуги</h1>
            <p className="text-[#1a1a1a]/50 text-sm mt-1.5 font-light">
              {services.length} {services.length === 1 ? 'послуга' : services.length < 5 ? 'послуги' : 'послуг'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="text-sm text-[#C6A667]/70 hover:text-[#C6A667] transition-colors flex items-center gap-1"
            >
              ← Адмін-панель
            </a>
            <button
              onClick={() => setModal(EMPTY_FORM)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C6A667] text-white rounded-xl text-sm font-medium hover:bg-[#b8955a] transition-colors shadow-sm"
            >
              <span className="text-base leading-none">+</span> Додати послугу
            </button>
          </div>
        </div>

        {/* Search */}
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
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#C6A667]/30 border-t-[#C6A667] rounded-full animate-spin" />
            <p className="text-gray-300 text-sm">Завантаження...</p>
          </div>
        </div>

      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-5xl mb-4">{search ? '🔍' : '✨'}</div>
          <p className="text-[#1a1a1a]/40 text-sm mb-5">
            {search ? `Нічого не знайдено за «${search}»` : 'Послуг ще немає'}
          </p>
          {!search && (
            <button
              onClick={() => setModal(EMPTY_FORM)}
              className="px-5 py-2.5 bg-[#C6A667] text-white rounded-xl text-sm hover:bg-[#b8955a] transition-colors"
            >
              Додати першу послугу
            </button>
          )}
        </div>

      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="group bg-white border border-[#C6A667]/20 rounded-2xl p-5 hover:border-[#C6A667]/50 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-11 h-11 bg-[#FDF8F0] rounded-xl flex items-center justify-center text-2xl shrink-0 border border-[#C6A667]/10">
                  {s.icon}
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setModal({ ...s })}
                    title="Редагувати"
                    className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 flex items-center justify-center text-sm transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    title="Видалити"
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-sm transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-[#1a1a1a] text-sm leading-snug">{s.title}</h3>
                  {s.price && (
                    <span className="text-xs text-[#C6A667] font-medium shrink-0">{s.price} PLN</span>
                  )}
                </div>
                {s.desc && (
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-3">{s.desc}</p>
                )}
              </div>

              {/* Card footer */}
              <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-gray-300">ID: {s.id.slice(-6)}</span>
                <button
                  onClick={() => setModal({ ...s })}
                  className="text-xs text-[#C6A667] hover:text-[#b8955a] transition-colors opacity-0 group-hover:opacity-100"
                >
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