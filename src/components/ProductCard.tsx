import Link from 'next/link';
import { optimizedSrc, imgSrcSet, PRODUCT_CARD_SIZES } from '@/lib/img';
import type { ProductView } from '@/lib/types';

export function ProductCard({ product }: { product: ProductView }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* The sheet photos are ~1:1.95 portraits with the Woodlark code sticker
          printed in the top-right corner. A 4:5 box with object-cover showed only
          the middle 64% of the height and threw the sticker away, so the box now
          matches the photo and uses object-contain: the full frame is shown,
          nothing is cropped. Aspect varies slightly across the shoot (1.74–2.03),
          hence contain rather than cover — a few sheets letterbox by a hair
          instead of losing their edges. */}
      <div className="relative overflow-hidden bg-muted aspect-[1/2]">
        <img
          src={optimizedSrc(product.image, 600)}
          srcSet={imgSrcSet(product.image) || undefined}
          sizes={PRODUCT_CARD_SIZES}
          alt={product.imageAlt}
          width={800}
          height={1600}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-105"
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
