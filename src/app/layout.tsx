import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteConfig, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title: { default: 'Woodlark — Recon Veneer from Billionply', template: '%s · Woodlark' },
  description: `${siteConfig.tagline}. Italian excellence in hybrid recon veneer, crafted in India for architects, designers and bold homes.`,
  authors: [{ name: 'Woodlark · Billionply' }],
  openGraph: {
    type: 'website',
    siteName: 'Woodlark',
    title: 'Woodlark — Recon Veneer',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  twitter: { card: 'summary_large_image' },
  // Block crawlers during the workers.dev canary window. Flip
  // ROBOTS_NOINDEX=false on the production cutover deploy.
  robots:
    process.env.ROBOTS_NOINDEX === 'true'
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : undefined,
};

export const viewport: Viewport = {
  themeColor: '#1a120c',
};

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display-next',
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans-next',
  display: 'swap',
});

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Woodlark',
  alternateName: 'Woodlark by Billionply',
  url: siteUrl('/'),
  email: siteConfig.email,
  telephone: `+${siteConfig.whatsappNumber}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
    addressLocality: 'Bahadurgarh',
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.pincode,
    addressCountry: 'IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        {/* Platform brand kit — wins last so admin tweaks override base palette */}
        <link rel="stylesheet" href="/brand-kit.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <div className="fixed bottom-5 right-5 z-50">
            <WhatsAppButton
              size="sm"
              label="WhatsApp"
              className="shadow-2xl !bg-whatsapp !border-whatsapp text-white hover:!bg-whatsapp/90"
            />
          </div>
        </div>
      </body>
    </html>
  );
}
