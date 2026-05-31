export interface ApiProductImage {
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description: string;
  shortDescription?: string;
  price: number;            // smallest unit (paise for INR)
  compareAtPrice?: number;
  status: 'draft' | 'active' | 'archived';
  categoryId?: string;
  tags: string[];
  images: ApiProductImage[];
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

// Light view derived from ApiProduct for display purposes
export interface ProductView {
  slug: string;
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  category?: string;          // resolved category name (computed)
  categorySlug?: string;
  tags: string[];
  features: string[];         // extracted from description bullet points if present, else empty
  price?: { amount: number; compareAt?: number; currency: string };
}
