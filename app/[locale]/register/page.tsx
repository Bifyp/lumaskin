"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const t = useTranslations("RegisterPage");

  const [step, setStep] = useState<"register" | "verify">("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    console.log("HANDLE REGISTER FIRED");


    if (password !== confirmPassword) {
      alert(t("form.passwordsDontMatch"));
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.ok) {
      setStep("verify");
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, code }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = "/login";
    }
  }

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[40vh] flex items-center justify-center fade-in bg-milk">
        <div className="container text-center relative z-10 px-6">
          <h1 className="text-6xl md:text-7xl font-serif mb-8 text-graphite leading-tight">
            {t("hero.title")}<br />
            <span className="text-gold italic">{t("hero.titleAccent")}</span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto mt-6"></div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-32 fade-up">
        <div className="container px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <p className="text-graphite/70 font-sans text-lg">
                {t("intro.description")}
              </p>
            </div>

            {/* STEP 1 — REGISTER */}
            {step === "register" && (
              <form
                onSubmit={handleRegister}
                className="p-10 bg-white shadow-2xl rounded-lg border border-gold/20 space-y-6"
              >
                {/* NAME */}
                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t("form.name.label")} *
                  </label>
                  <input
                    type="text"
                    placeholder={t("form.name.placeholder")}
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t("form.email.label")} *
                  </label>
                  <input
                    type="email"
                    placeholder={t("form.email.placeholder")}
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t("form.password.label")} *
                  </label>
                  <input
                    type="password"
                    placeholder={t("form.password.placeholder")}
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-graphite/50 text-xs mt-2">
                    {t("form.password.hint")}
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t("form.confirmPassword.label")} *
                  </label>
                  <input
                    type="password"
                    placeholder={t("form.confirmPassword.placeholder")}
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {/* TERMS */}
                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="w-4 h-4 mt-1 accent-gold" />
                  <label className="text-graphite/60 text-sm">
                    {t("form.terms")}{" "}
                    <a href="/terms" className="text-gold hover:underline">
                      {t("form.termsLink")}
                    </a>{" "}
                    {t("form.and")}{" "}
                    <a href="/privacy" className="text-gold hover:underline">
                      {t("form.privacyLink")}
                    </a>
                  </label>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="group relative bg-gold text-white w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <span className="relative z-10">{t("form.registerButton")}</span>
                  <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>

                {/* OR */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gold/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-graphite/50 uppercase tracking-wider">
                      {t("form.or")}
                    </span>
                  </div>
                </div>

                {/* GOOGLE */}
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="border-2 border-gold/30 text-graphite w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm transition-all hover:border-gold hover:bg-gold/5 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  {t("form.googleButton")}
                </button>

                {/* LOGIN LINK */}
                <p className="text-center text-graphite/50 text-sm mt-6">
                  {t("form.haveAccount")}{" "}
                  <a href="/login" className="text-gold hover:underline font-semibold">
                    {t("form.loginLink")}
                  </a>
                </p>
              </form>
            )}

            {/* STEP 2 — VERIFY CODE */}
            {step === "verify" && (
              <form
                onSubmit={handleVerify}
                className="p-10 bg-white shadow-2xl rounded-lg border border-gold/20 space-y-6"
              >
                <p className="text-center text-graphite/70 font-sans text-lg mb-6">
                  {t("form.verifyMessage")} <br />
                  <span className="font-semibold text-graphite">{email}</span>
                </p>

                <div>
                  <label className="block text-graphite/70 font-sans mb-2 text-sm uppercase tracking-wider">
                    {t("form.code.label")} *
                  </label>
                  <input
                    type="text"
                    placeholder={t("form.code.placeholder")}
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md transition-all"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="group relative bg-gold text-white w-full py-4 rounded-md font-sans uppercase tracking-widest text-sm overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <span className="relative z-10">{t("form.verifyButton")}</span>
                  <div className="absolute inset-0 bg-graphite transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-32 bg-milk fade-left">
        <div className="container px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-graphite mb-6">
              {t("benefits.title")}
            </h2>
            <div className="w-20 h-px bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {t.raw("benefits.items").map((benefit: any, idx: number) => (
              <div
                key={idx}
                className="text-center p-8 bg-white border border-gold/20 transition-all hover:border-gold hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-serif mb-3 text-graphite">
                  {benefit.title}
                </h3>
                <p className="text-graphite/70 text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="py-32 fade-right">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 rounded-full mb-8">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-3xl font-serif text-graphite mb-6">
              {t("security.title")}
            </h2>
            <p className="text-graphite/70 leading-relaxed max-w-2xl mx-auto">
              {t("security.description")}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
