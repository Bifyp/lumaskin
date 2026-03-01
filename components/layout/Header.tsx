"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function Header() {
  const t = useTranslations("Header");

  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();

  const [hidden, setHidden] = useState(false);

  const lastYRef = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "uk", name: "Українська", flag: "🇺🇦" },
  ];

  const currentLang = languages.find((lang) => lang.code === locale);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    
    router.replace(newPath);
    setLangOpen(false);
    setMobileLangOpen(false);
    setOpen(false);
  };

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/packages`, label: t("packages") },
    { href: `/${locale}/gallery`, label: t("gallery") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const HIDE_DOWN_THRESHOLD = 150;
    const MIN_UP_DELTA = 1;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastYRef.current;

      setScrolled(currentY > 50);

      if (currentY > lastY && currentY > HIDE_DOWN_THRESHOLD) {
        setHidden(true);
      } else if (currentY < lastY - MIN_UP_DELTA) {
        setHidden(false);
      }

      lastYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`
          w-full fixed top-0 left-0 z-50
          transition-all duration-700 ease-out
          ${hidden ? "-translate-y-full" : "translate-y-0"}
          ${
            scrolled
              ? "py-2 bg-milk/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-b border-gold/30"
              : "py-4 bg-milk backdrop-blur-sm border-b border-gold/50"
          }
        `}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href={`/${locale}`} className="relative group">
            <img
              src="/logo/logo.jpg"
              alt="Logo"
              className={`
                relative object-cover rounded-full cursor-pointer
                border-2 border-gold
                transition-all duration-500
                ${scrolled ? "w-12 h-12" : "w-16 h-16"}
                hover:border-4 hover:scale-105
              `}
            />
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-10 text-graphite font-sans">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative pb-1 group"
                >
                  <span
                    className={`
                      text-sm uppercase tracking-wider font-medium
                      transition-all duration-300
                      ${
                        active
                          ? "text-gold"
                          : "text-graphite/80 hover:text-gold group-hover:tracking-widest"
                      }
                    `}
                  >
                    {link.label}
                  </span>

                  <span
                    className={`
                      absolute left-0 bottom-0 h-0.5 bg-gold
                      transition-all duration-500
                      ${
                        active
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      }
                    `}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Language + Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gold/40 rounded-lg hover:border-gold hover:bg-gold/5 transition-all duration-300"
              >
                <span className="text-xl font-emoji">{currentLang?.flag}</span>
                <span className="text-sm font-medium">{currentLang?.name}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-milk border border-gold/30 rounded-xl shadow-xl overflow-hidden animate-fadeIn z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLocale(lang.code)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left
                        transition-all duration-200
                        ${
                          lang.code === locale
                            ? "bg-gold/20 text-gold"
                            : "hover:bg-gold/5 text-graphite"
                        }
                      `}
                    >
                      <span className="text-xl font-emoji">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {!session ? (
              <Link
                href={`/${locale}/login`}
                className="px-4 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-milk transition"
              >
                {t("login")}
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gold/40 rounded-lg hover:border-gold hover:bg-gold/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-30 truncate">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-milk border border-gold/30 rounded-xl shadow-xl overflow-hidden animate-fadeIn z-50">
                    <div className="px-4 py-3 border-b border-gold/20">
                      <p className="text-sm font-medium text-graphite truncate">
                        {session.user?.email}
                      </p>
                      <p className="text-xs text-graphite/60 mt-1">
                        {session.user?.role === 'admin' ? t("admin") : t("user")}
                      </p>
                    </div>
                    
                    <Link
                      href={`/${locale}/account`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-graphite hover:bg-gold/5 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">{t("account") || "Мой аккаунт"}</span>
                    </Link>

                    {session.user?.role === 'admin' && (
                      <Link
                        href={`/admin`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-graphite hover:bg-gold/5 transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{t("adminPanel") || "Админ панель"}</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        signOut();
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all duration-200 border-t border-gold/20"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm">{t("logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Burger */}
          <button
            className={`
              md:hidden relative w-12 h-12 flex items-center justify-center
              rounded-full border border-gold/40
              bg-milk
              transition-all duration-300
              hover:border-gold hover:shadow-lg hover:shadow-gold/20
              ${open ? "bg-gold/10 border-gold" : ""}
            `}
            onClick={() => setOpen(!open)}
          >
            <div className="relative w-6 h-5 flex flex-col justify-center gap-1.5">
              <span
                className={`
                  w-full h-0.5 bg-gold rounded-full
                  transition-all duration-300 origin-center
                  ${open ? "rotate-45 translate-y-2" : ""}
                `}
              ></span>
              <span
                className={`
                  w-full h-0.5 bg-gold rounded-full
                  transition-all duration-300
                  ${open ? "opacity-0" : ""}
                `}
              ></span>
              <span
                className={`
                  w-full h-0.5 bg-gold rounded-full
                  transition-all duration-300 origin-center
                  ${open ? "-rotate-45 -translate-y-2" : ""}
                `}
              ></span>
            </div>
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Mobile menu - NOW SCROLLABLE */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 z-50
          bg-milk backdrop-blur-2xl shadow-2xl
          transform transition-all duration-500 ease-out
          border-l border-gold/20
          ${open ? "translate-x-0" : "translate-x-full"}
          md:hidden
          flex flex-col
        `}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Mobile Profile Section */}
          {session && (
            <div className="px-8 pt-8 pb-4 border-b border-gold/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-linear-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-graphite truncate">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-graphite/60">
                    {session.user?.role === 'admin' ? t("admin") : t("user")}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/account`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gold/40 rounded-lg text-sm text-gold hover:bg-gold/10 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t("account") || "Мой аккаунт"}
              </Link>
            </div>
          )}

          <nav className="flex flex-col gap-2 p-8">
            {links.map((link, index) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-6 py-4 rounded-xl transition-all duration-300 group overflow-hidden
                    ${
                      active
                        ? "bg-gold/20 text-gold shadow-lg"
                        : "text-graphite/80 hover:text-gold hover:bg-gold/5"
                    }
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: open ? "slideInRight 0.5s ease-out forwards" : "none",
                  }}
                >
                  <span className="relative text-base font-medium tracking-wide uppercase">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Language Dropdown */}
          <div className="px-8 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-graphite/60 mb-3 font-medium">
              {t("language") || "Language"}
            </h3>
            <div className="relative">
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className={`
                  w-full flex items-center justify-between gap-3 p-4 rounded-xl
                  border-2 transition-all duration-300
                  ${
                    mobileLangOpen
                      ? "bg-gold/10 border-gold shadow-lg shadow-gold/20"
                      : "bg-milk border-gold/30 hover:border-gold/50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-emoji">{currentLang?.flag}</span>
                  <span className="text-sm font-medium text-graphite">
                    {currentLang?.name}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gold transition-transform duration-300 ${
                    mobileLangOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {mobileLangOpen && (
                <div className="mt-2 bg-milk border-2 border-gold/30 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                  {languages
                    .filter((lang) => lang.code !== locale)
                    .map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gold/5 text-graphite transition-all duration-200 border-b border-gold/10 last:border-b-0"
                      >
                        <span className="text-2xl font-emoji">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Auth Button */}
          <div className="px-8 mb-8">
            {!session ? (
              <Link
                href={`/${locale}/login`}
                className="block w-full px-4 py-3 border border-gold text-gold rounded-lg text-center hover:bg-gold hover:text-milk transition"
              >
                {t("login")}
              </Link>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-red-500/40 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t("logout")}
              </button>
            )}
          </div>
        </div>

        {/* Bottom decorative line - Fixed at bottom */}
        <div className="px-8 py-4 border-t border-gold/30">
          <div className="h-px bg-gold/30"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Custom scrollbar for mobile menu */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </>
  );
}
