'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function GalleryPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('GalleryPage')
  const e = (key: string, _tag: any = 'span', className = '') => (
    <EditableText value={get(key)} tKey={`GalleryPage.${key}`} className={className} onSave={handleSave} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Gallery Page" />
      <Toast toast={toast} />
      <div className="overflow-hidden">
        <section className="w-full min-h-[60vh] flex items-center justify-center bg-stone-50">
          <div className="container text-center px-6 max-w-4xl mx-auto">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('hero.subtitle')}</span>
            <h1 className="text-6xl font-serif mb-8 text-gray-800 leading-tight">
              {e('hero.title')}<br />
              <span className="text-yellow-600 italic">{e('hero.titleAccent')}</span>
            </h1>
            <p className="text-lg text-gray-500 mt-8">{e('hero.description', undefined, 'text-gray-500')}</p>
          </div>
        </section>
        <section className="py-24 bg-stone-50">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('categories.subtitle')}</span>
              <h2 className="text-5xl font-serif text-gray-800">{e('categories.title', undefined, 'text-5xl font-serif text-gray-800')}</h2>
            </div>
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
              🔢 categories.items редактируются в <a href="/admin/translations" className="text-indigo-500 underline">Таблице переводов</a>
            </p>
          </div>
        </section>
        <section className="py-24 bg-gray-800 text-white">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif mb-8">
              {e('cta.title')}<br />
              <span className="text-yellow-600 italic">{e('cta.titleAccent')}</span>?
            </h2>
            <p className="text-gray-300 mb-12 text-lg">{e('cta.description', undefined, 'text-gray-300')}</p>
            <div className="flex gap-6 justify-center flex-wrap">
              <span className="px-10 py-4 bg-yellow-600 text-white uppercase tracking-widest text-sm rounded-sm">{e('cta.bookingButton')}</span>
              <span className="px-10 py-4 border-2 border-yellow-600 text-yellow-600 uppercase tracking-widest text-sm rounded-sm">{e('cta.servicesButton')}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
