'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type Photo = {
  id: string
  url: string
  publicId: string
  alt: string | null
  category: string | null
  page: string
  order: number
  createdAt: string
}

const CATEGORIES = ['До/Після', 'Чистка', 'Пілінг', 'Масаж', "Ін'єкції", 'Інше']

const PAGES = [
  { value: 'gallery', label: 'Галерея', emoji: '🖼' },
  { value: 'home', label: 'Головна', emoji: '🏠' },
  { value: 'about', label: 'Про майстра', emoji: '👤' },
  { value: 'about-studio', label: 'Студія', emoji: '🏢' },
  { value: 'services', label: 'Послуги', emoji: '✨' },
  { value: 'testimonials', label: 'Відгуки', emoji: '💬' },
]

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white text-sm ${
      ok ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {msg}
    </div>
  )
}

function UploadZone({ onUpload, page }: { onUpload: (files: FileList) => void; page: string }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    onUpload(e.dataTransfer.files)
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-[#C6A667] bg-[#C6A667]/5'
          : 'border-[#C6A667]/30 hover:border-[#C6A667]/50'
      }`}
    >
      <div className="text-4xl mb-2" suppressHydrationWarning>
        {mounted ? '📸' : null}
      </div>
      <p className="text-sm text-gray-600">Перетягніть фото або натисніть для завантаження</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && onUpload(e.target.files)}
        className="hidden"
        id={`file-input-${page}`}
        suppressHydrationWarning
      />
      <label htmlFor={`file-input-${page}`} className="cursor-pointer">Натисніть тут</label>
    </div>
  )
}

type QueueItem = {
  id: string
  file: File
  preview: string
  alt: string
  category: string
  page: string
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

function UploadQueue({
  queue,
  onUpdate,
  onRemove,
  onUploadAll,
  uploading,
  page,
}: {
  queue: QueueItem[]
  onUpdate: (id: string, field: 'alt' | 'category', val: string) => void
  onRemove: (id: string) => void
  onUploadAll: () => void
  uploading: boolean
  page: string
}) {
  const filtered = queue.filter((q) => q.page === page)
  if (filtered.length === 0) return null

  return (
    <div className="bg-white border border-[#C6A667]/20 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-[#C6A667]/10 flex justify-between items-center">
        <h3 className="font-serif text-lg text-[#1a1a1a]">Черга ({filtered.length})</h3>
        <button
          onClick={onUploadAll}
          disabled={uploading}
          className="px-4 py-2 bg-[#C6A667] text-white rounded-lg hover:bg-[#B39657] disabled:opacity-50 text-sm font-medium"
        >
          {uploading ? 'Завантажується...' : 'Завантажити'}
        </button>
      </div>
      <div className="space-y-3 p-4">
        {filtered.map((item) => (
          <div key={item.id} className="border border-[#C6A667]/10 rounded-lg p-3 space-y-2">
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={item.preview}
                  alt="preview"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Alt текст"
                  value={item.alt}
                  onChange={(e) => onUpdate(item.id, 'alt', e.target.value)}
                  className="w-full px-2 py-1 border border-[#C6A667]/20 rounded text-sm"
                />
                <select
                  value={item.category}
                  onChange={(e) => onUpdate(item.id, 'category', e.target.value)}
                  className="w-full px-2 py-1 border border-[#C6A667]/20 rounded text-sm"
                >
                  <option value="">Без категорії</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                disabled={uploading}
                className="px-3 py-1 text-red-500 hover:bg-red-50 rounded text-sm disabled:opacity-50"
              >
                ✕
              </button>
            </div>
            {item.status !== 'pending' && (
              <div className={`text-xs ${
                item.status === 'uploading' ? 'text-yellow-600' :
                item.status === 'done' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {item.status === 'uploading' && '⏳ Завантажується...'}
                {item.status === 'done' && '✓ Завантажено'}
                {item.status === 'error' && `✕ Помилка: ${item.error}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function EditModal({
  photo,
  onClose,
  onSave,
}: {
  photo: Photo
  onClose: () => void
  onSave: (id: string, alt: string, category: string, page: string) => Promise<void>
}) {
  const [alt, setAlt] = useState(photo.alt || '')
  const [category, setCategory] = useState(photo.category || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(photo.id, alt, category, photo.page)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 space-y-4">
          <h2 className="font-serif text-xl text-[#1a1a1a]">Редагування фото</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt текст</label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full px-3 py-2 border border-[#C6A667]/20 rounded-lg focus:outline-none focus:border-[#C6A667]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#C6A667]/20 rounded-lg focus:outline-none focus:border-[#C6A667]"
              >
                <option value="">Без категорії</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#C6A667]/20 text-[#1a1a1a] rounded-lg hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[#C6A667] text-white rounded-lg hover:bg-[#B39657] disabled:opacity-50"
            >
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PhotoCard({
  photo,
  onEdit,
  onDelete,
  onSetPrimary,
  activePage,
}: {
  photo: Photo
  onEdit: () => void
  onDelete: () => void
  onSetPrimary?: (id: string, slot: number) => void
  activePage?: string
}) {
  return (
    <div className="group relative bg-white border border-[#C6A667]/20 rounded-2xl overflow-hidden hover:border-[#C6A667]/50 hover:shadow-md transition-all duration-200">
      <div className="relative aspect-4/3 bg-gray-100">
        <Image src={photo.url} alt={photo.alt || ''} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-sm hover:bg-white transition-colors shadow-sm"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-sm hover:bg-white transition-colors shadow-sm"
          >
            🗑
          </button>
          {activePage === 'about' && onSetPrimary && (
            <>
              <button
                onClick={() => onSetPrimary(photo.id, 0)}
                title="Сделать фото мастера (1)"
                className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-sm hover:bg-white transition-colors shadow-sm"
              >
                1
              </button>
              <button
                onClick={() => onSetPrimary(photo.id, 1)}
                title="Сделать фото студии (2)"
                className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-sm hover:bg-white transition-colors shadow-sm"
              >
                2
              </button>
            </>
          )}
          {activePage === 'home' && onSetPrimary && (
            <button
              onClick={() => onSetPrimary(photo.id, 0)}
              title="Сделать основным на главной"
              className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-sm hover:bg-white transition-colors shadow-sm"
            >
              ★
            </button>
          )}
        </div>
        {photo.category && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded-full font-medium">
              {photo.category}
            </span>
          </div>
        )}
      </div>
      {photo.alt && (
        <div className="px-3 py-2 border-t border-gray-50">
          <p className="text-xs text-gray-400 truncate">{photo.alt}</p>
        </div>
      )}
    </div>
  )
}

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [activePage, setActivePage] = useState('gallery')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const showToast = useCallback((msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/gallery')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPhotos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      showToast('Помилка при завантаженні фото', false)
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const handleFilesAdded = (files: FileList) => {
    const newItems: QueueItem[] = Array.from(files).map((file) => {
      const uid = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2,9)}`
      return {
        id: uid,
        file,
        preview: URL.createObjectURL(file),
        alt: '',
        category: '',
        page: activePage,
        status: 'pending',
      }
    })
    setQueue((prev) => [...prev, ...newItems])
  }

  const updateQueueItem = (id: string, field: 'alt' | 'category', val: string) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: val } : q)))
  }

  const removeQueueItem = (id: string) => {
    setQueue((prev) => {
      const toRevoke = prev.find((q) => q.id === id)?.preview
      if (toRevoke) URL.revokeObjectURL(toRevoke)
      return prev.filter((q) => q.id !== id)
    })
  }

  const uploadAll = async () => {
    const toUpload = queue.filter((q) => q.page === activePage && q.status === 'pending')
    if (toUpload.length === 0) return

    setUploading(true)
    const baseQueue = [...queue] // копия, чтобы цикл не смотрел на старое состояние

    for (let i = 0; i < baseQueue.length; i++) {
      const item = baseQueue[i]
      if (item.page !== activePage || item.status !== 'pending') continue

      setQueue((q) =>
        q.map((x) => (x.id === item.id ? { ...x, status: 'uploading' } : x))
      )

      try {
        const formData = new FormData()
        formData.append('file', item.file)
        formData.append('alt', item.alt)
        formData.append('category', item.category)
        formData.append('page', item.page)

        console.log('Uploading item', { id: item.id, page: item.page })

        const res = await fetch('/api/admin/gallery/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          setQueue((q) =>
            q.map((x) => (x.id === item.id ? { ...x, status: 'done' } : x))
          )
        } else {
          const err = await res.json().catch(() => ({ error: 'Upload failed' }))
          setQueue((q) =>
            q.map((x) =>
              x.id === item.id ? { ...x, status: 'error', error: err.error } : x
            )
          )
        }
      } catch (error) {
        console.error(error)
        setQueue((q) =>
          q.map((x) =>
            x.id === item.id ? { ...x, status: 'error', error: String(error) } : x
          )
        )
      }
    }

    await loadPhotos() // один раз после цикла
    setUploading(false)

    setTimeout(() => {
      setQueue((prev) => prev.filter((q) => q.page !== activePage || q.status !== 'done'))
    }, 2000)
  }

  const handleEdit = async (id: string, alt: string, category: string, page: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ alt, category, page }),
      })

      if (res.ok) {
        await loadPhotos()
        showToast('Фото оновлено', true)
      } else {
        showToast('Помилка при оновленні', false)
      }
    } catch (error) {
      console.error(error)
      showToast('Помилка при оновленні', false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadPhotos()
        showToast('Фото видалено', true)
      } else {
        showToast('Помилка при видаленні', false)
      }
    } catch (error) {
      console.error(error)
      showToast('Помилка при видаленні', false)
    }
    setDeleteTarget(null)
  }

  const handleSetPrimary = async (id: string, slot: number) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: slot }),
      })

      const text = await res.text()
      let body: any
      try { body = text ? JSON.parse(text) : {} } catch { body = { text } }

      if (res.ok) {
        await loadPhotos()
        showToast(slot === 0 ? 'Фото назначено как 1' : 'Фото назначено как 2', true)
      } else {
        console.error('Set primary failed', { status: res.status, body })
        showToast('Не удалось назначить фото', false)
      }
    } catch (e) {
      console.error('Set primary error', e)
      showToast('Не удалось назначить фото', false)
    }
  }

  const filteredPhotos = photos.filter((p) => p.page === activePage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#1a1a1a] mb-4">Управління фото</h1>
        <div className="flex gap-2 flex-wrap">
          {PAGES.map((pg) => (
            <button
              key={pg.value}
              onClick={() => setActivePage(pg.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activePage === pg.value
                  ? 'bg-[#C6A667] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mounted ? `${pg.emoji} ${pg.label}` : pg.label}
            </button>
          ))}
        </div>
      </div>

      <UploadZone onUpload={handleFilesAdded} page={activePage} />
      <UploadQueue
        queue={queue}
        onUpdate={updateQueueItem}
        onRemove={removeQueueItem}
        onUploadAll={uploadAll}
        uploading={uploading}
        page={activePage}
      />

      {loading ? (
        <div className="text-center py-12">Завантаження...</div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Фото не знайдено</div>
      ) : (
        <div key={activePage} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onEdit={() => setEditPhoto(photo)}
              onDelete={() => setDeleteTarget(photo)}
              onSetPrimary={handleSetPrimary}
              activePage={activePage}
            />
          ))}
        </div>
      )}

      {editPhoto && (
        <EditModal
          photo={editPhoto}
          onClose={() => setEditPhoto(null)}
          onSave={handleEdit}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🗑
            </div>
            <h3 className="text-lg font-serif text-[#1a1a1a] mb-2">Видалити фото?</h3>
            <p className="text-sm text-gray-500 mb-6">Фото буде видалено назавжди.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-[#C6A667]/20 text-[#1a1a1a] rounded-lg hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  )
}