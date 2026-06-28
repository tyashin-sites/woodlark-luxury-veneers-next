// Blog data helpers — site-native /blog rendered in Woodlark's own chrome.
//
// WHY CROSS-ORIGIN (and not the same-origin /_tyashin/blog/* endpoint):
// In production this site is a Cloudflare-dispatched per-project Worker. A
// Worker fetching its OWN hostname re-enters the platform dispatch Worker and
// 500s (CF dispatch self-fetch limitation). So we fetch the platform's PUBLIC
// blog API on its OWN, separate host (`https://website-api.tyashin.com`)
// cross-origin. This is a SERVER-SIDE fetch — the `Cross-Origin-Resource-Policy`
// on that host (which blocks browser asset loads like /brand-kit.css) does NOT
// apply to server-to-server fetches.
//
// WHY SERVER-ONLY KEY: every function here reads the project's API key from
// `process.env.TYASHIN_API_KEY` — the runtime Worker secret (set post-deploy by
// the canonical deploy workflow) / build-time env. It is NOT the NEXT_PUBLIC_*
// key, so it never enters the client bundle. This module is imported only by
// Server Components (the /blog routes + the root layout); the client Header /
// Footer receive `hasPosts` as a prop and never see the key.

const DEFAULT_API_BASE = 'https://website-api.tyashin.com';
const LIST_LIMIT = 9;

/** Server-only: API base + key from the Worker runtime / build env. */
function resolveEnv(): { key: string; base: string } {
  const base = (process.env.TYASHIN_API_URL || DEFAULT_API_BASE).replace(/\/+$/, '');
  // Server-only key. Never read NEXT_PUBLIC_* here — that would be a client leak.
  const key = process.env.TYASHIN_API_KEY || '';
  return { key, base };
}

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  authorName?: string;
  tags: string[];
  pinned: boolean;
  readTime?: number;
  publishedAt: string;
};

export type BlogListResponse = {
  active: boolean;
  posts: BlogListItem[];
  total: number;
  page: number;
  totalPages: number;
};

export type BlogPostFull = {
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  authorName?: string;
  tags: string[];
  pinned: boolean;
  readTime?: number;
  publishedAt: string;
  updatedAt?: string;
  content: string; // trusted, platform-authored HTML
  contentFormat?: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
};

type PublicPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  contentFormat?: string;
  featuredImage?: string;
  authorName?: string;
  tags?: string[];
  pinned?: boolean;
  readTime?: number;
  seo?: BlogPostFull['seo'];
  publishedAt: string;
  updatedAt?: string;
};

type PublicListEnvelope = {
  success?: boolean;
  data?: PublicPost[];
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number };
};

type PublicPostEnvelope = { success?: boolean; data?: PublicPost | null };

function mapListItem(p: PublicPost): BlogListItem {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    featuredImage: p.featuredImage,
    authorName: p.authorName,
    tags: Array.isArray(p.tags) ? p.tags : [],
    pinned: Boolean(p.pinned),
    readTime: p.readTime,
    publishedAt: p.publishedAt,
  };
}

function mapPostFull(p: PublicPost): BlogPostFull {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    featuredImage: p.featuredImage,
    authorName: p.authorName,
    tags: Array.isArray(p.tags) ? p.tags : [],
    pinned: Boolean(p.pinned),
    readTime: p.readTime,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    content: p.content,
    contentFormat: p.contentFormat,
    seo: p.seo,
  };
}

async function fetchPublicJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  const { key, base } = resolveEnv();
  if (!key) return null;
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'X-API-Key': key, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Blog API ${res.status} for ${path}`);
  return (await res.json()) as T;
}

/**
 * A page of posts from the platform's public API. Posts come back already
 * pinned/featured-first then newest (the backend sorts). Fails closed: any
 * error yields an empty/inactive list so the route renders notFound, not a 500.
 * Paired with `force-dynamic` on the route, so `no-store` keeps it fresh.
 */
export async function listPosts(page = 1): Promise<BlogListResponse> {
  const p = page > 0 ? Math.floor(page) : 1;
  const empty: BlogListResponse = { active: false, posts: [], total: 0, page: p, totalPages: 0 };
  try {
    const json = await fetchPublicJson<PublicListEnvelope>(
      `/api/v1/public/blog/posts?page=${p}&limit=${LIST_LIMIT}`,
      { cache: 'no-store' }
    );
    if (!json) return empty;
    const posts = Array.isArray(json.data) ? json.data.map(mapListItem) : [];
    const total = json.meta?.total ?? 0;
    const totalPages = json.meta?.totalPages ?? (total > 0 ? 1 : 0);
    return { active: total > 0, posts, total, page: json.meta?.page ?? p, totalPages };
  } catch {
    return empty;
  }
}

/** A single post by slug. Returns null (route → notFound) on miss/empty/error. */
export async function getPost(slug: string): Promise<BlogPostFull | null> {
  try {
    const json = await fetchPublicJson<PublicPostEnvelope>(
      `/api/v1/public/blog/posts/${encodeURIComponent(slug)}`,
      { cache: 'no-store' }
    );
    if (!json || !json.data) return null;
    return mapPostFull(json.data);
  } catch {
    return null;
  }
}

/**
 * Does the blog have any published posts? Drives the header/footer "Blog" nav
 * gate. Fetched in the root layout (which wraps every page), so it uses a short
 * `revalidate` rather than `no-store` — that keeps the rest of the site static/
 * ISR instead of deopting every page to dynamic. The nav link appears within
 * the revalidate window of the first post. Fails closed to "no blog".
 */
export async function getBlogHasPosts(): Promise<boolean> {
  try {
    const json = await fetchPublicJson<PublicListEnvelope>(
      `/api/v1/public/blog/posts?page=1&limit=1`,
      { next: { revalidate: 300 } }
    );
    return (json?.meta?.total ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Format an ISO date as e.g. "12 March 2026". */
export function formatBlogDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
