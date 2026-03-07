'use client'

import { useState, useEffect } from 'react'

export type Translations = Record<string, string>

export function useTranslationEditor(section: string) {
  const [t, setT] = useState<Translations>({})
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    fetch('/api/admin/translations?lang=en')
      .then((r) => r.json())
      .then((data) => {
        const flat: Translations = {}
        const sections = data.sections || {}
        for (const [sec, keys] of Object.entries(sections)) {
          for (const [key, value] of Object.entries(keys as Record<string, string>)) {
            flat[`${sec}.${key}`] = value
          }
        }
        setT(flat)
        setLoading(false)
      })
  }, [])

  const get = (key: string) => t[`${section}.${key}`] ?? key

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (fullKey: string, value: string) => {
    const parts = fullKey.split('.')
    const sec = parts[0]
    const key = parts.slice(1).join('.')
    setSavingKey(key)
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: sec, key, value }),
      })
      const data = await res.json()
      if (data.success) {
        setT((prev) => ({ ...prev, [fullKey]: value }))
        showToast('✅ Перекладено на RU / PL / UK', true)
      } else {
        showToast(`❌ ${data.error}`, false)
      }
    } catch {
      showToast("❌ Помилка з'єднання", false)
    }
    setSavingKey(null)
  }

  return { t, get, loading, savingKey, toast, handleSave }
}

export function EditorToolbar({ savingKey, pageTitle }: { savingKey: string | null; pageTitle: string }) {
  return (
    <div className="sticky top-0 z-50 bg-indigo-600 text-white text-sm px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="font-semibold">✏️ {pageTitle}</span>
        <span className="text-indigo-200 text-xs hidden sm:block">Натисніть на текст щоб змінити</span>
      </div>
      <div className="flex items-center gap-4">
        {savingKey && (
          <span className="text-indigo-200 text-xs animate-pulse">Перекладаємо RU/PL/EN...</span>
        )}
        <a
          href="/admin/translations/preview"
          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition"
        >
          ← Всі сторінки
        </a>
      </div>
    </div>
  )
}

export function Toast({ toast }: { toast: { msg: string; ok: boolean } | null }) {
  if (!toast) return null
  return (
    <div
      className={`fixed top-16 right-6 z-50 text-white text-sm px-4 py-3 rounded-xl shadow-xl ${
        toast.ok ? 'bg-emerald-600' : 'bg-red-500'
      }`}
    >
      {toast.msg}
    </div>
  )
}

// ─── EditableText — підтримує tag як опціональний проп ────────────────────────

type Tag = 'span' | 'h1' | 'h2' | 'h3' | 'p'

export function EditableText({
  value,
  tKey,
  tag = 'span',       // ← проп повернуто, за замовчуванням span
  className = '',
  onSave,
  italic = false,
  multiline = false,
}: {
  value: string
  tKey: string
  tag?: Tag           // опціональний — не ламає старий код
  className?: string
  onSave: (key: string, value: string) => Promise<void>
  italic?: boolean
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [current, setCurrent] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setCurrent(value) }, [value])

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
    if (e.key === 'Enter' && !e.shiftKey && !multiline) { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') { setCurrent(value); setEditing(false) }
  }

  const Tag = tag

  if (editing) {
    return (
      <span className="relative inline-block w-full">
        {multiline || current.length > 80 ? (
          <textarea
            autoFocus
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full bg-white border-2 border-indigo-400 rounded px-2 py-1 text-gray-800 resize-y outline-none shadow-lg text-sm"
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border-2 border-indigo-400 rounded px-2 py-1 text-gray-800 outline-none shadow-lg text-sm"
          />
        )}
        <span className="absolute -bottom-8 right-0 flex gap-2 z-50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white text-xs px-3 py-1 rounded shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? '...' : '✓'}
          </button>
          <button
            onClick={() => { setCurrent(value); setEditing(false) }}
            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </span>
      </span>
    )
  }

  return (
  
    <Tag
      className={`${className} relative group cursor-pointer hover:outline hover:outline-indigo-400/50 hover:outline-offset-1 rounded-sm transition-all`}
      onClick={() => setEditing(true)}
      title="Натисніть щоб редагувати"
    >
      {italic ? <em>{current}</em> : current}
      {saved && (
        <span className="absolute -top-6 left-0 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded shadow z-10">
          ✓
        </span>
      )}
    </Tag>
  )
}

export function EditorLoading() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="text-gray-400 text-sm animate-pulse">Завантаження...</div>
    </div>
  )
}