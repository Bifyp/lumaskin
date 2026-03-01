"use client";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] p-8 space-y-12">

      {/* HEADER */}
      <header className="relative border-b border-[#C6A667]/30 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[#C6A667] text-xs uppercase tracking-[0.3em] font-meфdium mb-2 block">
              Luma Skin Laser Studio
            </span>
            <h1 className="text-4xl font-serif text-[#1a1a1a] tracking-tight">
              Адмін‑панель
            </h1>
            <p className="text-[#1a1a1a]/50 text-sm mt-2 font-light tracking-wide">
              Керуйте контентом, переглядайте статистику та працюйте з даними сайту
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#C6A667] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Онлайн
          </div>
        </div>
      </header>

      {/* STATS */}
      <section className="space-y-5">
        <SectionTitle>Статистика</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Бронювання" value="—" hint="Загальна кількість бронювань" icon="📅" />
          <StatCard title="Користувачі" value="—" hint="Зареєстровані користувачі" icon="👤" />
          <StatCard title="Послуги" value="—" hint="Доступні послуги на сайті" icon="✨" />
          <StatCard title="Фото" value="—" hint="Зображень у галереї" icon="🖼" />
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="space-y-5">
        <SectionTitle>Швидкі дії</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <QuickCard title="Послуги" href="/admin/services" icon="💎" hint="Створити нову послугу" />
          <QuickCard title="Галерея" href="/admin/gallery" icon="📷" hint="Додати нові фото" />
          <QuickCard title="Пакети" href="/admin/packages" icon="🎁" hint="Створити пакет процедур" />
          <QuickCard title="Переклади" href="/admin/translations" icon="🌐" hint="Редагувати переклади" />
          <QuickCard title="Налаштування" href="/admin/settings" icon="⚙️" hint="Параметри сайту" />
          <QuickCard title="Графік роботи" href="/admin/hours" icon="🕐" hint="Години роботи" />
          <QuickCard title="Сторінки" href="/admin/pages" icon="📄" hint="Текст на сторінках" />
        </div>
      </section>

      {/* LAST BOOKINGS */}
      <section className="space-y-5">
        <SectionTitle>Останні бронювання</SectionTitle>
        <div className="bg-white border border-[#C6A667]/20 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F4EE] border-b border-[#C6A667]/20">
                <th className="text-left py-3 px-5 text-[#1a1a1a]/50 text-xs uppercase tracking-wider font-medium">Клієнт</th>
                <th className="text-left py-3 px-5 text-[#1a1a1a]/50 text-xs uppercase tracking-wider font-medium">Послуга</th>
                <th className="text-left py-3 px-5 text-[#1a1a1a]/50 text-xs uppercase tracking-wider font-medium">Дата</th>
                <th className="text-left py-3 px-5 text-[#1a1a1a]/50 text-xs uppercase tracking-wider font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="py-10 text-center text-[#1a1a1a]/30 text-sm italic">
                  Бронювань поки немає
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CALENDAR */}
        <section className="space-y-4">
          <SectionTitle>Календар</SectionTitle>
          <div className="bg-white border border-[#C6A667]/20 rounded-xl p-10 text-center text-[#1a1a1a]/30 text-sm italic shadow-sm h-48 flex items-center justify-center">
            Тут буде календар
          </div>
        </section>

        {/* CHART */}
        <section className="space-y-4">
          <SectionTitle>Графік активності</SectionTitle>
          <div className="bg-white border border-[#C6A667]/20 rounded-xl p-10 text-center text-[#1a1a1a]/30 text-sm italic shadow-sm h-48 flex items-center justify-center">
            Тут буде графік
          </div>
        </section>
      </div>

      {/* SYSTEM BLOCKS */}
      <section className="space-y-5">
        <SectionTitle>Системні розділи</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SystemCard title="Ролі користувачів" desc="Керування правами доступу" icon="🔐" />
          <SystemCard title="Логи змін" desc="Історія редагувань та дій" icon="📋" />
          <SystemCard title="CTA блок" desc="Попередній перегляд CTA" icon="🎯" />
        </div>
      </section>

    </div>
  );
}

/* ── helpers ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-serif text-[#1a1a1a] tracking-tight">{children}</h2>
      <div className="flex-1 h-px bg-[#C6A667]/20"></div>
    </div>
  );
}

function StatCard({ title, value, hint, icon }: { title: string; value: string; hint: string; icon: string }) {
  return (
    <div className="group relative bg-white border border-[#C6A667]/20 rounded-xl p-5 hover:border-[#C6A667]/60 hover:shadow-md transition-all duration-200 cursor-default">
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#C6A667]/30 rounded-tl-xl group-hover:border-[#C6A667] transition-colors duration-200"></div>

      {/* Tooltip */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-all duration-200 z-50 shadow-lg">
        {hint}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]"></div>
      </div>

      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-[#1a1a1a]/50 text-xs uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-serif text-[#1a1a1a]">{value}</p>
    </div>
  );
}

function QuickCard({ title, href, icon, hint }: { title: string; href: string; icon: string; hint: string }) {
  return (
    <a
      href={href}
      className="group relative bg-white border border-[#C6A667]/20 rounded-xl p-5 hover:border-[#C6A667]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3"
    >
      {/* Tooltip */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#1a1a1a] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none transition-all duration-200 z-50 shadow-lg">
        {hint}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]"></div>
      </div>

      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#C6A667] transition-colors duration-200">{title}</span>
      <span className="ml-auto text-[#C6A667]/40 group-hover:text-[#C6A667] text-lg transition-colors duration-200">→</span>
    </a>
  );
}

function SystemCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="bg-white border border-[#C6A667]/20 rounded-xl p-5 hover:border-[#C6A667]/60 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#F8F4EE] rounded-lg flex items-center justify-center text-xl shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1a1a1a]">{title}</h3>
          <p className="text-[#1a1a1a]/50 text-xs mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
