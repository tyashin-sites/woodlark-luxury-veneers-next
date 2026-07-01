// Single source of truth for the customer's site identity.
// `domain` is the only field that needs to change if the customer's domain is
// not actually woodlarkveneer.com — every page that emits canonicals, OG URLs, or
// JSON-LD reads from here.
import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Woodlark',
  tagline: 'Hybrid Veneer, made for the bold',
  description:
    'Embracing Italian excellence, crafted for the bold. Discover the collection that redefines performance and style.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'woodlarkveneer.com',
  whatsappNumber: '918287903410',
  whatsappDisplay: '+91 82879 03410',
  email: 'sales@woodlarkveneer.com',
  address: {
    company: 'Woodlark',
    line1: '32 KM Milestone, Delhi–Rohtak Road',
    line2: 'Village Rohad, Bahadurgarh',
    district: 'Jhajjar',
    state: 'Haryana',
    pincode: '124507',
  },
  ogImage: '/images/og-default.jpg',
  // The catalogue PDF surfaced on /catalog. Host the (web-compressed) PDF either as a
  // static asset in `public/` (e.g. '/woodlark-hybrid-catalogue.pdf') or as an R2/media
  // URL, then set `url` + `sizeLabel`. While `url` is empty, /catalog shows a tasteful
  // "request the catalogue on WhatsApp" fallback instead of a broken embed.
  catalogue: {
    // Self-hosted static asset in public/. Source was a 343 MB / 78-page Canva PDF,
    // downsampled to ~120 dpi (ghostscript) → 15 MB so it fits Cloudflare's 25 MiB
    // static-asset cap and downloads fast. Re-compress + replace the file to update.
    url: '/woodlark-hybrid-catalogue.pdf',
    sizeLabel: '15 MB', // shown on the download button
    edition: 'Hybrid Veneer · 2025 Edition',
  },
  nav: [
    // --- HIDDEN 2026-06-30: the "Collection" link is hidden site-wide (Header AND Footer
    //     both map over siteConfig.nav) until the customer provides real product photography.
    //     TO RESTORE: uncomment the Collection entry below (and drop the Catalog entry if it's
    //     no longer wanted). This pairs with the hidden Featured-Collection section and the
    //     repointed hero CTA in src/app/page.tsx. Grep the repo for "HIDDEN 2026-06-30". ---
    // { label: 'Collection', href: '/collection' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'Our Story', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function siteUrl(path = '/') {
  const base = `https://www.${siteConfig.domain}`;
  return path === '/' ? base : `${base}${path}`;
}

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Build a complete per-page Metadata object — canonical + absolute Open Graph
 * + Twitter Card — so no inner page falls back to the layout's generic OG.
 * (schema.org JSON-LD is injected by the Tyashin platform edge; not here.)
 */
export function pageMetadata(opts: {
  title?: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = siteUrl(opts.path);
  const image = opts.image || siteConfig.ogImage;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type || 'website',
      url,
      siteName: siteConfig.name,
      title: opts.title || siteConfig.name,
      description: opts.description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title || siteConfig.name,
      description: opts.description,
      images: [image],
    },
  };
}
