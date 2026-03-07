'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

interface Service {
  id: string;
  title: string;
  price?: string | null;
}

interface Package {
  id: string;
  title: string;
  sessions: string;
  price: number;
  badge: string | null;
  popular: boolean;
}

// ─── Слоты по дням недели ────────────────────────────────────────────────────
// 0=Вс, 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб
const SLOTS_BY_DAY: Record<number, string[]> = {
  0: ["11:00","11:30","12:00","12:30","13:00","13:30"],                                          // Вс 11-14
  1: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Пн 9:30-19
  2: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Вт
  3: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Ср
  4: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Чт
  5: ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30"], // Пт
  6: ["10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30"],           // Сб 10-15
};

// ─── Inline Calendar ─────────────────────────────────────────────────────────
function Calendar({
  value,
  onChange,
  labels,
}: {
  value: string;
  onChange: (date: string) => void;
  labels: { selectedDate: string };
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const selected = value ? new Date(value + 'T00:00:00') : null;

  const locale = useLocale();

  // Mon–Sun day labels via Intl (locale-aware)
  // Reference week: Mon=2025-01-06 … Sun=2025-01-12
  const DAYS_SHORT = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' })
      .format(new Date(2025, 0, 6 + i)) // 6 Jan 2025 = Monday
      .replace('.', '')
      .slice(0, 2)
      .toUpperCase()
  );

  // Month names via Intl (locale-aware)
  const MONTHS = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: 'long' })
      .format(new Date(2025, i, 1))
      .replace(/^\p{L}/u, (c) => c.toUpperCase())
  );

  // Grid: Monday-based
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const rawDow = firstOfMonth.getDay(); // 0=Sun
  const offset = rawDow === 0 ? 6 : rawDow - 1; // Mon=0 … Sun=6

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDay(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return;
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
  }

  function cellState(day: number | null): 'empty' | 'past' | 'selected' | 'today' | 'available' {
    if (day === null) return 'empty';
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return 'past';
    if (
      selected &&
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    ) return 'selected';
    if (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    ) return 'today';
    return 'available';
  }

  return (
    <div className="w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="font-serif text-graphite text-lg tracking-wide">
          {MONTHS[viewMonth]} <span className="text-gold">{viewYear}</span>
        </span>

        <button
          type="button"
          onClick={nextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className={`text-center text-xs uppercase tracking-widest font-sans pb-2 ${
              d === 'Нд' ? 'text-gold/50' : 'text-graphite/40'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gold/20 mb-3" />

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          const state = cellState(day);
          if (state === 'empty') {
            return <div key={idx} />;
          }

          const dow = day !== null ? new Date(viewYear, viewMonth, day).getDay() : -1;
          const isSunday = dow === 0;

          const base = 'relative flex items-center justify-center h-9 w-9 mx-auto rounded-full text-sm font-sans transition-all duration-200';

          const cls: Record<string, string> = {
            past: `${base} text-graphite/20 cursor-not-allowed`,
            selected: `${base} bg-gold text-white shadow-lg shadow-gold/30 scale-110 cursor-pointer`,
            today: `${base} border border-gold text-gold hover:bg-gold/10 cursor-pointer font-medium`,
            available: `${base} ${isSunday ? 'text-gold/70' : 'text-graphite'} hover:bg-gold/10 hover:text-gold cursor-pointer`,
          };

          return (
            <button
              key={idx}
              type="button"
              disabled={state === 'past'}
              onClick={() => day && handleDay(day)}
              className={cls[state] || base}
            >
              {day}
              {/* Dot for today */}
              {state === 'today' && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date display */}
      {selected && (
        <div className="mt-5 pt-4 border-t border-gold/20 text-center">
          <span className="text-xs uppercase tracking-widest text-graphite/40 font-sans">{labels.selectedDate}</span>
          <p className="text-gold font-serif text-base mt-1">
            {selected.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const t = useTranslations('BookingPage');

  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [tab, setTab] = useState<'services' | 'packages'>('services');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    serviceName: '',
    date: '',
    time: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/services')
      .then((r) => r.json())
      .then((data) => { if (data.services) setServices(data.services); })
      .catch(console.error);

    fetch('/api/admin/packages')
      .then((r) => r.json())
      .then((data) => { if (data.packages) setPackages(data.packages); })
      .catch(console.error);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleTabChange(newTab: 'services' | 'packages') {
    setTab(newTab);
    setForm((prev) => ({ ...prev, serviceName: '' }));
  }

  function handleDateChange(date: string) {
    setForm((prev) => ({ ...prev, date, time: '' }));
    setError('');
    // Загружаем занятые слоты для выбранной даты
    setSlotsLoading(true);
    setBookedSlots([]);
    fetch(`/api/bookings?date=${date}`)
      .then((r) => r.json())
      .then((data) => { if (data.bookedSlots) setBookedSlots(data.bookedSlots); })
      .catch(console.error)
      .finally(() => setSlotsLoading(false));
  }

  // Time slots based on selected day of week
  const availableSlots: string[] = (() => {
    if (!form.date) return [];
    const d = new Date(form.date + 'T00:00:00');
    const dow = d.getDay(); // 0=Sun
    return SLOTS_BY_DAY[dow] ?? [];
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 409) {
        setError(t('form.errorSlotTaken'));
        return;
      }
      if (!data.success) throw new Error(data.error ?? 'Error');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? t('form.errorGeneric'));
    } finally {
      setLoading(false);
    }
  }

  const selectedService = services.find((s) => s.title === form.serviceName);
  const selectedPackage = packages.find((p) => p.title === form.serviceName);

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center fade-in bg-milk">
        <div className="container text-center relative z-10 px-6">
          <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
            {t('hero.subtitle')}
          </span>
          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            {t('hero.title')}<br/>
            <span className="text-gold italic">{t('hero.titleAccent')}</span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      {/* ФОРМА */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-graphite/70 font-sans text-lg">
                {t('form.description')}
              </p>
            </div>

            <div className="p-12 bg-white shadow-2xl rounded-lg border border-gold/20">

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6">
                    <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-serif text-graphite mb-3">{t('form.successTitle')}</h2>
                  <p className="text-graphite/60 mb-8">{t('form.successDesc')}</p>

                  <div className="text-left border border-gold/20 rounded-md p-6 space-y-3 mb-8">
                    <Row label={t('form.fields.firstName.label')} value={`${form.firstName} ${form.lastName}`} />
                    <Row label={t('form.fields.service.label')} value={form.serviceName} />
                    {selectedService?.price && (
                      <Row label={t('form.fields.price')} value={`${selectedService.price} PLN`} />
                    )}
                    {selectedPackage && (
                      <Row label={t('form.fields.price')} value={`${selectedPackage.price} PLN`} />
                    )}
                    <Row label={t('form.fields.date.label')} value={form.date} />
                    <Row label={t('form.fields.time.label')} value={form.time} />
                  </div>

                  <button
                    onClick={() => {
                      setSuccess(false);
                      setForm({ firstName:'',lastName:'',phone:'',email:'',serviceName:'',date:'',time:'',comment:'' });
                    }}
                    className="text-sm uppercase tracking-widest text-gold border border-gold/40 px-8 py-3 rounded-md hover:bg-gold/5 transition-colors"
                  >
                    {t('form.newBooking')}
                  </button>
                </div>
              ) : (

              <form className="space-y-8" onSubmit={handleSubmit}>

                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.firstName.label')}
                    </label>
                    <input
                      name="firstName" type="text" value={form.firstName}
                      onChange={handleChange} placeholder={t('form.fields.firstName.placeholder')}
                      required className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.lastName.label')}
                    </label>
                    <input
                      name="lastName" type="text" value={form.lastName}
                      onChange={handleChange} placeholder={t('form.fields.lastName.placeholder')}
                      required className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {/* Contact fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.phone.label')}
                    </label>
                    <input
                      name="phone" type="tel" value={form.phone}
                      onChange={handleChange} placeholder={t('form.fields.phone.placeholder')}
                      required className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.email.label')}
                    </label>
                    <input
                      name="email" type="email" value={form.email}
                      onChange={handleChange} placeholder={t('form.fields.email.placeholder')}
                      required className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {/* SERVICE / PACKAGE TABS */}
                <div>
                  <label className="block text-graphite/70 font-sans mb-3 text-sm uppercase tracking-wider">
                    {t('form.fields.service.label')}
                  </label>
                  <div className="flex gap-0 mb-4 border-2 border-gold/30 rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleTabChange('services')}
                      className={`flex-1 py-2.5 text-sm font-sans uppercase tracking-wider transition-all duration-200 ${
                        tab === 'services' ? 'bg-gold text-white' : 'text-graphite/60 hover:bg-gold/5'
                      }`}
                    >
                      ✨ {t('form.tabServices')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('packages')}
                      className={`flex-1 py-2.5 text-sm font-sans uppercase tracking-wider transition-all duration-200 border-l-2 border-gold/30 ${
                        tab === 'packages' ? 'bg-gold text-white' : 'text-graphite/60 hover:bg-gold/5'
                      }`}
                    >
                      🎁 {t('form.tabPackages')}
                    </button>
                  </div>

                  {tab === 'services' && (
                    <div>
                      <select
                        name="serviceName" value={form.serviceName} onChange={handleChange} required
                        className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none appearance-none bg-white"
                      >
                        <option value="">{t('form.fields.service.placeholder')}</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}{s.price ? ` — ${s.price} PLN` : ''}
                          </option>
                        ))}
                      </select>
                      {selectedService?.price && (
                        <p className="mt-1.5 text-sm text-gold/80">
                          {t('form.fields.price')}: {selectedService.price} PLN
                        </p>
                      )}
                    </div>
                  )}

                  {tab === 'packages' && (
                    <div>
                      <select
                        name="serviceName" value={form.serviceName} onChange={handleChange} required
                        className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none appearance-none bg-white"
                      >
                        <option value="">{t('form.packagePlaceholder')}</option>
                        {packages.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title} — {p.sessions} — {p.price} PLN
                          </option>
                        ))}
                      </select>
                      {selectedPackage && (
                        <p className="mt-1.5 text-sm text-gold/80">
                          {t('form.fields.price')}: {selectedPackage.price} PLN · {selectedPackage.sessions}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* ─── CALENDAR ──────────────────────────────────────── */}
                <div>
                  <label className="block text-graphite/70 font-sans mb-4 text-sm uppercase tracking-wider">
                    {t('form.fields.date.label')}
                  </label>

                  <div className="border-2 border-gold/30 rounded-md p-6 bg-white">
                    <Calendar value={form.date} onChange={handleDateChange} labels={{ selectedDate: t('form.selectedDate') }} />
                  </div>

                  {/* Hidden input so form validation works */}
                  <input type="hidden" name="date" value={form.date} required />
                </div>

                {form.date && (
                  <div>
                    <label className="block text-graphite/70 font-sans mb-4 text-sm uppercase tracking-wider">
                      {t('form.fields.time.label')}
                    </label>

                    {slotsLoading ? (
                      <div className="flex items-center gap-2 text-graphite/40 text-sm font-sans py-4">
                        <svg className="w-4 h-4 animate-spin text-gold" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Завантаження...
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {availableSlots.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = form.time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => {
                                if (isBooked) return;
                                setForm((prev) => ({ ...prev, time: slot }));
                                setError('');
                              }}
                              title={isBooked ? 'Зайнято' : slot}
                              className={`relative py-2.5 text-sm font-sans rounded-md border-2 transition-all duration-200 ${
                                isBooked
                                  ? 'border-graphite/10 text-graphite/20 bg-graphite/5 cursor-not-allowed line-through'
                                  : isSelected
                                    ? 'bg-gold text-white border-gold shadow-md shadow-gold/20 scale-105'
                                    : 'border-gold/30 text-graphite hover:border-gold hover:text-gold cursor-pointer'
                              }`}
                            >
                              {slot}
                              {isBooked && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-4 h-px bg-graphite/20 rotate-45 absolute" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <input type="hidden" name="time" value={form.time} required />
                    {form.date && !form.time && !slotsLoading && (
                      <p className="mt-2 text-xs text-graphite/40 font-sans">
                        {t('form.timeHint')}
                      </p>
                    )}
                  </div>
                )}

                {/* Comment */}
                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t('form.fields.comment.label')}
                  </label>
                  <textarea
                    name="comment" rows={4} value={form.comment}
                    onChange={handleChange} placeholder={t('form.fields.comment.placeholder')}
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none resize-none"
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                  type="submit" disabled={loading || !form.date || !form.time}
                  className="group relative bg-gold text-white w-full py-5 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <span className="relative z-10">
                    {loading ? t('form.submitting') : t('form.submitButton')}
                  </span>
                  <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <p className="text-center text-graphite/50 text-sm">
                  {t('form.requiredNote')}
                </p>
              </form>
              )}
            </div>

            <div className="mt-16 text-center">
              <p className="text-graphite/70 font-sans mb-4 text-lg">
                {t('contact.text')}
              </p>
              <a href="tel:+48123456789" className="text-4xl font-serif text-gold hover:underline inline-block transition-all duration-300 hover:scale-105">
                {t('contact.phone')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ИНФОРМАЦИЯ */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-graphite mb-6">{t('info.title')}</h2>
              <div className="w-20 h-px bg-gold mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.raw('info.items').map((info: any, idx: number) => (
                <div key={idx} className="text-center p-8 bg-white border border-gold/20 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2">
                  <div className="text-5xl mb-4">{info.icon}</div>
                  <h3 className="text-xl font-serif mb-4 text-graphite">{info.title}</h3>
                  <p className="text-graphite/70 leading-relaxed text-sm">{info.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 fade-right">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">{t('faq.subtitle')}</span>
              <h2 className="text-4xl font-serif text-graphite mb-6">{t('faq.title')}</h2>
              <div className="w-20 h-px bg-gold mx-auto"></div>
            </div>
            <div className="space-y-6">
              {t.raw('faq.items').map((faq: any, idx: number) => (
                <div key={idx} className="bg-white p-8 border-l-4 border-gold shadow-md hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-serif mb-3 text-graphite">{faq.question}</h3>
                  <p className="text-graphite/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm border-b border-gold/10 pb-2 last:border-0 last:pb-0">
      <span className="text-graphite/50">{label}</span>
      <span className="font-medium text-graphite">{value}</span>
    </div>
  );
}