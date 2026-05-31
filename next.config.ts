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
    NEXT_PUBLIC_SITE_DOMAIN: process.env.SITE_DOMAIN || 'woodlark.com',
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
