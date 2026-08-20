import { ProductCard } from '@/components/ProductCard';
import { ProductSearch } from '@/components/ProductSearch';
import { listProducts, listCategories, toView, sortByCode } from '@/lib/api';
import { pageMetadata } from '@/lib/site';

export const revalidate = 60;

// SEO: buyers of decorative wood veneer search for "wood veneer", "designer/
// decorative veneer" and use-cases (wall panelling, cabinetry, furniture) — not
// "hybrid veneer" alone, which surfaces dental results. So the title leads with
// "Designer Wood Veneer" and the description carries the use-cases. No product
// count in the copy: it read "74" while 23 designs sat in draft, and would shift
// publicly on every publish (customer directive, 2026-08-12).
export const metadata = pageMetadata({
  // The root layout applies `template: '%s · Woodlark'`, so the brand is
  // appended automatically — repeating it here produced "… | Woodlark · Woodlark".
  title: 'Designer Wood Veneer Collection',
  description:
    'Explore the Woodlark hybrid wood veneer collection — decorative veneer sheets for wall panelling, cabinetry and furniture, engineered to repeat tone and grain at project scale, in 8×4 and 10×4.',
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
          {/* The h1 is the strongest on-page ranking signal after the title, so it
              carries the searchable term ("wood veneer") and Woodlark's core promise
              (consistency), rather than a product count that shifts on every publish. */}
          Designer wood veneer, engineered to repeat.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          The depth and grain of real wood, reproduced with total consistency — the same tone,
          the same figure, sheet after sheet. Decorative veneer for wall panelling, cabinetry and
          fine furniture, in 8×4 and 10×4. Search by product code or browse the collection below.
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
