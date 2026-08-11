import { ProductCard } from '@/components/ProductCard';
import { ProductSearch } from '@/components/ProductSearch';
import { listProducts, listCategories, toView, sortByCode } from '@/lib/api';
import { pageMetadata } from '@/lib/site';

export const revalidate = 60;

export const metadata = pageMetadata({
  title: 'The Collection — Woodlark Hybrid Veneer',
  description:
    'Browse the full Woodlark hybrid veneer collection — curated tones from Bleached Ash to Fumed Eucalyptus, engineered for consistency at project scale.',
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
          {views.length === 8 ? 'Eight tones, one design language.' : `${views.length} tones, one design language.`}
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Every Woodlark sheet is engineered to repeat — the same tone, the same grain, every time. Browse the collection below, or search by product code.
        </p>
        <div className="mt-10">
          <ProductSearch products={views} variant="inline" />
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {views.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
