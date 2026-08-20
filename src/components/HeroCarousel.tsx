'use client';

import { useEffect, useState } from 'react';

// Woodlark hybrid veneer shown applied in real interiors. No finish labels on
// the hero by request — the images carry the story; product codes live in the
// collection and search, not over lifestyle photography.
const slides = [
  { src: '/images/hero-1.jpg', alt: 'Woodlark hybrid veneer on a living-room media wall' },
  { src: '/images/hero-2.jpg', alt: 'Woodlark hybrid veneer kitchen cabinetry in warm light' },
  { src: '/images/hero-3.jpg', alt: 'Woodlark hybrid veneer kitchen beside a garden of olive trees' },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-walnut-deep">
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          width={1920}
          height={1080}
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : 'auto'}
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1800ms] ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-walnut-deep/70 via-walnut-deep/40 to-walnut-deep/85" />
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-center gap-3 z-10">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-[2px] transition-all ${i === index ? 'w-10 bg-brass' : 'w-5 bg-cream/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
