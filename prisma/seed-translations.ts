/**
 * Seed-скрипт: читает все 4 JSON-файла и импортирует в базу данных
 *
 * Запуск:
 *   npx tsx prisma/seed-translations.ts
 *   # или если tsx недоступен:
 *   npx ts-node --esm prisma/seed-translations.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { flattenJson } from '../lib/flattenJson'

const prisma = new PrismaClient()
const LANGUAGES = ['en', 'ru', 'pl', 'uk'] as const
const MESSAGES_DIR = path.join(process.cwd(), 'messages')

async function main() {
  console.log('🌱 Начинаем импорт переводов из JSON файлов...\n')

  let totalImported = 0

  for (const lang of LANGUAGES) {
    const filePath = path.join(MESSAGES_DIR, `${lang}.json`)

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Файл не найден: ${filePath}, пропускаем`)
      continue
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const json = JSON.parse(raw)
    const entries = flattenJson(json)

    console.log(`📦 [${lang.toUpperCase()}] Найдено ${entries.length} записей...`)

    // Используем upsert чтобы не дублировать при повторном запуске
    const operations = entries.map((entry) =>
      prisma.translation.upsert({
        where: {
          lang_section_key: {
            lang,
            section: entry.section,
            key: entry.key,
          },
        },
        update: {
          value: entry.value,
        },
        create: {
          lang,
          section: entry.section,
          key: entry.key,
          value: entry.value,
        },
      })
    )

    // Батчами по 100 для производительности
    const batchSize = 100
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize)
      await prisma.$transaction(batch)
    }

    totalImported += entries.length
    console.log(`✅ [${lang.toUpperCase()}] Импортировано ${entries.length} записей`)
  }

  console.log(`\n🎉 Готово! Всего импортировано: ${totalImported} записей`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при импорте:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })