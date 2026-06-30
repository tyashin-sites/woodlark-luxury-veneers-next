import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getProductBySlug, listProducts, listCategories, toView } from '@/lib/api';
import { siteConfig, siteUrl, pageMetadata } from '@/lib/site';

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const img = p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url;
  const title = `${p.name}${p.sku ? ` (${p.sku})` : ''} — Woodlark Veneer`;
  const description = p.shortDescription ?? p.description.slice(0, 160);
  // Adds Twitter Card alongside canonical + OG. Product+Offer JSON-LD is
  // injected by the Tyashin platform edge.
  return pageMetadata({ title, description, path: `/products/${p.slug}`, image: img });
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, categories, all] = await Promise.all([
    getProductBySlug(slug),
    listCategories(),
    listProducts({ limit: 24 }),
  ]);
  if (!product) notFound();

  const view = toView(product, categories);
  const related = all
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3)
    .map((p) => toView(p, categories));

  const enquiryMsg = `Hello Woodlark, I'd like more information about ${view.name}${view.sku ? ` (${view.sku})` : ''}.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: view.name,
    sku: view.sku,
    image: view.image,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Woodlark' },
    category: view.category,
    offers: view.price
      ? {
          '@type': 'Offer',
          priceCurrency: view.price.currency,
          price: String(view.price.amount),
          availability: 'https://schema.org/InStock',
          url: siteUrl(`/products/${view.slug}`),
        }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-x pt-8 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        <Link href="/" className="hover:text-walnut-deep">Home</Link>
        <span className="mx-2">·</span>
        <Link href="/collection" className="hover:text-walnut-deep">Collection</Link>
        <span className="mx-2">·</span>
        <span className="text-walnut-deep">{view.name}</span>
      </div>

      <section className="container-x py-12 md:py-16 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-7">
          <div className="relative bg-muted aspect-[4/5] overflow-hidden">
            <img
              src={view.image}
              alt={view.imageAlt}
              width={1200}
              height={1500}
              className="w-full h-full object-cover"
            />
            {view.sku && (
              <div className="absolute top-4 left-4 bg-cream text-walnut-deep text-[10px] uppercase tracking-[0.25em] px-3 py-1.5">
                Code · {view.sku}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          {view.category && (
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-3">{view.category}</div>
          )}
          <h1 className="font-display text-5xl md:text-6xl text-walnut-deep leading-[0.95]">{view.name}</h1>
          {view.shortDescription && (
            <p className="mt-6 text-lg text-walnut-deep/80 italic font-display">{view.shortDescription}</p>
          )}
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>

          <div className="mt-10 p-6 border border-walnut-deep/15 bg-card">
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-2">Interested in this design?</div>
            <p className="text-sm text-muted-foreground mb-5">
              Request samples, technical specifications and project pricing directly on WhatsApp.
            </p>
            <WhatsAppButton
              size="lg"
              label={view.sku ? `Enquire about ${view.sku}` : 'Enquire on WhatsApp'}
              message={enquiryMsg}
              variant="primary"
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-xs">
            {view.sku && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-brass mb-1">Product Code</div>
                <div className="font-mono text-walnut-deep">{view.sku}</div>
              </div>
            )}
            {view.category && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-brass mb-1">Tone</div>
                <div className="text-walnut-deep">{view.category}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-20 border-t border-border">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <h2 className="font-display text-3xl md:text-4xl text-walnut-deep">You may also like</h2>
            <Link
              href="/collection"
              className="text-xs uppercase tracking-[0.25em] border-b border-walnut-deep pb-1 hover:text-brass hover:border-brass"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <noscript />
      {/* siteConfig referenced to keep `siteConfig` import meaningful even if unused in display */}
      <span hidden>{siteConfig.name}</span>
    </>
  );
}
