import type { Metadata } from 'next';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Our Story — Woodlark by Billionply',
  description:
    'Born in Delhi, inspired by Italy. Woodlark brings hybrid recon veneer engineered for consistency, scale and the boldest modern interiors.',
  alternates: { canonical: siteUrl('/about') },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <img src="/images/hero-3.jpg" alt="" width={1920} height={1280} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-walnut-deep via-walnut-deep/50 to-transparent" />
        <div className="container-x relative pb-16 text-cream">
          <div className="text-[10px] uppercase tracking-[0.4em] text-brass mb-4">Our Story</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-3xl leading-[0.95] text-balance">
            Born in Delhi.<br />Inspired by Italy.
          </h1>
        </div>
      </section>

      <section className="container-x py-24 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">The House of Billionply</div>
          <h2 className="font-display text-4xl text-walnut-deep leading-tight text-balance">
            Three decades of plywood. One uncompromising new standard for veneer.
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Woodlark is the design-led recon veneer line from <span className="text-walnut-deep">Billionply</span> — Jai Shiv Plywood Pvt Ltd, manufacturing on the Delhi–Rohtak corridor for over a generation.
          </p>
          <p>
            We launched Woodlark because Indian architects and designers were asking for something natural veneer could not deliver: the same sheet, on the same wall, across a hundred-room hotel, or a thirty-flat residential tower. Repeatable. Predictable. Beautiful.
          </p>
          <p>
            Our hybrid recon process — refined against Italian standards of consistency and finish — gives you a palette of curated tones that look, feel and specify like luxury hardwood, but behave like a modern engineered material.
          </p>
          <p className="text-walnut-deep font-display text-xl italic">
            Built for bold interiors. Engineered for projects of any scale.
          </p>
        </div>
      </section>

      <section className="bg-walnut-deep text-cream py-24">
        <div className="container-x grid md:grid-cols-3 gap-12 text-center md:text-left">
          {[
            { k: '30+', v: 'Years of manufacturing heritage as Billionply' },
            { k: '08', v: 'Curated recon veneer tones in the Woodlark collection' },
            { k: '100%', v: 'Sheet-to-sheet consistency, guaranteed by specification' },
          ].map((s) => (
            <div key={s.k}>
              <div className="font-display text-6xl text-brass">{s.k}</div>
              <div className="mt-4 text-cream/70 text-sm leading-relaxed">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-walnut-deep max-w-2xl mx-auto text-balance">
          Specifying Woodlark for your next project?
        </h2>
        <div className="mt-10 flex justify-center">
          <WhatsAppButton size="lg" />
        </div>
      </section>
    </>
  );
}
