'use client';
import { useTranslations } from 'next-intl';

export default function PackagesPage() {
  const t = useTranslations('PackagesPage');
  const packages = t.raw('packages');

  return (
    <div className="container py-32">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-serif mb-4 text-graphite">
          {t('hero.title')}
        </h1>
        <div className="w-20 h-px bg-gold mx-auto mb-6"></div>
        <p className="text-graphite/70 font-sans text-lg">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* Пустой стейт */}
      {packages.length === 0 && (
        <div className="text-center py-20 bg-[#FAF7F2] border border-gold/40 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-graphite mb-4">
            {t('empty.title')}
          </h3>
          <p className="text-graphite/70 mb-6">
            {t('empty.subtitle')}
          </p>
        </div>
      )}

      {/* Сетка пакетов */}
      {packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {packages.map((pkg: any, idx:number) => (
            <div 
              key={idx}
              className={`group relative p-10 border-2 ${
                pkg.popular 
                  ? 'border-gold rounded-lg shadow-xl bg-white' 
                  : 'border-gold/30 hover:border-gold rounded-lg'
              } text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gold text-white text-xs uppercase tracking-widest rounded-full">
                  {t('popularBadge')}
                </div>
              )}

              <h3 className={`text-3xl font-serif mb-4 text-graphite ${pkg.popular ? 'mt-4' : ''}`}>
                {pkg.name}
              </h3>

              <p className="text-graphite/70 mb-8 text-lg">{pkg.sessions}</p>

              <div className="mb-8">
                <span className="text-5xl font-serif text-gold">{pkg.price}</span>
                <span className="text-graphite/50 ml-2">{pkg.currency}</span>
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

      <div className="mt-20 text-center">
        <p className="text-graphite/50 font-sans text-sm">
          {t('validityNote')}
        </p>
      </div>
    </div>
  );
}
