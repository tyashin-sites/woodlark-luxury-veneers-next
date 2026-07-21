import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteConfig, siteUrl } from '@/lib/site';
import { getBlogHasPosts } from '@/lib/blog';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title: { default: 'Woodlark — Hybrid Veneer', template: '%s · Woodlark' },
  description: `${siteConfig.tagline}. ${siteConfig.description}`,
  authors: [{ name: 'Woodlark' }],
  openGraph: {
    type: 'website',
    siteName: 'Woodlark',
    title: 'Woodlark — Hybrid Veneer',
    description: `${siteConfig.tagline}. ${siteConfig.description}`,
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
  url: siteUrl('/'),
  // HIDDEN 2026-07-01: email omitted from structured data — inbox isn't monitored right now.
  // email: siteConfig.email,
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // SSR the blog availability once at the root so the header + footer can gate
  // the "Journal" link on whether any posts exist. Cached (revalidate) so this
  // does NOT deopt every page to dynamic rendering.
  const blogHasPosts = await getBlogHasPosts();
  return (
    // PERF: inline the cream base background (#F8F3EB, the resolved value of
    // --background ≈ oklch(0.965 0.012 80)) on <html>/<body> so the theme paints
    // on the first frame — no white-flash filmstrip frames inflating Speed Index.
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      style={{ backgroundColor: '#F8F3EB' }}
    >
      <head>
        {/* Brand kit is NOT linked here — the Tyashin dispatch layer INLINES it
            as a <style> on customer hosts (no render-blocking request). Adding a
            <link href="/brand-kit.css"> would re-introduce a render-blocking
            resource AND suppress the platform inline (which keys off the link's
            absence). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="overflow-x-clip" style={{ backgroundColor: '#F8F3EB' }}>
        <div className="flex min-h-screen flex-col">
          <Header blogHasPosts={blogHasPosts} />
          <main className="flex-1">{children}</main>
          <Footer blogHasPosts={blogHasPosts} />
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
