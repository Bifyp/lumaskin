'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function BookingPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('BookingPage')

  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`BookingPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )

  if (loading) return <EditorLoading />

  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Booking Page" />
      <Toast toast={toast} />

      <div className="overflow-hidden">

        {/* HERO */}
        <section className="relative w-full min-h-[50vh] flex items-center justify-center bg-stone-50">
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

        {/* ФОРМА */}
        <section className="py-24">
          <div className="container px-6 max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-gray-500 text-lg">
                {e('form.description', 'p', 'text-gray-500', true)}
              </p>
            </div>

            <div className="p-12 bg-white shadow-xl rounded-lg border border-yellow-600/20 space-y-8">

              <div className="grid grid-cols-2 gap-6">
                {(['firstName', 'lastName'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">
                      {e(`form.fields.${field}.label`)}
                    </label>
                    <input
                      type="text"
                      placeholder={get(`form.fields.${field}.placeholder`)}
                      disabled
                      className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {(['phone', 'email'] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">
                      {e(`form.fields.${field}.label`)}
                    </label>
                    <input
                      type="text"
                      placeholder={get(`form.fields.${field}.placeholder`)}
                      disabled
                      className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">
                  {e('form.fields.service.label')}
                </label>
                <select disabled className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400">
                  <option>{get('form.fields.service.placeholder')}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">
                  {e('form.fields.comment.label')}
                </label>
                <textarea disabled rows={3} placeholder={get('form.fields.comment.placeholder')}
                  className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400 resize-none" />
              </div>

              <div className="bg-yellow-600 text-white text-center py-4 rounded-md uppercase tracking-widest text-sm opacity-80">
                {e('form.submitButton')}
              </div>

              <p className="text-center text-gray-400 text-sm">
                {e('form.requiredNote')}
              </p>
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {e('contact.text', 'p', 'text-gray-500')}
              </p>
              <span className="text-4xl font-serif text-yellow-600">
                {e('contact.phone')}
              </span>
            </div>
          </div>
        </section>

        {/* INFO */}
        <section className="py-24 bg-stone-50">
          <div className="container px-6 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-gray-800">
                {e('info.title', 'h2', 'text-4xl font-serif text-gray-800')}
              </h2>
            </div>
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
              🔢 Элементы info.items редактируются в{' '}
              <a href="/admin/translations" className="text-indigo-500 underline">Таблице переводов</a>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="container px-6 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-yellow-600/60 uppercase tracking-[0.3em] text-sm mb-4 block">
                {e('faq.subtitle')}
              </span>
              <h2 className="text-4xl font-serif text-gray-800">
                {e('faq.title', 'h2', 'text-4xl font-serif text-gray-800')}
              </h2>
            </div>
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
              🔢 Вопросы FAQ редактируются в{' '}
              <a href="/admin/translations" className="text-indigo-500 underline">Таблице переводов</a>
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
