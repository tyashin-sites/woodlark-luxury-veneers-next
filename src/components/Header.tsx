'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export function Header({ blogHasPosts = false }: { blogHasPosts?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container-x flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)} aria-label="Woodlark home">
          <img
            src="/images/woodlark-logo.jpg"
            alt="Woodlark"
            width={140}
            height={140}
            className="h-12 md:h-14 w-auto mix-blend-multiply"
          />
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.3em] text-muted-foreground border-l border-border pl-3">
            Hybrid Veneer
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs uppercase tracking-[0.25em] transition-colors ${
                isActive(item.href) ? 'text-brass' : 'text-walnut-deep/80 hover:text-brass'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* Full-document <a> so /blog is always a fresh SSR load. Gated on
              published posts (resolved server-side in the root layout). */}
          {blogHasPosts && (
            <a
              href="/blog"
              className={`text-xs uppercase tracking-[0.25em] transition-colors ${
                isActive('/blog') ? 'text-brass' : 'text-walnut-deep/80 hover:text-brass'
              }`}
            >
              Journal
            </a>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 text-walnut-deep"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container-x flex flex-col py-6 gap-5">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.25em] text-walnut-deep"
              >
                {item.label}
              </Link>
            ))}
            {blogHasPosts && (
              <a
                href="/blog"
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.25em] text-walnut-deep"
              >
                Journal
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
