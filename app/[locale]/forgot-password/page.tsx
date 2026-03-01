"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPasswordPage");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (res.ok) {
      setSent(true);
    }
  }

  return (
    <div className="py-24 bg-milk">
      <div className="container px-6">
        <div className="max-w-md mx-auto bg-white p-10 shadow-xl rounded-lg border border-gold/20">

          {!sent ? (
            <>
              <h1 className="text-3xl font-serif text-center mb-6">
                {t("title")}
              </h1>

              <p className="text-graphite/60 text-center mb-8">
                {t("description")}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-graphite/70 mb-2">
                    {t("emailLabel")}
                  </label>
                  <input
                    type="email"
                    required
                    className="border-2 border-gold/30 focus:border-gold p-4 w-full rounded-md"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gold text-white w-full py-4 rounded-md uppercase tracking-widest text-sm hover:bg-graphite transition"
                >
                  {t("submit")}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-4">{t("sentTitle")}</h2>
              <p className="text-graphite/60">{t("sentDescription")}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
