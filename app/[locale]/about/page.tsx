'use client';
import { useTranslations } from 'next-intl';
import LazyImage from "../../../components/LazyImage";
import { usePagePhoto } from '../../../components/hooks/usePagePhoto';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  const { url: portraitUrl, alt: portraitAlt } = usePagePhoto('about', '/about/master-portrait.jpg');
  const { url: studioUrl, alt: studioAlt }     = usePagePhoto('about-studio', '/about/studio.jpg');

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center fade-in bg-milk">
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

      {/* МИССИЯ */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-6 block">
              {t('mission.subtitle')}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-10 text-graphite leading-relaxed">
              {t('mission.title')}
            </h2>
            <p className="text-lg text-graphite/70 font-sans leading-relaxed mb-8">
              {t('mission.paragraph1')}
            </p>
            <p className="text-lg text-graphite/70 font-sans leading-relaxed">
              {t('mission.paragraph2')}
            </p>
          </div>
        </div>
      </section>

      {/* О МАСТЕРЕ */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gold/20 -z-10"></div>
              <LazyImage
                src={portraitUrl}
                alt={portraitAlt || t('master.imageAlt')}
                className="w-full h-150 object-cover shadow-2xl"
              />
            </div>

            <div>
              <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
                {t('master.subtitle')}
              </span>
              <h2 className="text-5xl font-serif mb-6 text-graphite leading-tight">
                {t('master.name')}
              </h2>
              <p className="text-gold font-sans mb-8 text-lg italic">
                {t('master.title')}
              </p>
              <p className="text-graphite/70 font-sans mb-6 leading-relaxed">
                {t('master.paragraph1')}
              </p>
              <p className="text-graphite/70 font-sans mb-6 leading-relaxed">
                {t('master.paragraph2')}
              </p>
              <div className="border-l-2 border-gold/40 pl-6 mb-8">
                <p className="text-graphite/80 font-sans italic leading-relaxed">
                  &quot;{t('master.quote')}&quot;
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-graphite font-sans font-semibold mb-4 uppercase tracking-wider text-sm">
                  {t('master.certificatesTitle')}
                </h3>
                {t.raw('master.certificates').map((cert: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-gold text-xl mt-1">✓</span>
                    <span className="text-graphite/70 font-sans">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ЦЕННОСТИ */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="text-center mb-20">
            <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
              {t('values.subtitle')}
            </span>
            <h2 className="text-5xl font-serif text-graphite">{t('values.title')}</h2>
            <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {t.raw('values.items').map((value: any, idx: number) => (
              <div
                key={idx}
                className="group text-center p-8 bg-white border border-gold/10 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                <h3 className="text-2xl font-serif mb-4 text-graphite">{value.title}</h3>
                <p className="text-graphite/70 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* СТУДИЯ */}
      <section className="py-32 bg-graphite text-black fade-right">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
                {t('studio.subtitle')}
              </span>
              <h2 className="text-5xl font-serif mb-8 leading-tight">
                {t('studio.title')}<br/>{t('studio.titleLine2')}
              </h2>
              <p className="text-black/80 font-sans mb-6 leading-relaxed text-lg">
                {t('studio.paragraph')}
              </p>
              <div className="space-y-4 mb-8">
                {t.raw('studio.features').map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-gold text-xl mt-1">✓</span>
                    <span className="text-black/80 font-sans">{feature}</span>
                  </div>
                ))}
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 text-gold font-sans uppercase tracking-wider border-b-2 border-gold/30 pb-2 hover:border-gold transition-all duration-300"
              >
                {t('studio.linkText')}
                <span className="text-xl">→</span>
              </a>
            </div>
            <div className="relative">
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold/20 -z-10"></div>
              <LazyImage
                src={studioUrl}
                alt={studioAlt || t('studio.imageAlt')}
                className="w-full h-125 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold/20"></div>
        <div className="container px-6 text-center">
          <h2 className="text-5xl font-serif mb-8 text-graphite">
            {t('cta.title')}<br/>
            <span className="text-gold italic">{t('cta.titleAccent')}</span>
          </h2>
          <p className="text-graphite/70 font-sans mb-12 text-lg max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a
              href="/booking"
              className="group relative px-10 py-4 bg-gold text-white font-sans uppercase tracking-widest text-sm rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-1"
            >
              <span className="relative z-10">{t('cta.bookButton')}</span>
              <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>
            <a
              href="/services"
              className="px-10 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              {t('cta.servicesButton')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}