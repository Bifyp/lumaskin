'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function ContactPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('ContactPage')

  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`ContactPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )

  if (loading) return <EditorLoading />

  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Contact Page" />
      <Toast toast={toast} />

      <div className="overflow-hidden">

        {/* HERO */}
        <section className="w-full min-h-[60vh] flex items-center justify-center bg-stone-50">
          <div className="container text-center px-6 max-w-4xl mx-auto">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('hero.subtitle')}</span>
            <h1 className="text-6xl font-serif mb-8 text-gray-800 leading-tight">
              {e('hero.title')}<br />
              <span className="text-yellow-600 italic">{e('hero.titleAccent')}</span>
            </h1>
          </div>
        </section>

        {/* ФОРМА */}
        <section className="py-24 bg-stone-50">
          <div className="container px-6 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('form.subtitle')}</span>
              <h2 className="text-5xl font-serif text-gray-800 mb-6">{e('form.title', 'h2', 'text-5xl font-serif text-gray-800')}</h2>
              <p className="text-gray-500 text-lg">{e('form.description', 'p', 'text-gray-500', true)}</p>
            </div>

            <div className="bg-white p-10 shadow-xl border border-yellow-600/20 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {(['name', 'email'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">{e(`form.fields.${field}.label`)}</label>
                    <input type="text" placeholder={get(`form.fields.${field}.placeholder`)} disabled className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">{e('form.fields.phone.label')}</label>
                <input type="text" placeholder={get('form.fields.phone.placeholder')} disabled className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400" />
              </div>
              <div>
                <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">{e('form.fields.message.label')}</label>
                <textarea disabled rows={4} placeholder={get('form.fields.message.placeholder')} className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400 resize-none" />
              </div>
              <div className="bg-yellow-600 text-white text-center py-4 rounded-md uppercase tracking-widest text-sm opacity-80">
                {e('form.submitButton')}
              </div>
              <p className="text-center text-gray-400 text-sm">{e('form.requiredNote')}</p>
            </div>
          </div>
        </section>


        {/* ЧАСЫ */}
        <section className="py-24 bg-gray-800">
          <div className="container px-6 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-yellow-600">{e('hours.title', 'h2', 'text-5xl font-serif text-yellow-600')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-700 p-8 border border-yellow-600/20">
                <h3 className="text-2xl font-serif mb-6 text-yellow-600">{e('hours.weekdays.title')}</h3>
                <p className="text-gray-400 text-sm">Расписание редактируется в таблице переводов</p>
              </div>
              <div className="bg-gray-700 p-8 border border-yellow-600/20">
                <h3 className="text-2xl font-serif mb-6 text-yellow-600">{e('hours.weekend.title')}</h3>
                <p className="text-gray-500 text-sm mt-8 leading-relaxed">{e('hours.note', 'p', 'text-gray-500', true)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* СОЦСЕТИ */}
        <section className="py-24 bg-stone-50">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">{e('social.subtitle')}</span>
            <h2 className="text-5xl font-serif mb-8 text-gray-800">{e('social.title', 'h2', 'text-5xl font-serif text-gray-800')}</h2>
            <p className="text-gray-500 mb-12 text-lg max-w-2xl mx-auto">{e('social.description', 'p', 'text-gray-500', true)}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-serif mb-8 text-gray-800">
              {e('cta.title')}<br />{e('cta.titleLine2')} <span className="text-yellow-600 italic">{e('cta.titleAccent')}</span>?
            </h2>
            <p className="text-gray-500 mb-12 text-lg">{e('cta.description', 'p', 'text-gray-500', true)}</p>
            <div className="flex gap-6 justify-center flex-wrap">
              <span className="px-10 py-4 bg-yellow-600 text-white uppercase tracking-widest text-sm rounded-sm">{e('cta.bookingButton')}</span>
              <span className="px-10 py-4 border-2 border-yellow-600 text-yellow-600 uppercase tracking-widest text-sm rounded-sm">{e('cta.callButton')}</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
