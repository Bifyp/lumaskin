import { z } from 'zod'

// ─── Auth ──────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Невірна email адреса').toLowerCase(),
  password: z
    .string()
    .min(8, 'Мінімум 8 символів')
    .max(100)
    .regex(/[A-Z]/, 'Має містити велику літеру (A-Z)')
    .regex(/[a-z]/, 'Має містити малу літеру (a-z)')
    .regex(/[0-9]/, 'Має містити цифру (0-9)')
    .regex(/[!@#$%^&*]/, 'Має містити спецсимвол (!@#$%^&*)'),
  name: z.string().min(2, 'Мінімум 2 символи').max(100),
})

export const loginSchema = z.object({
  email: z.string().email('Невірна email адреса').toLowerCase(),
  password: z.string().min(1, 'Пароль обов\'язковий'),
})

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Обов\'язково'),
  newPassword: z.string().min(8, 'Мінімум 8 символів'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Паролі не збігаються',
  path: ['confirmPassword'],
})

// ─── Gallery ───────────────────────────────────────────────────────────────

const pageEnum = z.enum(['gallery', 'home', 'about', 'about-studio'])
const categoryEnum = z.enum(['До/Після', 'Чистка', 'Пілінг', 'Масаж', 'Ін\'єкції', 'Інше'])

export const uploadPhotoSchema = z.object({
  url: z.string().url('Невірна URL'),
  publicId: z.string().min(1, 'Обов\'язково'),
  alt: z.string().max(200).optional().default(''),
  category: categoryEnum.nullable().optional(),
  page: pageEnum,
  order: z.number().int().nonnegative().optional().default(0),
})

export const updatePhotoSchema = uploadPhotoSchema.partial().omit({ url: true, publicId: true })

// ─── Booking ───────────────────────────────────────────────────────────────

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

export const bookingSchema = z.object({
  name: z.string().min(2, 'Мінімум 2 символи').max(100),
  email: z.string().email('Невірна email адреса').toLowerCase(),
  phone: z.string().regex(phoneRegex, 'Невірний номер телефону'),
  date: z.string().datetime('Невірна дата'),
  serviceId: z.string().uuid('Невірний ID послуги'),
  message: z.string().max(500).optional().default(''),
})

// ─── Services ──────────────────────────────────────────────────────────────

export const serviceSchema = z.object({
  nameUk: z.string().min(1, 'Обов\'язково').max(100),
  nameEn: z.string().min(1).max(100).optional(),
  descriptionUk: z.string().min(10, 'Мінімум 10 символів').max(1000),
  descriptionEn: z.string().max(1000).optional(),
  priceUah: z.number().positive('Ціна повинна бути > 0').max(999999),
  duration: z.number().positive('Тривалість > 0').int(),
})

export const updateServiceSchema = serviceSchema.partial()

// ─── Packages ──────────────────────────────────────────────────────────────

export const packageSchema = z.object({
  nameUk: z.string().min(1, 'Обов\'язково').max(100),
  descriptionUk: z.string().min(10).max(1000),
  priceUah: z.number().positive(),
  sessions: z.number().positive().int(),
  discountPercent: z.number().min(0).max(100).optional().default(0),
})

export const updatePackageSchema = packageSchema.partial()

// ─── CTA ───────────────────────────────────────────────────────────────────

export const ctaSchema = z.object({
  titleUk: z.string().min(1).max(200),
  descriptionUk: z.string().min(10).max(1000),
  buttonTextUk: z.string().min(1).max(100),
  buttonLink: z.string().url(),
})

// ─── Hours ─────────────────────────────────────────────────────────────────

export const hoursSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, 'Формат HH:MM'),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Формат HH:MM'),
  isClosed: z.boolean().optional().default(false),
})

// ─── Type Exports ──────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type PackageInput = z.infer<typeof packageSchema>
export type CtaInput = z.infer<typeof ctaSchema>
export type HoursInput = z.infer<typeof hoursSchema>