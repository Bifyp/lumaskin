import React from 'react';

const links = [
  { href: 'https://www.instagram.com/lumaskin_laser_studio', label: 'Instagram', emoji: '📸' },
  { href: 'https://booksy.com/pl-pl/307205_lumaskin-laser-studio_depilacja_16974_swarzedz#ba_s=seo', label: 'Booksy', emoji: '💆‍♀️' },
  { href: 'https://www.facebook.com/share/1DGrdC9RvF/', label: 'Facebook', emoji: '📘' },
];

export default function SocialButtons() {
  const open = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <div className="flex gap-6 justify-center items-center flex-wrap">
      {links.map(l => (
        <button
          key={l.label}
          type="button"
          onClick={() => open(l.href)}
          aria-label={l.label}
          className="group flex items-center gap-3 px-8 py-4 border-2 border-gold text-gold font-sans uppercase tracking-widest text-sm rounded-sm transition-all duration-300 hover:bg-gold hover:text-white hover:-translate-y-1"
        >
          <span className="text-2xl">{l.emoji}</span>
          {l.label}
        </button>
      ))}
    </div>
  );
}