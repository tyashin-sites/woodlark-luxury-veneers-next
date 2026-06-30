// Single source of truth for the customer's site identity.
// `domain` is the only field that needs to change if the customer's domain is
// not actually woodlarkveneer.com — every page that emits canonicals, OG URLs, or
// JSON-LD reads from here.
export const siteConfig = {
  name: 'Woodlark',
  tagline: 'Hybrid Veneer, made for the bold',
  description:
    'Embracing Italian excellence, crafted for the bold. Discover the collection that redefines performance and style.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'woodlarkveneer.com',
  whatsappNumber: '919138880121',
  whatsappDisplay: '+91 91388 80121',
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
    url: '', // TODO: set once the compressed catalogue PDF is hosted (see /catalog page)
    sizeLabel: '', // e.g. '24 MB' — shown on the download button
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
