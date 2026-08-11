'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { ProductView } from '@/lib/types';

interface Props {
  products: ProductView[];
  variant?: 'hero' | 'inline';
  placeholder?: string;
}

export function ProductSearch({
  products,
  variant = 'inline',
  // Woodlark codes are H-prefixed (H-1, H-35A, …) — the example must match a real SKU
  // or the search reads as broken to anyone who types what the placeholder shows.
  placeholder = 'Search by product code (e.g. H-12) or name',
}: Props) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return products
      .filter(
        (p) =>
          p.sku.toLowerCase().includes(needle) ||
          p.name.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.toLowerCase().includes(needle)),
      )
      .slice(0, 5);
  }, [q, products]);

  const isHero = variant === 'hero';
  return (
    <div className="relative w-full max-w-xl">
      <div
        className={`flex items-center gap-3 px-5 py-4 border ${
          isHero ? 'bg-cream/95 border-cream/30' : 'bg-card border-border'
        }`}
      >
        <Search size={16} className="text-walnut-deep/60" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-walnut-deep placeholder:text-walnut-deep/40"
          aria-label="Search products"
        />
        {q && (
          <button onClick={() => setQ('')} className="text-xs text-walnut-deep/50 hover:text-walnut-deep">
            Clear
          </button>
        )}
      </div>
      {q && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-cream border border-border shadow-2xl z-30">
          {results.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">No designs match &ldquo;{q}&rdquo;.</div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={() => setQ('')}
                    className="flex items-center gap-4 p-3 hover:bg-secondary/60 transition-colors"
                  >
                    <img src={p.image} alt="" width={64} height={64} loading="lazy" className="w-14 h-14 object-cover" />
                    <div className="flex-1 min-w-0">
                      {p.sku && <div className="text-[10px] uppercase tracking-[0.2em] text-brass">{p.sku}</div>}
                      <div className="font-display text-lg leading-tight text-walnut-deep">{p.name}</div>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-walnut-deep/60">View →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
