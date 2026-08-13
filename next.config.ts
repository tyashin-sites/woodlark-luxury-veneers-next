import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();

const PROJECT_SLUG = 'varun-website-mpu8jd7d';
const SITES_HOST = `https://${PROJECT_SLUG}.sites.tyashin.com`;

const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https' as const, hostname: '**' }] },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_TYASHIN_API_KEY: process.env.TYASHIN_API_KEY || '',
    NEXT_PUBLIC_TYASHIN_API_URL: process.env.TYASHIN_API_URL || 'https://website-api.tyashin.com',
    NEXT_PUBLIC_TYASHIN_STOREFRONT_URL:
      process.env.TYASHIN_STOREFRONT_URL ||
      'https://website-api.tyashin.com/api/v1/public/ecommerce',
    NEXT_PUBLIC_PROJECT_ID: process.env.PROJECT_ID || '6a1c9aa66933b758bf066427',
    NEXT_PUBLIC_SITE_DOMAIN: process.env.SITE_DOMAIN || 'woodlarkveneer.com',
  },
  /**
   * The catalogue page moved from the US spelling `/catalog` to `/catalogue`
   * (2026-08-12) so the whole site reads in British/Indian English.
   *
   * This redirect is NOT optional cleanup. `/catalog` shipped in the sitemap on
   * 2026-08-06, so Google knows it; the "View the Catalogue" CTA has been live
   * since June; and it's the URL Woodlark hands out when someone asks for the
   * PDF. A 301 moves that accumulated authority to the new path instead of
   * dropping it, and stops every existing link 404-ing.
   *
   * Permanent, so browsers and crawlers cache it and stop asking.
   */
  async redirects() {
    return [{ source: '/catalog', destination: '/catalogue', permanent: true }];
  },

  /**
   * The flipbook pilot lives at /experience-catalog as an unlinked internal
   * preview (a static bundle under public/experience-catalog/). It must stay
   * out of the index: the bundle already ships a `noindex` <meta>, but OpenNext
   * serves these paths through the Worker and re-emits the <head>, dropping it.
   * An `X-Robots-Tag` response header is served by that same Worker, applies to
   * every response under the path (HTML and assets alike), and cannot be missed
   * by a crawler — the belt-and-braces this site's history warrants. Scoped to
   * the one prefix, so no other route is affected.
   */
  async headers() {
    return [
      {
        source: '/experience-catalog/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },

  // Rewrites only fire on direct *.workers.dev access — in production the
  // Tyashin dispatch intercepts these paths before the Worker is invoked.
  async rewrites() {
    return [
      { source: '/brand-kit.css', destination: `${SITES_HOST}/brand-kit.css` },
      { source: '/tyashin-runtime.js', destination: `${SITES_HOST}/tyashin-runtime.js` },
      { source: '/sitemap.xml', destination: `${SITES_HOST}/sitemap.xml` },
      // /robots.txt served locally during canary (ROBOTS_NOINDEX controls it).
    ];
  },
};

export default nextConfig;
