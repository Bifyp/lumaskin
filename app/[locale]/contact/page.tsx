'use client';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

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

      {/* КОНТАКТНАЯ ИНФОРМАЦИЯ */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-20">
            {t.raw('contactInfo.items').map((contact: any, idx: number) => (
              <div 
                key={idx}
                className="text-center group p-8 bg-white border border-gold/20 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {contact.icon}
                </div>
                <h3 className="text-xl font-serif mb-3 text-graphite uppercase tracking-wider">
                  {contact.title}
                </h3>
                <p className="text-gold font-sans text-lg mb-2">
                  {contact.info}
                </p>
                <p className="text-graphite/60 text-sm">
                  {contact.subinfo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА КОНТАКТА */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
                {t('form.subtitle')}
              </span>
              <h2 className="text-5xl font-serif text-graphite mb-6">{t('form.title')}</h2>
              <div className="w-20 h-px bg-gold mx-auto mb-6"></div>
              <p className="text-graphite/70 font-sans text-lg">
                {t('form.description')}
              </p>
            </div>

            <div className="bg-white p-10 md:p-12 shadow-2xl border border-gold/20">
              <form className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.name.label')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('form.fields.name.placeholder')}
                      required
                      className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                      {t('form.fields.email.label')}
                    </label>
                    <input
                      type="email"
                      placeholder={t('form.fields.email.placeholder')}
                      required
                      className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t('form.fields.phone.label')}
                  </label>
                  <input
                    type="tel"
                    placeholder={t('form.fields.phone.placeholder')}
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t('form.fields.subject.label')}
                  </label>
                  <select 
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none appearance-none bg-white"
                  >
                    <option value="">{t('form.fields.subject.placeholder')}</option>
                    {t.raw('form.fields.subject.options').map((option: string, idx: number) => (
                      <option key={idx}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t('form.fields.message.label')}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={t('form.fields.message.placeholder')}
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="group relative w-full py-5 bg-gold text-graphite font-sans uppercase tracking-widest text-sm rounded-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <span className="relative z-10">{t('form.submitButton')}</span>
                  <div className="absolute inset-0 bg-graphite/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <p className="text-center text-graphite/50 text-sm">
                  {t('form.requiredNote')}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

     

      {/* РЕЖИМ РАБОТЫ */}
      <section className="py-32 bg-graphite text-graphite fade-up">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif mb-6 text-gold">{t('hours.title')}</h2>
              <div className="w-20 h-px bg-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-graphite/5 p-8 border border-gold/20">
                <h3 className="text-2xl font-serif mb-6 text-gold">{t('hours.weekdays.title')}</h3>
                <div className="space-y-3">
                  {t.raw('hours.weekdays.schedule').map((schedule: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-graphite/20">
                      <span className="text-graphite">{schedule.day}</span>
                      <span className="text-gold font-sans">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-graphite/5 p-8 border border-gold/20">
                <h3 className="text-2xl font-serif mb-6 text-gold">{t('hours.weekend.title')}</h3>
                <div className="space-y-3">
                  {t.raw('hours.weekend.schedule').map((schedule: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b border-graphite/20">
                      <span className="text-graphite">{schedule.day}</span>
                      <span className="text-gold font-sans">{schedule.hours}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gold/20">
                  <p className="text-graphite/70 text-sm leading-relaxed">
                    {t('hours.note')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* СОЦИАЛЬНЫЕ СЕТИ */}
      <section className="py-32 fade-left bg-milk">
        <div className="container px-6 text-center">
          <span className="text-gold/60 uppercase tracking-[0.3em] text-sm font-sans mb-4 block">
            {t('social.subtitle')}
          </span>
          <h2 className="text-5xl font-serif mb-8 text-graphite">
            {t('social.title')}
          </h2>
          <div className="w-20 h-px bg-gold mx-auto mb-12"></div>

          <p className="text-graphite/70 font-sans mb-12 text-lg max-w-2xl mx-auto">
            {t('social.description')}
          </p>

          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a
              href="https://www.instagram.com/lumaskin_laser_studio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="group flex items-center gap-3 px-8 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              <span className="text-2xl">
                <img draggable="false" className="ext-emoji" alt="📷" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4f7.svg" />
              </span>
              Instagram
            </a>

            <a
              href="https://www.facebook.com/share/1DGrdC9RvF/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="group flex items-center gap-3 px-8 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              <span className="text-2xl">
                <img draggable="false" className="ext-emoji" alt="📘" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4d8.svg" />
              </span>
              Facebook
            </a>

            <a
              href="https://booksy.com/pl-pl/307205_lumaskin-laser-studio_depilacja_16974_swarzedz#ba_s=seo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Booksy"
              title="Booksy"
              className="group flex items-center gap-3 px-8 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              <span className="text-2xl">
                <img draggable="false" className="ext-emoji" alt="💆‍♀️" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f486-200d-2640-fe0f.svg" />
              </span>
              Booksy
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 fade-up relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold/20"></div>
        
        <div className="container px-6 text-center">
          <h2 className="text-5xl font-serif mb-8 text-graphite">
            {t('cta.title')}<br/>
            {t('cta.titleLine2')} <span className="text-gold italic">{t('cta.titleAccent')}</span>?
          </h2>
          
          <p className="text-graphite/70 font-sans mb-12 text-lg max-w-2xl mx-auto">
            {t('cta.description')}
          </p>

          <div className="flex gap-6 justify-center items-center flex-wrap">
            <a 
              href="/booking" 
              className="group relative px-10 py-4 bg-gold text-graphite font-sans uppercase tracking-widest text-sm rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gold/30 hover:-translate-y-1"
            >
              <span className="relative z-10">{t('cta.bookingButton')}</span>
              <div className="absolute inset-0 bg-graphite/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </a>

            <a 
              href="tel:+48123456789" 
              className="px-10 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
            >
              {t('cta.callButton')}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
