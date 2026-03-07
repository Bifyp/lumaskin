import Link from 'next/link'

const PAGES = [
  { slug: 'homepage', label: 'Головна сторінка', icon: '🏠', desc: 'Hero, послуги, контакти' },
  { slug: 'about', label: 'Про нас', icon: '👤', desc: 'Про майстра та студію' },
  { slug: 'booking', label: 'Запис', icon: '📅', desc: 'Форма бронювання' },
  { slug: 'contact', label: 'Контакти', icon: '📞', desc: 'Контакти та карта' },
  { slug: 'gallery', label: 'Галерея', icon: '🖼️', desc: 'Фото робіт' },
  { slug: 'login', label: 'Вхід', icon: '🔑', desc: 'Сторінка входу в акаунт' },
  { slug: 'register', label: 'Реєстрація', icon: '📝', desc: 'Форма реєстрації' },
  { slug: 'forgot-password', label: 'Відновлення паролю', icon: '🔒', desc: 'Скидання паролю' },
  { slug: 'packages', label: 'Пакети', icon: '📦', desc: 'Пакети процедур' },
  { slug: 'services', label: 'Послуги', icon: '✨', desc: 'Список послуг' },
]

export default function TranslationsPreviewIndex() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Візуальний редактор сторінок</h1>
        <p className="mt-1 text-sm text-gray-500">
          Оберіть сторінку — натисніть на будь-який текст щоб змінити його і перекласти на всі мови
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAGES.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/translations/preview/${page.slug}`}
            className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md"
          >
            <span className="text-3xl">{page.icon}</span>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {page.label}
              </p>
              <p className="text-sm text-gray-400">{page.desc}</p>
            </div>
            <span className="ml-auto text-gray-300 group-hover:text-indigo-400 transition-colors text-lg">→</span>
          </Link>
        ))}
      </div>

      <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-5 text-sm text-indigo-700">
        💡 <strong>Масиви</strong> (відгуки, цінності, FAQ тощо) редагуються через{' '}
        <Link href="/admin/translations" className="underline font-semibold">
          Таблицю перекладів
        </Link>
        {' '}— там всі ключі доступні напряму.
      </div>
    </div>
  )
}