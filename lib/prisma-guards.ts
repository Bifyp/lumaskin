// lib/prisma-guards.ts
// SQL Injection защита через Prisma + санитизация входных данных

import { Prisma } from "@prisma/client";
import DOMPurify from "isomorphic-dompurify";

// ============================================================
// XSS — санитизация строк
// ============================================================

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj } as Record<string, unknown>;
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (typeof val === "string") {
      result[key] = sanitizeText(val);
    } else if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      result[key] = sanitizeObject(val as Record<string, unknown>);
    }
  }
  return result as T;
}

// ============================================================
// SQL INJECTION — Prisma guards
// ============================================================

const SQL_INJECTION_PATTERNS = [
  /(\b)(union|select|insert|update|delete|drop|truncate|exec|execute|xp_|sp_)(\b)/gi,
  /--\s/g,
  /\/\*[\s\S]*?\*\//g,
  /;\s*(drop|delete|update|insert)/gi,
  /'\s*or\s*'?\d/gi,
  /'\s*;\s*/g,
];

export function detectSqlInjection(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Безопасная обёртка для Prisma $queryRaw.
 * ВСЕГДА используй Prisma.sql тэг — он параметризует запрос!
 *
 * Пример:
 *   const users = await safeRawQuery<User[]>(prisma, Prisma.sql`SELECT * FROM "User" WHERE id = ${userId}`);
 */
export async function safeRawQuery<T = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any,
  query: Prisma.Sql
): Promise<T> {
  // Типизируем через as — $queryRaw возвращает unknown в некоторых версиях Prisma
  return (await prisma.$queryRaw(query)) as T;
}

export function guardInput<T extends Record<string, unknown>>(
  data: T,
  options: { logSuspicious?: boolean } = {}
): T {
  const sanitized = sanitizeObject(data);

  if (options.logSuspicious) {
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === "string" && detectSqlInjection(val)) {
        console.warn(`[SECURITY] Suspicious SQL pattern in field "${key}": ${val.slice(0, 100)}`);
      }
    }
  }

  return sanitized;
}

// ============================================================
// Валидация типов для Prisma where-клауз
// ============================================================

export function validateId(id: unknown): string | number {
  if (typeof id === "number" && Number.isFinite(id) && id > 0) return id;
  if (typeof id === "string") {
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return id;
    const num = parseInt(id, 10);
    if (!isNaN(num) && num > 0) return num;
  }
  throw new Error(`Invalid ID: ${String(id)}`);
}

export function escapeLikeQuery(query: string): string {
  return sanitizeText(query)
    .replace(/[%_\\]/g, "\\$&")
    .slice(0, 255);
}

// ============================================================
// CSRF токен утилиты
// ============================================================

export function validateCsrfToken(
  headerToken: string | null,
  cookieToken: string | null
): boolean {
  if (!headerToken || !cookieToken) return false;
  return timingSafeEqual(headerToken, cookieToken);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}