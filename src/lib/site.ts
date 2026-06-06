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
  nav: [
    { label: 'Collection', href: '/collection' },
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
