# Luma Skin Laser Studio

Веб-сайт и административная панель для студии лазерной косметологии.

## Возможности

- 🎯 Бронирование услуг онлайн
- 📱 Мультиязычность (UA, EN, etc)
- 🖼️ Галерея работ
- 💼 Управление услугами и пакетами
- 📊 Admin панель для управления контентом
- 🔐 Аутентификация и авторизация
- 📧 Email уведомления
- 🌐 Локализация контента (DeepL)
- ☁️ Загрузка изображений (Cloudinary)

## Технический стек

- **Framework:** Next.js 16
- **БД:** SQLite (Prisma ORM)
- **Auth:** NextAuth.js
- **Стили:** Tailwind CSS
- **API:** REST

## Установка

### Требования
- Node.js 18+
- npm / yarn / pnpm

### Шаги

1. **Клонируйте репозиторий:**
```bash
git clone <your-repo>
cd project
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Создайте файл `.env.local`:**
```bash
cp .env.example .env.local
```

4. **Заполните переменные окружения** (см. ниже)

5. **Инициализируйте БД:**
```bash
npx prisma migrate dev
```

6. **Запустите dev сервер:**
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Переменные окружения

Создайте файл `.env.local` с необходимыми переменными:

```env
# База данных
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@example.com
ADMIN_EMAIL=admin@example.com

# API ключи
DEEPL_API_KEY=your-deepl-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Запуск в production

```bash
npm run build
npm run start
```

## Структура проекта

```
app/
├── [locale]/           # Публичные страницы (с локализацией)
├── admin/              # Admin панель
└── api/                # REST API endpoints

lib/
├── prisma.ts          # Prisma клиент
├── auth.ts            # NextAuth конфиг
└── validations.ts     # Zod схемы валидации

prisma/
└── schema.prisma      # БД схема
```

## Основные API endpoints

- `POST /api/auth/register` — Регистрация
- `POST /api/bookings` — Создание бронирования
- `GET /api/translations` — Получение переводов
- `POST /api/admin/services` — Управление услугами (требует auth)
- `POST /api/admin/gallery` — Управление галереей (требует auth)

## Деплой на Hetzner

1. Скопируйте проект на сервер
2. Создайте `.env.local` с production переменными
3. Запустите:
```bash
npm install
npx prisma migrate deploy
npm run build
npm run start
```

4. Используйте PM2 или Systemd для управления процессом

## Контакты и поддержка

При вопросах по использованию свяжитесь с разработчиком.

---

**Версия:** 1.0  
**Дата создания:** 01.03.2026 19:00