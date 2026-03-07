import { getTranslations } from 'next-intl/server';
import { prisma } from "@/lib/prisma";
import GalleryClient from "./GalleryClient";

export const revalidate = 0;

export default async function GalleryPage() {
  const t = await getTranslations('GalleryPage');

  const images = await prisma.gallery.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

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
          <p className="text-lg text-graphite/70 font-sans mt-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <GalleryClient
            images={images}
            emptyMessage={t('gallery.emptyMessage')}
            photoLabel={t('gallery.photoLabel')}
            brandName={t('gallery.brandName')}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-graphite text-black fade-up">
        <div className="container px-6 text-center">
          <h2 className="text-5xl font-serif mb-8">
            {t('cta.title')}<br/>
            <span className="text-gold italic">{t('cta.titleAccent')}</span>?
          </h2>
          <p className="text-black/70 font-sans mb-12 text-lg max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a
              href="/booking"
              className="group relative px-10 py-4 bg-gold text-black font-sans uppercase tracking-widest text-sm rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-1"
            >
              <span className="relative z-10">{t('cta.bookingButton')}</span>
              <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
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