'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function AboutPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('AboutPage')

  const e = (key: string, tag: any = 'span', className = '', italic = false, multiline = false) => (
    <EditableText value={get(key)} tKey={`AboutPage.${key}`} tag={tag} className={className} onSave={handleSave} italic={italic} multiline={multiline} />
  )

  if (loading) return <EditorLoading />

  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="About Page" />
      <Toast toast={toast} />

      <div className="overflow-hidden">

        {/* HERO */}
        <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-stone-50">
          <div className="container text-center px-6 max-w-4xl mx-auto">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
              {e('hero.subtitle')}
            </span>
            <h1 className="text-6xl font-serif mb-8 text-gray-800 leading-tight">
              {e('hero.title')}<br />
              <span className="text-yellow-600 italic">{e('hero.titleAccent')}</span>
            </h1>
          </div>
        </section>

        {/* МИССИЯ */}
        <section className="py-24">
          <div className="container px-6 max-w-4xl mx-auto text-center">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-6 block">
              {e('mission.subtitle')}
            </span>
            <h2 className="text-4xl font-serif mb-10 text-gray-800 leading-relaxed">
              {e('mission.title', 'h2', 'text-4xl font-serif text-gray-800', false, true)}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              {e('mission.paragraph1', 'p', 'text-gray-500', false, true)}
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              {e('mission.paragraph2', 'p', 'text-gray-500', false, true)}
            </p>
          </div>
        </section>

        {/* О МАСТЕРЕ */}
        <section className="py-24 bg-stone-50">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="bg-stone-200 h-96 flex items-center justify-center text-gray-400 text-sm">
                📷 {get('master.imageAlt')}
              </div>
              <div>
                <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
                  {e('master.subtitle')}
                </span>
                <h2 className="text-5xl font-serif mb-6 text-gray-800">
                  {e('master.name', 'h2', 'text-5xl font-serif text-gray-800')}
                </h2>
                <p className="text-yellow-600 mb-8 text-lg italic">
                  {e('master.title', 'p', 'text-yellow-600')}
                </p>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {e('master.paragraph1', 'p', 'text-gray-500', false, true)}
                </p>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {e('master.paragraph2', 'p', 'text-gray-500', false, true)}
                </p>
                <div className="border-l-2 border-yellow-600/40 pl-6 mb-8">
                  <p className="text-gray-600 italic leading-relaxed">
                    "{e('master.quote', 'span', '', false, true)}"
                  </p>
                </div>
                <h3 className="text-gray-800 font-semibold mb-4 uppercase tracking-wider text-sm">
                  {e('master.certificatesTitle')}
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* ЦЕННОСТИ */}
        <section className="py-24">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
                {e('values.subtitle')}
              </span>
              <h2 className="text-5xl font-serif text-gray-800">
                {e('values.title', 'h2', 'text-5xl font-serif text-gray-800')}
              </h2>
            </div>
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
              🔢 Элементы массива (ценности) редактируются в разделе{' '}
              <a href="/admin/translations" className="text-indigo-500 underline">Таблица переводов</a>{' '}
              → секция AboutPage → values.items
            </p>
          </div>
        </section>

        {/* СТУДИЯ */}
        <section className="py-24 bg-gray-800 text-white">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
                  {e('studio.subtitle')}
                </span>
                <h2 className="text-5xl font-serif mb-8 leading-tight">
                  {e('studio.title')}<br />{e('studio.titleLine2')}
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed text-lg">
                  {e('studio.paragraph', 'p', 'text-white/80', false, true)}
                </p>
                <span className="text-yellow-600 uppercase tracking-wider border-b border-yellow-600/30 pb-2">
                  {e('studio.linkText')} →
                </span>
              </div>
              <div className="bg-gray-700 h-80 flex items-center justify-center text-gray-400 text-sm">
                📷 {get('studio.imageAlt')}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif mb-8 text-gray-800">
              {e('cta.title')}<br />
              <span className="text-yellow-600 italic">{e('cta.titleAccent')}</span>
            </h2>
            <p className="text-gray-500 mb-12 text-lg">
              {e('cta.description', 'p', 'text-gray-500', false, true)}
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <span className="px-10 py-4 bg-yellow-600 text-white uppercase tracking-widest text-sm rounded-sm">
                {e('cta.bookButton')}
              </span>
              <span className="px-10 py-4 border-2 border-yellow-600 text-yellow-600 uppercase tracking-widest text-sm rounded-sm">
                {e('cta.servicesButton')}
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
