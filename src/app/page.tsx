import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroCarousel } from '@/components/HeroCarousel';
import { USPSection } from '@/components/USPSection';
import { ProductCard } from '@/components/ProductCard';
import { ProductSearch } from '@/components/ProductSearch';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { listProducts, listCategories, toView, sortByCode } from '@/lib/api';
import { siteConfig, siteUrl } from '@/lib/site';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Luxury Hybrid Veneer | Woodlark',
  description:
    // Exactly the customer's brand line — the share card's title is already "Woodlark",
    // so the description carries the line on its own.
    `${siteConfig.tagline}. ${siteConfig.description}`,
  alternates: { canonical: siteUrl('/') },
  openGraph: { url: siteUrl('/'), images: [siteConfig.ogImage] },
};

export default async function HomePage() {
  // RESTORED 2026-08-11: the home page fetches products again — it feeds BOTH the
  // product-code search and the Featured-Collection section below. The limit must cover
  // the WHOLE catalogue (not just the 4 featured cards): ProductSearch filters this list
  // client-side, so anything not fetched here is unfindable by product code.
  const [products, categories] = await Promise.all([
    listProducts({ limit: 100, sortBy: 'name', sortOrder: 'asc' }),
    listCategories(),
  ]);
  const views = sortByCode(products.map((p) => toView(p, categories)));
  const featured = views.slice(0, 4);

  return (
    <>
      <section className="relative isolate min-h-[92vh] flex flex-col justify-end overflow-hidden">
        <HeroCarousel />
        <div className="container-x relative pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="text-[11px] uppercase tracking-[0.4em] text-brass mb-6">
            Hybrid Veneer
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] text-cream max-w-4xl text-balance">
            Embracing Italian excellence,<br />
            <em className="text-brass not-italic font-light">a future of fine veneers.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg text-cream/80 leading-relaxed">
            A legacy of more than 30 years. See what&apos;s beyond the surface — see timeless grains.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            {/* RESTORED 2026-08-11: primary CTA points at /collection again now that the
                products carry real photography. The catalogue keeps a secondary slot —
                it's still the asset specifiers ask for. */}
            <Link
              href="/collection"
              className="inline-flex items-center gap-3 px-7 py-3.5 text-xs uppercase tracking-[0.25em] bg-brass text-walnut-deep hover:bg-cream transition-colors"
            >
              Explore the Collection →
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-3 px-7 py-3.5 text-xs uppercase tracking-[0.25em] border border-cream/40 text-cream hover:bg-cream hover:text-walnut-deep transition-colors"
            >
              View the Catalogue
            </Link>
            <WhatsAppButton label="Enquire on WhatsApp" variant="ghost" />
          </div>
        </div>
      </section>

      {/* RESTORED 2026-08-11: product-code search is back on the home page. */}
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

      {/* RESTORED 2026-08-11: Featured-Collection section is back — real product
          photography landed. */}
      <section className="container-x py-24 md:py-32 border-t border-border">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-3">The Collection</div>
            {/* Count-agnostic on purpose — the catalogue grows; a hardcoded number goes stale. */}
            <h2 className="font-display text-4xl md:text-5xl text-walnut-deep">Many tones. One language.</h2>
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
