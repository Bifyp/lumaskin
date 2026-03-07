'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Типы ─────────────────────────────────────────────────────────────────────

type SectionsData = Record<string, Record<string, string>>

type SectionState = {
  original: Record<string, string>   // значения из API (EN)
  edited: Record<string, string>     // текущие значения в инпутах
  isDirty: boolean                   // есть ли несохранённые изменения
  isSaving: boolean                  // идёт ли сохранение
  savedKeys: Set<string>             // ключи, которые только что сохранились
  errors: Record<string, string>     // ошибки по ключам
}

type State = Record<string, SectionState>

// ─── Вспомогательные функции ──────────────────────────────────────────────────

function isJsonArray(value: string): boolean {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
  } catch {
    return false
  }
}

function formatKeyLabel(key: string): string {
  // "hero.title" → "Hero → Title"
  return key
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' → ')
}

// ─── Компонент одного поля ────────────────────────────────────────────────────

function TranslationField({
  fieldKey,
  value,
  saved,
  onChange,
}: {
  fieldKey: string
  value: string
  saved: boolean
  onChange: (key: string, value: string) => void
}) {
  const isArray = isJsonArray(value)
  const isLong = value.length > 100

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {formatKeyLabel(fieldKey)}
        </label>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Сохранено
          </span>
        )}
        {isArray && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
            массив
          </span>
        )}
      </div>

      {isLong || isArray ? (
        <textarea
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          rows={isArray ? 4 : 3}
          className="w-full resize-y rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />
      )}
    </div>
  )
}

// ─── Компонент секции ─────────────────────────────────────────────────────────

