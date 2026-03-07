/**
 * Рекурсивно "разворачивает" вложенный JSON в плоские пары section+key+value
 * Пример: { Header: { home: "Home" } } → [{ section: "Header", key: "home", value: "Home" }]
 *
 * Массивы сериализуются как JSON-строки (например, certificates, items)
 */

export type FlatEntry = {
  section: string
  key: string
  value: string
}

export function flattenJson(obj: Record<string, unknown>): FlatEntry[] {
  const entries: FlatEntry[] = []

  for (const section of Object.keys(obj)) {
    const sectionValue = obj[section]
    if (typeof sectionValue !== 'object' || sectionValue === null || Array.isArray(sectionValue)) {
      // Верхний уровень — не объект, редкий кейс, пропускаем
      continue
    }
    flattenSection(section, sectionValue as Record<string, unknown>, '', entries)
  }

  return entries
}

function flattenSection(
  section: string,
  obj: Record<string, unknown>,
  prefix: string,
  entries: FlatEntry[]
) {
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (Array.isArray(value)) {
      // Массивы храним как JSON-строку
      entries.push({ section, key: fullKey, value: JSON.stringify(value) })
    } else if (typeof value === 'object' && value !== null) {
      flattenSection(section, value as Record<string, unknown>, fullKey, entries)
    } else {
      entries.push({ section, key: fullKey, value: String(value ?? '') })
    }
  }
}

/**
 * Собирает плоские записи обратно во вложенный объект для одной секции
 */
export function unflattenSection(entries: FlatEntry[]): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const { key, value } of entries) {
    // Попытка распарсить JSON-массивы обратно
    let parsedValue: unknown = value
    if (value.startsWith('[') || value.startsWith('{')) {
      try {
        parsedValue = JSON.parse(value)
      } catch {
        parsedValue = value
      }
    }

    const parts = key.split('.')
    let current = result
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {}
      }
      current = current[part] as Record<string, unknown>
    }
    current[parts[parts.length - 1]] = parsedValue
  }

  return result
}

/**
 * Группирует плоские записи по секциям и собирает полный JSON-объект
 */
export function buildJsonFromEntries(entries: FlatEntry[]): Record<string, unknown> {
  const bySection: Record<string, FlatEntry[]> = {}

  for (const entry of entries) {
    if (!bySection[entry.section]) bySection[entry.section] = []
    bySection[entry.section].push(entry)
  }

  const result: Record<string, unknown> = {}
  for (const section of Object.keys(bySection)) {
    result[section] = unflattenSection(bySection[section])
  }
  return result
}
