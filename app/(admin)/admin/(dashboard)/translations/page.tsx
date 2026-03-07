import TranslationEditor from '@/components/admin/TranslationEditor'

export default function TranslationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div />
        <a
          href="/admin/translations/preview"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A667] text-white text-sm font-medium rounded-xl hover:bg-[#b8955a] transition-colors"
        >
          👁 Відкрити сторінки для перекладів
        </a>
      </div>
      <TranslationEditor />
    </div>
  )
}