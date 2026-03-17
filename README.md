<div align="center">

```
██╗     ██╗   ██╗███╗   ███╗ █████╗     ███████╗██╗  ██╗██╗███╗   ██╗
██║     ██║   ██║████╗ ████║██╔══██╗    ██╔════╝██║ ██╔╝██║████╗  ██║
██║     ██║   ██║██╔████╔██║███████║    ███████╗█████╔╝ ██║██╔██╗ ██║
██║     ██║   ██║██║╚██╔╝██║██╔══██║    ╚════██║██╔═██╗ ██║██║╚██╗██║
███████╗╚██████╔╝██║ ╚═╝ ██║██║  ██║    ███████║██║  ██╗██║██║ ╚████║
╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
```

**`// LASER STUDIO · WEB PLATFORM v1.0`**

*онлайн-бронирование · административная панель · мультиязычность*

---

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-Auth-FF007A?style=for-the-badge)](https://next-auth.js.org)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![DeepL](https://img.shields.io/badge/DeepL-Translate-0F2B46?style=for-the-badge)](https://deepl.com)

</div>

---

```
  ╔══════════════════════════════════════════════════════════════════════╗
  ║                                                                      ║
  ║   CLIENT VIEW            ║   ADMIN PANEL                            ║
  ║   ───────────────────    ║   ────────────────────────────           ║
  ║   [ Главная ]            ║   ▶ Услуги & Пакеты                      ║
  ║   [ Услуги ]             ║   ▶ Бронирования                         ║
  ║   [ Галерея ]            ║   ▶ Галерея                              ║
  ║   [ Бронирование ] ◀━━━━━║━━ ▶ Пользователи                        ║
  ║   [ UA | EN | ... ]      ║   ▶ Переводы (DeepL)                     ║
  ║                          ║                                          ║
  ║   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   ║
  ║   STATUS: // ONLINE   ▌  DB: SQLite   ▌  NODE: 18+   ▌  v1.0      ║
  ╚══════════════════════════════════════════════════════════════════════╝
```

---

## `> SYSTEM.FEATURES`

| МОДУЛЬ | ОПИСАНИЕ | СТАТУС |
|:-------|:---------|:------:|
| `BOOKING_ENGINE` | Онлайн-бронирование косметологических услуг | `[ACTIVE]` |
| `I18N` | Мультиязычный интерфейс — UA, EN и другие | `[ACTIVE]` |
| `GALLERY` | Галерея работ студии с загрузкой через Cloudinary | `[ACTIVE]` |
| `SERVICE_MGMT` | Управление услугами и пакетами из админки | `[ACTIVE]` |
| `ADMIN_PANEL` | Полная административная панель управления сайтом | `[ACTIVE]` |
| `AUTH` | Аутентификация и авторизация через NextAuth.js | `[ACTIVE]` |
| `EMAIL_NOTIFY` | Email-уведомления о бронированиях (SMTP) | `[ACTIVE]` |
| `AUTO_TRANSLATE` | Автоматическая локализация контента (DeepL API) | `[ACTIVE]` |
| `IMAGE_STORAGE` | Загрузка и хранение изображений (Cloudinary) | `[ACTIVE]` |

---

## `> TECH.STACK`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   FRONTEND          BACKEND            INFRA                    │
│   ───────────────   ─────────────────  ─────────────────────    │
│   Next.js 16        REST API           Cloudinary (images)      │
│   Tailwind CSS      Prisma ORM         DeepL API (i18n)         │
│   NextAuth.js       SQLite             Hetzner (deploy)         │
│                                        PM2 / Systemd            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| ТЕХНОЛОГИЯ | ВЕРСИЯ | НАЗНАЧЕНИЕ |
|:-----------|:------:|:-----------|
| `Next.js` | 16 | Основной фреймворк |
| `Prisma ORM` | latest | Работа с базой данных |
| `SQLite` | — | База данных |
| `NextAuth.js` | — | Аутентификация |
| `Tailwind CSS` | — | Стилизация интерфейса |
| `Cloudinary` | — | Хранение изображений |
| `DeepL API` | — | Перевод контента |

---

## `> QUICK.BOOT`

### Требования

```
Runtime  ─── Node.js 18+
Package  ─── npm / yarn / pnpm
```

### `// STEP 1 — клонирование`

```bash
git clone https://github.com/Bifyp/lumaskin.git
cd lumaskin
```

### `// STEP 2 — зависимости`

```bash
npm install
```

### `// STEP 3 — файл окружения`

```bash
cp .env.example .env.local
```

### `// STEP 4 — переменные окружения`

Заполните `.env.local`:

```env
# ── DATABASE ──────────────────────────────────────
DATABASE_URL="file:./dev.db"

# ── NEXTAUTH ──────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# ── EMAIL (SMTP) ───────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@example.com
ADMIN_EMAIL=admin@example.com

# ── API KEYS ───────────────────────────────────────
DEEPL_API_KEY=your-deepl-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### `// STEP 5 — база данных`

```bash
npx prisma migrate dev
```

### `// STEP 6 — запуск`

```bash
npm run dev
```

```
ACCESS POINT ──▶  http://localhost:3000
```

---

## `> PRODUCTION.DEPLOY`

```bash
npm run build && npm run start
```

---

## `> ARCHITECTURE.MAP`

```
lumaskin/
│
├── app/
│   ├── [locale]/          ◀  публичные страницы с локализацией
│   ├── admin/             ◀  административная панель
│   └── api/               ◀  REST API endpoints
│
├── lib/
│   ├── prisma.ts          ◀  Prisma клиент
│   ├── auth.ts            ◀  конфигурация NextAuth
│   └── validations.ts     ◀  Zod схемы валидации
│
└── prisma/
    └── schema.prisma        схема базы данных
```

---

## `> API.ENDPOINTS`

```
╔══════════════╦══════════════════════════════╦═══════════════════════════════════╗
║   МЕТОД      ║   ENDPOINT                   ║   ОПИСАНИЕ                        ║
╠══════════════╬══════════════════════════════╬═══════════════════════════════════╣
║  POST        ║  /api/auth/register          ║  Регистрация пользователя         ║
║  POST        ║  /api/bookings               ║  Создание бронирования            ║
║  GET         ║  /api/translations           ║  Получение переводов              ║
╠══════════════╬══════════════════════════════╬═══════════════════════════════════╣
║  POST      ║  /api/admin/services         ║  Управление услугами              ║
║  POST      ║  /api/admin/gallery          ║  Управление галереей              ║
╚══════════════╩══════════════════════════════╩═══════════════════════════════════╝
                                                                требует авторизацию
```

---

## `> SERVER.DEPLOY  ──  Hetzner`

```diff
+ 1. Скопируйте проект на сервер
+ 2. Создайте .env.local с production-настройками
+ 3. Установите зависимости и выполните миграции

  npm install
  npx prisma migrate deploy

+ 4. Соберите проект

  npm run build

+ 5. Запустите сервер

  npm run start

# Рекомендуется для управления процессом:
  PM2  ·  Systemd  ·  Docker (опционально)
```

---

## `> LICENSE`

```
MIT License — делай что хочешь, упомяни автора.
```

---

<div align="center">

```
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 ░                                                    ░
 ░        // LUMA SKIN · LASER STUDIO · v1.0          ░
 ░            CREATED: 01.03.2026                     ░
 ░                                                    ░
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

*по вопросам — свяжитесь с разработчиком*

</div>
