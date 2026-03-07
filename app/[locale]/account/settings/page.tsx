'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-sm text-white font-medium ${ok ? 'bg-emerald-600' : 'bg-red-500'}`}>
      {msg}
    </div>
  )
}

export default function AccountSettingsPage() {
  const { data: session, update } = useSession()

  const [name, setName] = useState(session?.user?.name || '')
  const [email, setEmail] = useState(session?.user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (data.success) {
        await update({ name, email })
        showToast('✅ Профіль збережено', true)
      } else {
        showToast(`❌ ${data.error || 'Помилка'}`, false)
      }
    } catch {
      showToast('❌ Помилка збереження', false)
    }
    setSavingProfile(false)
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast('❌ Паролі не співпадають', false)
      return
    }
    if (newPassword.length < 6) {
      showToast('❌ Пароль мінімум 6 символів', false)
      return
    }
    setSavingPassword(true)
    try {
      const res = await fetch('/api/account/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('✅ Пароль змінено', true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        showToast(`❌ ${data.error || 'Помилка'}`, false)
      }
    } catch {
      showToast('❌ Помилка зміни пароля', false)
    }
    setSavingPassword(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-graphite mb-4">Налаштування</h1>
        <p className="text-graphite/60 text-lg">Керуйте своїм профілем</p>
        <div className="w-24 h-px bg-gold mx-auto mt-6"></div>
      </div>

      {/* Back link */}
      <a href="../account" className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-sm mb-10 transition-colors">
        ← Назад до кабінету
      </a>

      {/* Profile form */}
      <div className="bg-white border border-gold/20 rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-serif text-graphite mb-6">Особисті дані</h2>
        <form onSubmit={handleProfileSave} className="space-y-5">
          <div>
            <label className="block text-graphite/70 text-sm uppercase tracking-wider mb-2">Нікнейм</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше ім'я або нік"
              className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-graphite/70 text-sm uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="group relative bg-gold text-white w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
          >
            <span className="relative z-10">{savingProfile ? 'Збереження...' : 'Зберегти зміни'}</span>
            <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-white border border-gold/20 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-serif text-graphite mb-6">Зміна пароля</h2>
        <form onSubmit={handlePasswordSave} className="space-y-5">
          <div>
            <label className="block text-graphite/70 text-sm uppercase tracking-wider mb-2">Поточний пароль</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-graphite/70 text-sm uppercase tracking-wider mb-2">Новий пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all outline-none"
            />
            <p className="text-graphite/40 text-xs mt-1.5">Мінімум 6 символів</p>
          </div>
          <div>
            <label className="block text-graphite/70 text-sm uppercase tracking-wider mb-2">Підтвердіть пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="group relative bg-graphite text-white w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60"
          >
            <span className="relative z-10">{savingPassword ? 'Збереження...' : 'Змінити пароль'}</span>
            <div className="absolute inset-0 bg-gold transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>
      </div>
    </div>
  )
}