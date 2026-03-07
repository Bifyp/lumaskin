'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function RegisterPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('RegisterPage')
  const e = (key: string, tag: any = 'span', className = '', multiline = false) => (
    <EditableText value={get(key)} tKey={`RegisterPage.${key}`} tag={tag} className={className} onSave={handleSave} multiline={multiline} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Register Page" />
      <Toast toast={toast} />
      <div className="overflow-hidden">
        <section className="w-full min-h-[40vh] flex items-center justify-center bg-stone-50">
          <div className="container text-center px-6">
            <h1 className="text-6xl font-serif mb-8 text-gray-800 leading-tight">
              {e('hero.title')}<br />
              <span className="text-yellow-600 italic">{e('hero.titleAccent')}</span>
            </h1>
          </div>
        </section>
        <section className="py-24">
          <div className="container px-6 max-w-md mx-auto">
            <div className="text-center mb-10">
              <p className="text-gray-500 text-lg">{e('intro.description', 'p', 'text-gray-500', true)}</p>
            </div>
            <div className="p-10 bg-white shadow-xl rounded-lg border border-yellow-600/20 space-y-6">
              {(['name', 'email', 'password', 'confirmPassword'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">
                    {e(`form.${field}.label`)}
                  </label>
                  <input type="text" placeholder={get(`form.${field}.placeholder`)} disabled className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400" />
                  {field === 'password' && (
                    <p className="text-gray-400 text-xs mt-2">{e('form.password.hint')}</p>
                  )}
                </div>
              ))}
              <p className="text-gray-400 text-sm">
                {e('form.terms')} <span className="text-yellow-600">{e('form.termsLink')}</span>{' '}
                {e('form.and')} <span className="text-yellow-600">{e('form.privacyLink')}</span>
              </p>
              <div className="bg-yellow-600 text-white text-center py-4 rounded-md uppercase tracking-widest text-sm opacity-80">
                {e('form.registerButton')}
              </div>
              <div className="text-center text-gray-400 text-sm">{e('form.or')}</div>
              <div className="border-2 border-yellow-600/30 text-gray-500 text-center py-4 rounded-md text-sm">
                {e('form.googleButton')}
              </div>
              <p className="text-center text-gray-400 text-sm">
                {e('form.haveAccount')} <span className="text-yellow-600">{e('form.loginLink')}</span>
              </p>
            </div>
          </div>
        </section>
        <section className="py-24 bg-stone-50">
          <div className="container px-6 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-gray-800 mb-6">{e('benefits.title', 'h2', 'text-4xl font-serif text-gray-800')}</h2>
            </div>
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
              🔢 benefits.items редактируются в <a href="/admin/translations" className="text-indigo-500 underline">Таблице переводов</a>
            </p>
          </div>
        </section>
        <section className="py-24">
          <div className="container px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-gray-800 mb-6">{e('security.title', 'h2', 'text-3xl font-serif text-gray-800')}</h2>
            <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">{e('security.description', 'p', 'text-gray-500', true)}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
