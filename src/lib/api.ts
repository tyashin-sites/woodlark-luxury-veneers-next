// Single point of change for every Tyashin API call. Server-side and
// client-side both go through here so swapping URLs, keys, or auth headers
// only happens in one place.
import type { ApiProduct, ApiCategory, ProductView } from './types';

const API_URL =
  process.env.NEXT_PUBLIC_TYASHIN_API_URL || 'https://website-api.tyashin.com';
const STOREFRONT =
  process.env.NEXT_PUBLIC_TYASHIN_STOREFRONT_URL ||
  `${API_URL}/api/v1/public/ecommerce`;
const API_KEY =
  process.env.NEXT_PUBLIC_TYASHIN_API_KEY || process.env.TYASHIN_API_KEY || '';
const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || '6a1c9aa66933b758bf066427';

type FetchOpts = RequestInit & {
  // Next.js extensions
  next?: { revalidate?: number };
  cache?: RequestCache;
};

async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    'X-API-Key': API_KEY,
    Accept: 'application/json',
    ...(opts.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${STOREFRONT}${path}`, {
    ...opts,
    headers,
    next: opts.next ?? { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Tyashin API ${path} -> ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { success: boolean; data: T };
  return json.data;
}

export async function listProducts(params: {
  limit?: number;
  page?: number;
  category?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<ApiProduct[]> {
  const qs = new URLSearchParams();
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.page) qs.set('page', String(params.page));
  if (params.category) qs.set('category', params.category);
  qs.set('sortBy', params.sortBy ?? 'createdAt');
  qs.set('sortOrder', params.sortOrder ?? 'asc');
  qs.set('status', 'active');
  return apiFetch<ApiProduct[]>(`/products?${qs.toString()}`);
}

export async function getProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    return await apiFetch<ApiProduct>(`/products/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function listCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>('/categories');
}

// View transform — pulls a primary image, resolves a few derived fields.
// Extracts bullet "features" from the description if author used `- ` or `• `
// line prefixes; otherwise leaves features empty.
export function toView(p: ApiProduct, categories: ApiCategory[] = []): ProductView {
  const primary = p.images.find((i) => i.isPrimary) ?? p.images[0];
  const cat = categories.find((c) => c.id === p.categoryId);
  const features = (p.shortDescription ?? '')
    .split(/\n|·/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && s.length < 90)
    .slice(0, 4);
  return {
    slug: p.slug,
    name: p.name,
    sku: p.sku ?? '',
    shortDescription: p.shortDescription ?? '',
    description: p.description,
    image: primary?.url ?? '',
    imageAlt: primary?.alt ?? `${p.name} veneer`,
    category: cat?.name,
    categorySlug: cat?.slug,
    tags: p.tags ?? [],
    features,
    price: {
      amount: p.price / 100,
      compareAt: p.compareAtPrice ? p.compareAtPrice / 100 : undefined,
      currency: 'INR',
    },
  };
}

export const config = { API_URL, STOREFRONT, PROJECT_ID, hasApiKey: !!API_KEY };
