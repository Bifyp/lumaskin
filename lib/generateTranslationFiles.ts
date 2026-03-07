import { prisma } from '@/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'
import { buildJsonFromEntries, FlatEntry } from '@/lib/flattenJson'

const LANGUAGES = ['en', 'ru', 'pl', 'uk'] as const
const MESSAGES_DIR = path.join(process.cwd(), 'messages')

export async function generateTranslationFiles(langs?: readonly string[]) {
  const targetLangs = langs ?? LANGUAGES

  for (const lang of targetLangs) {
    const dbEntries = await prisma.translation.findMany({
      where: { lang },
      select: { section: true, key: true, value: true },
    })

    if (dbEntries.length === 0) {
      console.warn(`⚠️  Нет записей для языка [${lang}] в базе данных`)
      continue
    }

    const jsonObject = buildJsonFromEntries(dbEntries as FlatEntry[])
    const filePath = path.join(MESSAGES_DIR, `${lang}.json`)

    fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, 2), 'utf-8')
    console.log(`✅ [${lang}] Записано ${dbEntries.length} переводов → ${filePath}`)
  }
}