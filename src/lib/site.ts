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
  // Secondary "for any queries" line (Varun), shown alongside the primary number on the
  // contact page. Deliberately NOT wired into the site-wide WhatsApp CTAs — those stay on
  // the primary number above.
  queriesPhone: '919138880121',
  queriesPhoneDisplay: '+91 91388 80121',
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
  // The catalogue PDF surfaced on /catalog — used for BOTH the download link and the inline
  // viewer (both read this single `url`). Host as a static asset in `public/`. When replacing
  // the catalogue, give the file a NEW name (bump the year/version) so the URL changes and
  // visitors' browsers can't serve a stale cached copy of the old PDF.
  catalogue: {
    // Self-hosted static asset in public/. Source = the 97-page "8x4/10x4 sheet photos"
    // PDF (69 MB), downsampled via ghostscript to ~17 MB (fits Cloudflare's 25 MiB
    // static-asset cap and downloads fast).
    url: '/woodlark-catalogue-2026.pdf',
    sizeLabel: '', // size intentionally hidden on the /catalog download button
    edition: 'Hybrid Veneer · 2026 Edition',
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
