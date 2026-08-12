import { ProductCard } from '@/components/ProductCard';
import { ProductSearch } from '@/components/ProductSearch';
import { listProducts, listCategories, toView, sortByCode } from '@/lib/api';
import { pageMetadata } from '@/lib/site';

export const revalidate = 60;

// "Hybrid veneer" is the term Woodlark wants to rank for, so it leads the title
// (the highest-weighted on-page signal) and appears once, naturally, in the
// description. Named tones removed: they described the old placeholder set, and
// the catalogue is coded H-1…H-80+, so the copy claimed products that don't exist.
export const metadata = pageMetadata({
  title: 'Hybrid Veneer Collection — 80+ Designs | Woodlark',
  description:
    'Browse the full Woodlark hybrid veneer collection — 80+ designs in 8x4 and 10x4 sheets, engineered to repeat tone and grain consistently at project scale.',
  path: '/collection',
});

export default async function CollectionPage() {
  const [products, categories] = await Promise.all([listProducts({ limit: 100, sortBy: 'name', sortOrder: 'asc' }), listCategories()]);
  const views = sortByCode(products.map((p) => toView(p, categories)));
  return (
    <>
      <section className="container-x pt-24 md:pt-32 pb-12">
        <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-5">The Collection</div>
        <h1 className="font-display text-5xl md:text-7xl text-walnut-deep leading-[0.95] max-w-4xl text-balance">
          {/* The h1 carries the target term ("hybrid veneer") — after the title
              tag it's the strongest on-page ranking signal, and it was previously
              spending that weight on the word "tones", which nobody searches for.
              The count is static by customer directive (2026-08-12): deriving it
              from the product list made it read "74" while 23 designs sat in draft
              awaiting photography, and it would shift publicly on every publish. */}
          80+ hybrid veneer collection.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Woodlark hybrid veneer is engineered to repeat — the same tone, the same grain, sheet
          after sheet. Browse all 80+ hybrid veneer designs below in 8x4 and 10x4, or search by
          product code.
        </p>
        <div className="mt-10">
          <ProductSearch products={views} variant="inline" />
        </div>
      </section>

      <section className="container-x py-16">
        {/* 4-up from lg. The sheets are 1:2 portraits, so a 3-up grid made each
            card tall enough to dominate the viewport; 4-up scales them down and
            lets a browsing specifier compare more tones at a glance. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {views.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
