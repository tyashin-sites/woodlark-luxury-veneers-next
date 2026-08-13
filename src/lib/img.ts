/**
 * Responsive image delivery against Tyashin's optimizing media endpoint.
 *
 * Catalogue images are served from `…/api/v1/public/media/*`, which (when the
 * project has Image Optimization enabled) resizes + re-encodes to AVIF/WebP on
 * the fly from the `?w=`, `?q=`, `?f=` params and the request `Accept`/Save-Data
 * headers. So to ship device-appropriate images we just point `srcSet` at a few
 * `?w=` variants of the SAME URL and let the browser pick.
 *
 * SAFE BY DESIGN: only OUR media URLs are decorated — any external/other URL is
 * returned untouched. If optimization is off, the endpoint ignores the params
 * and serves the original, so images never break.
 */

const CARD_WIDTHS = [300, 450, 600, 800] as const;

function isMediaUrl(url: string): boolean {
  return /\/api\/v1\/public\/media\//.test(url);
}

/** Decorate a media URL with a target width (+ auto format). No-op otherwise. */
export function optimizedSrc(url: string, width: number, quality?: number): string {
  if (!url || !isMediaUrl(url)) return url;
  const [path, q] = url.split('?');
  const params = new URLSearchParams(q || '');
  params.set('w', String(Math.round(width)));
  params.set('f', 'auto');
  if (quality != null) params.set('q', String(quality));
  return `${path}?${params.toString()}`;
}

/** Build a width-descriptor `srcSet`; '' for non-media URLs (so the caller skips it). */
export function imgSrcSet(url: string, widths: readonly number[] = CARD_WIDTHS): string {
  if (!url || !isMediaUrl(url)) return '';
  return widths.map((w) => `${optimizedSrc(url, w)} ${w}w`).join(', ');
}

/**
 * Default `sizes` for a product card. Must track the real grid or the browser
 * picks the wrong srcSet entry: below sm the card is capped at 280px (not full
 * width), sm is 2-up, lg is 4-up.
 */
export const PRODUCT_CARD_SIZES = '(max-width: 640px) 280px, (max-width: 1024px) 50vw, 25vw';

/**
 * Widths for the product-detail hero — it occupies ~7/12 of a wide container,
 * so it needs candidates well past the card set, up to 2x for retina.
 */
export const HERO_WIDTHS = [600, 900, 1200, 1600, 2000] as const;

/** `sizes` for the PDP hero: full width on mobile, ~7/12 of the container above lg. */
export const PRODUCT_HERO_SIZES = '(max-width: 1024px) 100vw, 58vw';

/**
 * Width for a share-card / structured-data image.
 *
 * These URLs are fetched by scrapers (WhatsApp, Slack, Google), NOT by a browser
 * honouring `srcSet` — so an undecorated URL hands them the full-resolution
 * camera original. Most scrapers cap the bytes they'll pull and simply drop the
 * preview when the image is too big, so an un-bounded OG image doesn't just load
 * slowly, it silently stops rendering. 1200px is the standard OG width.
 */
export const SHARE_IMAGE_WIDTH = 1200;

/** Bound an image for share cards / JSON-LD. No-op on non-media URLs. */
export function shareImage(url: string | undefined): string | undefined {
  return url ? optimizedSrc(url, SHARE_IMAGE_WIDTH) : url;
}