function SectionBlock({
  sectionName,
  state,
  onFieldChange,
  onSave,
  onReset,
}: {
  sectionName: string
  state: SectionState
  onFieldChange: (section: string, key: string, value: string) => void
  onSave: (section: string) => void
  onReset: (section: string) => void
}) {
  const { edited, isDirty, isSaving, savedKeys } = state
  const keys = Object.keys(edited)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
      {/* Шапка секции */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-800">{sectionName}</h3>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
            {keys.length} ключей
          </span>
          {isDirty && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Есть изменения
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={() => onReset(sectionName)}
              disabled={isSaving}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              Сбросить
            </button>
          )}
          <button
            onClick={() => onSave(sectionName)}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Перевод...
              </>
            ) : (
              'Сохранить и перевести'
            )}
          </button>
        </div>
      </div>

      {/* Поля */}
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {keys.map((key) => (
          <TranslationField
            key={key}
            fieldKey={key}
            value={edited[key]}
            saved={savedKeys.has(key)}
            onChange={(k, v) => onFieldChange(sectionName, k, v)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export default function TranslationEditor() {
  const [state, setState] = useState<State>({})
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [globalSaving, setGlobalSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // ── Загрузка данных ──

  const fetchTranslations = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch('/api/admin/translations')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: { sections: SectionsData } = await res.json()

      const newState: State = {}
      for (const [section, keys] of Object.entries(data.sections)) {
        newState[section] = {
          original: { ...keys },
          edited: { ...keys },
          isDirty: false,
          isSaving: false,
          savedKeys: new Set(),
          errors: {},
        }
      }
      setState(newState)
      // По умолчанию открываем первые 3 секции
      setExpandedSections(new Set(Object.keys(newState).slice(0, 3)))
    } catch (e) {
      setFetchError('Не удалось загрузить переводы. Проверьте подключение.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTranslations()
  }, [fetchTranslations])

  // ── Тост-уведомления ──

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Изменение поля ──

  const handleFieldChange = (section: string, key: string, value: string) => {
    setState((prev) => {
      const s = prev[section]
      const newEdited = { ...s.edited, [key]: value }
      const isDirty = Object.keys(newEdited).some((k) => newEdited[k] !== s.original[k])
      return {
        ...prev,
        [section]: {
          ...s,
          edited: newEdited,
          isDirty,
          savedKeys: new Set(), // сбрасываем зелёные галочки при редактировании
        },
      }
    })
  }

  // ── Сброс секции ──

  const handleReset = (section: string) => {
    setState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        edited: { ...prev[section].original },
        isDirty: false,
        savedKeys: new Set(),
        errors: {},
      },
    }))
  }

  // ── Сохранение секции ──

  const handleSave = async (section: string) => {
    const s = state[section]
    const changedKeys = Object.keys(s.edited).filter((k) => s.edited[k] !== s.original[k])
    if (changedKeys.length === 0) return

    setState((prev) => ({
      ...prev,
      [section]: { ...prev[section], isSaving: true, errors: {} },
    }))

    const savedKeys = new Set<string>()
    const errors: Record<string, string> = {}

    // Отправляем каждый изменённый ключ отдельным запросом
    await Promise.allSettled(
      changedKeys.map(async (key) => {
        try {
          const res = await fetch('/api/admin/translations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ section, key, value: s.edited[key] }),
          })

          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || `HTTP ${res.status}`)
          }

          savedKeys.add(key)
        } catch (e) {
          errors[key] = e instanceof Error ? e.message : 'Ошибка'
        }
      })
    )

    const hasErrors = Object.keys(errors).length > 0
    const hasSaved = savedKeys.size > 0

    setState((prev) => {
      const newOriginal = { ...prev[section].original }
      for (const key of savedKeys) {
        newOriginal[key] = prev[section].edited[key]
      }
      const isDirty = Object.keys(prev[section].edited).some(
        (k) => prev[section].edited[k] !== newOriginal[k]
      )
      return {
        ...prev,
        [section]: {
          ...prev[section],
          original: newOriginal,
          isDirty,
          isSaving: false,
          savedKeys,
          errors,
        },
      }
    })

    if (hasSaved && !hasErrors) {
      showToast(`✅ ${section}: ${savedKeys.size} перевода сохранены и переведены`, 'success')
    } else if (hasSaved && hasErrors) {
      showToast(`⚠️ ${savedKeys.size} сохранено, ${Object.keys(errors).length} с ошибками`, 'error')
    } else {
      showToast(`❌ Не удалось сохранить секцию ${section}`, 'error')
    }
  }

  // ── Сохранить все изменённые секции ──

  const handleSaveAll = async () => {
    const dirtySections = Object.keys(state).filter((s) => state[s].isDirty)
    if (dirtySections.length === 0) return
    setGlobalSaving(true)
    await Promise.allSettled(dirtySections.map(handleSave))
    setGlobalSaving(false)
  }

  // ── Переключение секции ──

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.has(section) ? next.delete(section) : next.add(section)
      return next
    })
  }

  // ── Фильтрация по поиску ──

  const filteredSections = Object.entries(state).filter(([section, s]) => {
    if (!search) return true
    const q = search.toLowerCase()
    if (section.toLowerCase().includes(q)) return true
    return Object.entries(s.edited).some(
      ([key, val]) => key.toLowerCase().includes(q) || val.toLowerCase().includes(q)
    )
  })

  const dirtyCount = Object.values(state).filter((s) => s.isDirty).length

  // ── Рендер ──

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="h-8 w-8 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Загрузка переводов...</span>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500">{fetchError}</p>
        <button
          onClick={fetchTranslations}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Тост */}
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Шапка */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Управление переводами</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {Object.keys(state).length} секций · автоперевод через DeepL (RU / PL / UK)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {dirtyCount > 0 && (
            <button
              onClick={handleSaveAll}
              disabled={globalSaving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {globalSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Сохраняем...
                </>
              ) : (
                `Сохранить всё (${dirtyCount})`
              )}
            </button>
          )}
          <button
            onClick={fetchTranslations}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            ↻ Обновить
          </button>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Поиск по секции, ключу или значению..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Секции */}
      <div className="space-y-4">
        {filteredSections.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Ничего не найдено по запросу «{search}»</p>
        )}

        {filteredSections.map(([section, s]) => (
          <div key={section} className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            {/* Заголовок секции — клик раскрывает/скрывает */}
            <button
              onClick={() => toggleSection(section)}
              className="flex w-full items-center justify-between bg-white px-5 py-4 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800">{section}</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
                  {Object.keys(s.edited).length} ключей
                </span>
                {s.isDirty && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    Изменено
                  </span>
                )}
              </div>
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  expandedSections.has(section) ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Контент секции */}
            {expandedSections.has(section) && (
              <div className="border-t border-gray-100 bg-gray-50">
                {/* Кнопки управления */}
                <div className="flex items-center justify-end gap-2 border-b border-gray-100 px-5 py-3">
                  {s.isDirty && (
                    <button
                      onClick={() => handleReset(section)}
                      disabled={s.isSaving}
                      className="rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      Сбросить
                    </button>
                  )}
                  <button
                    onClick={() => handleSave(section)}
                    disabled={!s.isDirty || s.isSaving}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {s.isSaving ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Переводим...
                      </>
                    ) : (
                      'Сохранить и перевести'
                    )}
                  </button>
                </div>

                {/* Поля */}
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  {Object.keys(s.edited).map((key) => (
                    <div key={key}>
                      <TranslationField
                        fieldKey={key}
                        value={s.edited[key]}
                        saved={s.savedKeys.has(key)}
                        onChange={(k, v) => handleFieldChange(section, k, v)}
                      />
                      {s.errors[key] && (
                        <p className="mt-1 text-xs text-red-500">{s.errors[key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
