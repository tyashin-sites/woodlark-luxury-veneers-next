// Single source of truth for the customer's site identity.
// `domain` is the only field that needs to change if the customer's domain is
// not actually woodlarkveneer.com — every page that emits canonicals, OG URLs, or
// JSON-LD reads from here.
import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Woodlark',
  // Brand line, per the customer (2026-07-03). `${tagline}. ${description}` composes the
  // human-facing one-liner shown in the footer:
  //   "Embracing Italian excellence. A Legacy of More Than 30 Years. A Future of Fine Veneers."
  tagline: 'Embracing Italian excellence',
  description: 'A Legacy of More Than 30 Years. A Future of Fine Veneers.',
  // Search/meta one-liner — distinct from the brand line above. The brand line reads
  // beautifully but is un-searchable; buyers of decorative wood veneer look for "wood
  // veneer", "decorative veneer sheets", and use-cases (wall panelling, cabinetry,
  // furniture), NOT "hybrid veneer" on its own (which surfaces dental results). This
  // line anchors those terms for titles/descriptions/OG. See also the h1s on each page.
  seoDescription:
    'Woodlark makes luxury hybrid wood veneer — decorative veneer sheets with the grain of real wood, engineered to repeat across wall panelling, cabinetry and furniture. Italian design, over 30 years, in 8×4 and 10×4.',
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
  // The catalogue PDF surfaced on /catalogue — used for BOTH the download link and the inline
  // viewer (both read this single `url`). Host as a static asset in `public/`. When replacing
  // the catalogue, give the file a NEW name (bump the year/version) so the URL changes and
  // visitors' browsers can't serve a stale cached copy of the old PDF.
  catalogue: {
    // Self-hosted static asset in public/. Source = the 97-page "8x4/10x4 sheet photos"
    // PDF (69 MB), downsampled via ghostscript to ~17 MB (fits Cloudflare's 25 MiB
    // static-asset cap and downloads fast).
    url: '/woodlark-catalogue-2026.pdf',
    sizeLabel: '', // size intentionally hidden on the /catalogue download button
    edition: 'Hybrid Veneer · 2026 Edition',
  },
  nav: [
    // RESTORED 2026-08-11: real product photography landed, so "Collection" is linked
    // site-wide again (Header AND Footer both map over this list).
    //
    // Spelling: British/Indian English throughout ("catalogue"), including the
    // route. Keep it that way — the audience is Indian specifiers.
    //
    // `/catalogue` is now the interactive experience-catalogue — a self-contained
    // static bundle in public/catalogue, NOT a Next route. It must be reached by a
    // full-page navigation (`external: true` → a plain <a>), because a client-side
    // next/link would look for an app route that no longer exists and 404. The
    // trailing slash targets the bundle's index.html directly. (The old PDF page
    // now lives, unlinked, at /legacy-catalog.)
    { label: 'Collection', href: '/collection' },
    { label: 'Catalogue', href: '/catalogue/', external: true },
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
