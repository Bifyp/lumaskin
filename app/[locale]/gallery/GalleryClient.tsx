'use client';

import { useState } from 'react';
import Image from 'next/image';
import LazyImage from '../../../components/LazyImage';

type Photo = {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  order: number;
};

export default function GalleryClient({
  images,
  emptyMessage,
  photoLabel,
  brandName,
}: {
  images: Photo[];
  emptyMessage: string;
  photoLabel: string;
  brandName: string;
}) {
  const [activeCategory, setActiveCategory] = useState('');
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  // Собираем уникальные категории из реальных фото
  const categories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean))
  ) as string[];

  const filtered = activeCategory
    ? images.filter((img) => img.category === activeCategory)
    : images;

  return (
    <>
      {/* Фильтры категорий */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-5 py-2 text-sm font-sans uppercase tracking-widest rounded-sm border-2 transition-all duration-200 ${
              !activeCategory
                ? 'bg-gold text-white border-gold'
                : 'border-gold/30 text-graphite/60 hover:border-gold hover:text-graphite'
            }`}
          >
            Всі ({images.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? '' : cat)}
              className={`px-5 py-2 text-sm font-sans uppercase tracking-widest rounded-sm border-2 transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gold text-white border-gold'
                  : 'border-gold/30 text-graphite/60 hover:border-gold hover:text-graphite'
              }`}
            >
              {cat} ({images.filter((img) => img.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* Сетка */}
      {filtered.length === 0 ? (
        <p className="text-center text-graphite/60 col-span-full py-20">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filtered.map((img) => (
            <div
              key={img.id}
              onClick={() => setLightbox(img)}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <LazyImage
                src={img.url}
                alt={img.alt || brandName}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Category badge */}
              {img.category && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-gold/90 backdrop-blur-sm text-white text-xs font-sans uppercase tracking-wider rounded-sm">
                    {img.category}
                  </span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-graphite/80 via-graphite/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-gold/80 uppercase tracking-wider text-xs font-sans mb-2 block">
                    {photoLabel}
                  </span>
                  <h3 className="text-white font-serif text-xl">{img.alt || brandName}</h3>
                </div>
              </div>

              {/* Рамка */}
              <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 pointer-events-none" />

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-6-3v6m-3-3h6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const idx = filtered.findIndex((i) => i.id === lightbox.id);
              setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length]);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl w-full max-h-[85vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.url}
              alt={lightbox.alt || brandName}
              width={1200}
              height={800}
              className="w-full h-full object-contain max-h-[85vh]"
            />
            {lightbox.category && (
              <div className="absolute bottom-0 left-0 right-0 bg-graphite/60 backdrop-blur-sm px-6 py-3">
                <span className="text-gold text-xs uppercase tracking-widest">{lightbox.category}</span>
                {lightbox.alt && <p className="text-white text-sm mt-0.5">{lightbox.alt}</p>}
              </div>
            )}
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const idx = filtered.findIndex((i) => i.id === lightbox.id);
              setLightbox(filtered[(idx + 1) % filtered.length]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs font-sans">
            {filtered.findIndex((i) => i.id === lightbox.id) + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}