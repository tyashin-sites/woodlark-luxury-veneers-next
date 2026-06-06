import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCarousel } from '@/components/HeroCarousel';
import { USPSection } from '@/components/USPSection';
import { ProductCard } from '@/components/ProductCard';
import { ProductSearch } from '@/components/ProductSearch';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { listProducts, listCategories, toView } from '@/lib/api';
import { siteConfig, siteUrl } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Luxury Hybrid Veneer | Woodlark, Delhi',
  description:
    'Woodlark hybrid veneer — Italian excellence, consistent at project scale, crafted for bold modern interiors.',
  alternates: { canonical: siteUrl('/') },
  openGraph: { url: siteUrl('/'), images: [siteConfig.ogImage] },
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([listProducts({ limit: 24 }), listCategories()]);
  const views = products.map((p) => toView(p, categories));
  const featured = views.slice(0, 4);

  return (
    <>
      <section className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden">
        <HeroCarousel />
        <div className="container-x relative pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="text-[11px] uppercase tracking-[0.4em] text-brass mb-6">
            Hybrid Veneer
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] text-cream max-w-4xl text-balance">
            Embracing Italian excellence,<br />
            <em className="text-brass not-italic font-light">crafted for the bold.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg text-cream/80 leading-relaxed">
            Discover the {siteConfig.name} collection — hybrid veneer that redefines performance and style, sheet after consistent sheet.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/collection"
              className="inline-flex items-center gap-3 px-7 py-3.5 text-xs uppercase tracking-[0.25em] bg-brass text-walnut-deep hover:bg-cream transition-colors"
            >
              Explore the Collection →
            </Link>
            <WhatsAppButton label="Enquire on WhatsApp" variant="ghost" />
          </div>
        </div>
      </section>

      <section className="container-x py-16 border-t border-border">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-3">Find your design</div>
            <h2 className="font-display text-3xl md:text-4xl text-walnut-deep">
              Have a product code? Jump straight to the sheet.
            </h2>
          </div>
          <div className="md:col-span-7 flex justify-start md:justify-end">
            <ProductSearch products={views} variant="inline" />
          </div>
        </div>
      </section>

      <USPSection />

      <section className="container-x py-24 md:py-32 border-t border-border">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-3">The Collection</div>
            <h2 className="font-display text-4xl md:text-5xl text-walnut-deep">Eight tones. One language.</h2>
          </div>
          <Link
            href="/collection"
            className="text-xs uppercase tracking-[0.25em] text-walnut-deep border-b border-walnut-deep pb-1 hover:text-brass hover:border-brass transition-colors"
          >
            View full collection →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-walnut-deep text-cream">
        <div className="container-x py-24 md:py-32 text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-brass mb-5">Specifying for a project?</div>
          <h2 className="font-display text-4xl md:text-6xl text-balance max-w-3xl mx-auto leading-[1.05]">
            Get samples, technical sheets and project pricing on WhatsApp.
          </h2>
          <p className="mt-6 text-cream/70 max-w-xl mx-auto">
            Talk to the Woodlark team directly. Same-day response, six days a week.
          </p>
          <div className="mt-10 flex justify-center">
            <WhatsAppButton size="lg" label={`Chat — ${siteConfig.whatsappDisplay}`} variant="ghost" />
          </div>
        </div>
      </section>
    </>
  );
}
