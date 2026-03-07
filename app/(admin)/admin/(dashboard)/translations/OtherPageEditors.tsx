'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

// ─── ForgotPassword ───────────────────────────────────────────────────────────

export function ForgotPasswordPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('ForgotPasswordPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`ForgotPasswordPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Forgot Password Page" />
      <Toast toast={toast} />
      <div className="py-24 bg-stone-50 min-h-screen">
        <div className="container px-6">
          <div className="max-w-md mx-auto bg-white p-10 shadow-xl rounded-lg border border-yellow-600/20">
            <h1 className="text-3xl font-serif text-center mb-6">{e('title', 'h1', 'text-3xl font-serif text-gray-800')}</h1>
            <p className="text-gray-500 text-center mb-8">{e('description', 'p', 'text-gray-500', true)}</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">{e('emailLabel')}</label>
                <input type="email" placeholder={get('emailPlaceholder')} disabled className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400" />
              </div>
              <div className="bg-yellow-600 text-white text-center py-4 rounded-md uppercase tracking-widest text-sm opacity-80">
                {e('submit')}
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400 mb-2">После отправки:</p>
              <h2 className="text-xl font-serif text-gray-800 mb-2">{e('sentTitle')}</h2>
              <p className="text-gray-400 text-sm">{e('sentDescription', 'p', 'text-gray-400', true)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export function PackagesPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('PackagesPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`PackagesPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Packages Page" />
      <Toast toast={toast} />
      <div className="overflow-hidden">
        <section className="w-full min-h-[60vh] flex items-center justify-center bg-stone-50">
          <div className="container text-center px-6 max-w-4xl mx-auto">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('hero.subtitle')}</span>
            <h1 className="text-6xl font-serif mb-8 text-gray-800 leading-tight">
              {e('hero.title')}<br />
              <span className="text-yellow-600 italic">{e('hero.titleAccent')}</span>
            </h1>
            <p className="text-gray-500 text-lg">{e('hero.description', 'p', 'text-gray-500', true)}</p>
          </div>
        </section>
        <section className="py-24">
          <div className="container px-6 max-w-4xl mx-auto">
            <div className="text-center py-20 bg-stone-50 border border-yellow-600/40 rounded-xl">
              <h3 className="text-2xl font-serif text-gray-800 mb-4">{e('empty.title', 'h3', 'text-2xl font-serif text-gray-800')}</h3>
              <p className="text-gray-500 mb-6">{e('empty.subtitle', 'p', 'text-gray-500', true)}</p>
              <span className="px-6 py-3 bg-yellow-600 text-white text-sm rounded-md">{e('empty.button')}</span>
            </div>
            <p className="text-center text-gray-400 text-sm mt-8 py-4 border border-dashed border-gray-200 rounded-xl">
              Пакеты добавляются через <a href="/admin/packages" className="text-indigo-500 underline">Управление пакетами</a>
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="container px-6 text-center">
            <p className="text-gray-400 text-sm">{e('validityNote', 'p', 'text-gray-400', true)}</p>
            <div className="mt-4">
              <span className="px-8 py-3 bg-yellow-600 text-white text-sm rounded-md">{e('selectButton')}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

export function ServicesPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('ServicesPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`ServicesPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Services Page" />
      <Toast toast={toast} />
      <div className="overflow-hidden">
        <section className="w-full min-h-[60vh] flex items-center justify-center bg-stone-50">
          <div className="container text-center px-6 max-w-4xl mx-auto">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('hero.subtitle')}</span>
            <h1 className="text-6xl font-serif mb-8 text-gray-800 leading-tight">
              {e('hero.title')}<br />
              <span className="text-yellow-600 italic">{e('hero.titleAccent')}</span>
            </h1>
            <p className="text-gray-500 text-lg">{e('hero.description', 'p', 'text-gray-500', true)}</p>
          </div>
        </section>
        <section className="py-24">
          <div className="container px-6 max-w-4xl mx-auto">
            <div className="text-center py-20 bg-stone-50 border border-yellow-600/40 rounded-xl">
              <h3 className="text-2xl font-serif text-gray-800 mb-4">{e('empty.title', 'h3', 'text-2xl font-serif text-gray-800')}</h3>
              <p className="text-gray-500 mb-6">{e('empty.subtitle', 'p', 'text-gray-500', true)}</p>
              <span className="px-6 py-3 bg-yellow-600 text-white text-sm rounded-md">{e('empty.button')}</span>
            </div>
          </div>
        </section>
        <section className="py-24 bg-stone-50">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('list.subtitle')}</span>
              <h2 className="text-5xl font-serif text-gray-800 mb-6">{e('list.title', 'h2', 'text-5xl font-serif text-gray-800')}</h2>
              <p className="text-gray-500 text-lg">{e('list.description', 'p', 'text-gray-500', true)}</p>
            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif mb-8 text-gray-800">
              {e('cta.title')}<br />
              <span className="text-yellow-600 italic">{e('cta.titleAccent')}</span>
            </h2>
            <p className="text-gray-500 mb-12 text-lg">{e('cta.description', 'p', 'text-gray-500', true)}</p>
            <div className="flex gap-6 justify-center flex-wrap">
              <span className="px-10 py-4 bg-yellow-600 text-white uppercase tracking-widest text-sm rounded-sm">{e('cta.bookButton')}</span>
              <span className="px-10 py-4 border-2 border-yellow-600 text-yellow-600 uppercase tracking-widest text-sm rounded-sm">{e('cta.servicesButton')}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
