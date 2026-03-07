'use client'

import { useTranslationEditor, EditableText, EditorToolbar, EditorLoading, Toast } from '@/components/admin/editor-shared'

export default function LoginPageEditor() {
  const { get, loading, savingKey, toast, handleSave } = useTranslationEditor('LoginPage')
  const e = (key: string, tag: any = 'span', className = '') => (
    <EditableText value={get(key)} tKey={`LoginPage.${key}`} tag={tag} className={className} onSave={handleSave} />
  )
  if (loading) return <EditorLoading />
  return (
    <div className="relative">
      <EditorToolbar savingKey={savingKey} pageTitle="Login Page" />
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
            <div className="p-10 bg-white shadow-xl rounded-lg border border-yellow-600/20 space-y-6">
              <div>
                <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">{e('form.email.label')}</label>
                <input type="email" placeholder={get('form.email.placeholder')} disabled className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400" />
              </div>
              <div>
                <label className="block text-gray-500 mb-2 text-sm uppercase tracking-wider">{e('form.password.label')}</label>
                <input type="password" placeholder={get('form.password.placeholder')} disabled className="border-2 border-yellow-600/30 p-4 w-full rounded-md bg-gray-50 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{e('form.rememberMe')}</span>
                <span className="text-yellow-600 text-sm">{e('form.forgotPassword')}</span>
              </div>
              <div className="bg-yellow-600 text-white text-center py-4 rounded-md uppercase tracking-widest text-sm opacity-80">
                {e('form.submitButton')}
              </div>
              <div className="text-center text-gray-400 text-sm">{e('form.or')}</div>
              <div className="border-2 border-yellow-600/30 text-gray-500 text-center py-4 rounded-md text-sm">
                {e('form.googleButton')}
              </div>
              <p className="text-center text-gray-400 text-sm">
                {e('form.noAccount')} <span className="text-yellow-600">{e('form.registerLink')}</span>
              </p>
            </div>
            <div className="mt-12 text-center">
              <p className="text-gray-400 text-sm">{e('form.loginNote', 'p', 'text-gray-400')}</p>
            </div>
          </div>
        </section>
        <section className="py-24 bg-stone-50">
          <div className="container px-6 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-gray-800 mb-6">{e('benefits.title', 'h2', 'text-4xl font-serif text-gray-800')}</h2>
            </div>
            <p className="text-center text-gray-400 text-sm py-8 border border-dashed border-gray-200 rounded-xl">
              🔢 benefits.items редактируются в <a href="/admin/translations" className="text-indigo-500 underline">Таблице переводов</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
