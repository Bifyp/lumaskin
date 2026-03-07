'use client';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import LazyImage from "../../components/LazyImage";
import { usePagePhoto } from '../../components/hooks/usePagePhoto';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  const { url: masterUrl, alt: masterAlt } = usePagePhoto('home', '/home/master.jpg');

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center fade-in">
        <div className="container text-center relative z-10 px-6">
          <div className="inline-block mb-8">
            <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans">
              {t('hero.subtitle')}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            {t('hero.title')}<br/>
            <span className="text-gold italic">{t('hero.titleAccent')}</span>
          </h1>
          
          <p className="text-lg md:text-xl font-sans text-graphite/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t('hero.description')}<br/>
            {t('hero.descriptionLine2')}
          </p>

          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a
              href={`/${locale}/booking`}
              className="group relative px-10 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-1"
            >
              <span className="relative z-10">{t('hero.bookButton')}</span>
              <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>

            <a
              href={`/${locale}/services`}
              className="px-10 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              {t('hero.servicesButton')}
            </a>
          </div>
        </div>
      </section>

      {/* УСЛУГИ */}
      <section className="py-32 fade-up bg-milk">
        <div className="container px-6">
          <div className="text-center mb-20">
            <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
              {t('services.subtitle')}
            </span>
            <h2 className="text-5xl font-serif text-graphite">{t('services.title')}</h2>
            <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: t('services.facial.title'), desc: t('services.facial.description'), icon: t('services.facial.icon') },
              { title: t('services.peeling.title'), desc: t('services.peeling.description'), icon: t('services.peeling.icon') },
              { title: t('services.massage.title'), desc: t('services.massage.description'), icon: t('services.massage.icon') },
            ].map((service, idx) => (
              <div
                key={idx}
                className="group relative p-8 bg-white border border-gold/20 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2"
              >
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-gold/40 transition-all duration-300 group-hover:w-20 group-hover:h-20 group-hover:border-gold"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-serif mb-4 text-graphite">{service.title}</h3>
                  <p className="text-graphite/70 mb-6 leading-relaxed">{service.desc}</p>
                  <a
                    href={`/${locale}/services`}
                    className="inline-flex items-center gap-2 text-gold font-sans text-sm uppercase tracking-wider group-hover:gap-4 transition-all duration-300"
                  >
                    {t('services.learnMore')}
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* О МАСТЕРЕ */}
      <section className="py-32 fade-left relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gold/5 -z-10"></div>
        
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
                {t('about.subtitle')}
              </span>
              <h2 className="text-5xl font-serif mb-8 text-graphite leading-tight">
                {t('about.title')}<br/>
                {t('about.titleLine2')}
              </h2>
              <p className="text-graphite/70 font-sans mb-6 leading-relaxed text-lg">
                {t('about.paragraph1')}
              </p>
              <p className="text-graphite/70 font-sans mb-8 leading-relaxed">
                {t('about.paragraph2')}
              </p>
              <a
                href={`/${locale}/about`}
                className="inline-flex items-center gap-3 text-gold font-sans uppercase tracking-wider border-b-2 border-gold/30 pb-2 hover:border-gold transition-all duration-300"
              >
                {t('about.learnMore')}
                <span className="text-xl">→</span>
              </a>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gold/20 -z-10"></div>
              <LazyImage
                src={masterUrl}
                alt={masterAlt || t('about.imageAlt')}
                className="w-full h-125 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="py-32 bg-graphite text-white fade-up">
        <div className="container px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif mb-6">{t('stats.title')}</h2>
            <div className="w-20 h-px bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {[
              { number: t('stats.experience.number'), label: t('stats.experience.label') },
              { number: t('stats.clients.number'), label: t('stats.clients.label') },
              { number: t('stats.procedures.number'), label: t('stats.procedures.label') },
              { number: t('stats.premium.number'), label: t('stats.premium.label') },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-5xl font-serif text-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm uppercase tracking-widest text-black/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section className="py-32 fade-right relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold/20"></div>
        
        <div className="container px-6 text-center">
          <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
            {t('contact.subtitle')}
          </span>
          <h2 className="text-5xl font-serif mb-8 text-graphite">{t('contact.title')}</h2>
          
          <p className="text-graphite/70 font-sans mb-4 text-lg max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
          <p className="text-gold font-sans mb-12 text-xl">
            {t('contact.address')}
          </p>

          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a
              href={`/${locale}/contact`}
              className="px-10 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-graphite hover:shadow-2xl hover:-translate-y-1"
            >
              {t('contact.contactButton')}
            </a>

            <a
              href="tel:+48123456789"
              className="px-10 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              {t('contact.callButton')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}