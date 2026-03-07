"use client";
import { useTranslations } from 'next-intl';
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/" });
  }

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[40vh] flex items-center justify-center fade-in bg-milk">
        <div className="container text-center relative z-10 px-6">
          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            {t('hero.title')}<br/>
            <span className="text-gold italic">{t('hero.titleAccent')}</span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      {/* ФОРМА ВХОДА */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="max-w-md mx-auto">
            <form
              onSubmit={handleSubmit}
              className="p-10 bg-white shadow-2xl rounded-lg border border-gold/20 space-y-6"
            >
              <div>
                <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                  {t('form.email.label')}
                </label>
                <input
                  type="email"
                  placeholder={t('form.email.placeholder')}
                  required
                  className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                  {t('form.password.label')}
                </label>
                <input
                  type="password"
                  placeholder={t('form.password.placeholder')}
                  required
                  className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all duration-300 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-gold" />
                  <span className="text-graphite/60 text-sm">{t('form.rememberMe')}</span>
                </label>
                <a href="/forgot-password" className="text-gold text-sm hover:underline">
                  {t('form.forgotPassword')}
                </a>
              </div>

              <button
                type="submit"
                className="group relative bg-gold text-white w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <span className="relative z-10">{t('form.submitButton')}</span>
                <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

              <p className="text-center text-graphite/50 text-sm mt-6">
                {t('form.noAccount')}{" "}
                <a href="/register" className="text-gold hover:underline font-semibold">
                  {t('form.registerLink')}
                </a>
              </p>
            </form>

            <div className="mt-12 text-center">
              <p className="text-graphite/60 text-sm">
                {t('form.loginNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА РЕГИСТРАЦИИ */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-graphite mb-6">
              {t('benefits.title')}
            </h2>
            <div className="w-20 h-px bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.raw('benefits.items').map((benefit: any, idx: number) => (
              <div
                key={idx}
                className="text-center p-8 bg-white border border-gold/20 transition-all duration-500 hover:border-gold hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-serif mb-3 text-graphite">{benefit.title}</h3>
                <p className="text-graphite/70 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}