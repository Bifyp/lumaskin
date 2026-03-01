'use client';
import { useTranslations } from 'next-intl';

export default function ServicesPage() {
  const t = useTranslations('ServicesPage');

  const services = t.raw('services'); // або дані з БД

  return (
    <div className="container py-32">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-serif mb-4 text-graphite">{t('hero.title')}</h1>
        <div className="w-20 h-px bg-gold mx-auto mb-6"></div>
        <p className="text-graphite/70 font-sans text-lg">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* EMPTY STATE */}
      {services.length === 0 && (
        <div className="text-center py-20 bg-[#FAF7F2] border border-gold/40 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-graphite mb-4">
            {t('empty.title')}
          </h3>
          <p className="text-graphite/70 mb-6">
            {t('empty.subtitle')}
          </p>
        </div>
      )}

      {/* SERVICES GRID */}
      {services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {services.map((service: any, idx: number) => (
            <div 
              key={idx}
              className="group p-10 border border-gold/30 rounded-xl hover:border-gold transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white"
            >
              <h3 className="text-3xl font-serif text-graphite mb-4">
                {service.name}
              </h3>

              <p className="text-graphite/70 mb-6 text-lg">
                {service.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-serif text-gold">{service.price}</span>
                <span className="text-graphite/50 ml-2">{service.currency}</span>
              </div>

              <a 
                href="/booking"
                className="inline-block px-8 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-md transition-all duration-300 hover:bg-graphite hover:shadow-xl group-hover:-translate-y-1"
              >
                {t('selectButton')}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
