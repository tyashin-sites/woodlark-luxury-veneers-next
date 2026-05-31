import Link from 'next/link';
import type { ProductView } from '@/lib/types';

export function ProductCard({ product }: { product: ProductView }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-muted aspect-[4/5]">
        <img
          src={product.image}
          alt={product.imageAlt}
          width={800}
          height={1000}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        {product.sku && (
          <div className="absolute top-3 left-3 bg-cream/90 text-walnut-deep text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
            {product.sku}
          </div>
        )}
      </div>
      <div className="pt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-walnut-deep leading-none">{product.name}</h3>
          {product.category && (
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1.5">
              {product.category}
            </div>
          )}
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-brass group-hover:translate-x-1 transition-transform">
          View →
        </span>
      </div>
    </Link>
  );
}
