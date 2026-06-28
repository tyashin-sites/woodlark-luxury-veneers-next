import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, formatBlogDate } from '@/lib/blog';
import { siteConfig, siteUrl } from '@/lib/site';

// SSR on every request — see /blog/page.tsx for rationale (freshness + gate).
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = `${post.seo?.metaTitle || post.title} · Woodlark`;
  const description = post.seo?.metaDescription || post.excerpt || siteConfig.tagline;
  const image = post.seo?.ogImage || post.featuredImage;
  return {
    title,
    description,
    alternates: { canonical: siteUrl(`/blog/${post.slug}`) },
    openGraph: {
      type: 'article',
      url: siteUrl(`/blog/${post.slug}`),
      title,
      description,
      images: image ? [image] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : [] },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const description = post.seo?.metaDescription || post.excerpt || '';
  const image = post.seo?.ogImage || post.featuredImage;
  const url = siteUrl(`/blog/${post.slug}`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    ...(image ? { image: [image] } : {}),
    author: {
      '@type': post.authorName ? 'Person' : 'Organization',
      name: post.authorName || siteConfig.name,
    },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container-x max-w-3xl pt-16 md:pt-24 pb-24">
        <a
          href="/blog"
          className="text-[11px] uppercase tracking-[0.25em] text-brass border-b border-brass/40 pb-1 hover:text-walnut-deep hover:border-walnut-deep"
        >
          ← The Journal
        </a>

        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-[0.25em] text-brass">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="mt-5 font-display text-4xl md:text-6xl text-walnut-deep leading-[1.02]">
          {post.title}
        </h1>

        <div className="mt-6 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {formatBlogDate(post.publishedAt)}
          {post.authorName ? ` · ${post.authorName}` : ''}
          {post.readTime ? ` · ${post.readTime} min read` : ''}
        </div>

        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="mt-10 w-full aspect-[16/9] object-cover bg-muted"
          />
        )}

        {/* Platform-authored trusted HTML rendered in Woodlark's prose style. */}
        <div className="blog-prose mt-10" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-16 pt-8 border-t border-border">
          <a
            href="/blog"
            className="text-[11px] uppercase tracking-[0.25em] text-brass border-b border-brass/40 pb-1 hover:text-walnut-deep hover:border-walnut-deep"
          >
            ← Back to The Journal
          </a>
        </div>
      </article>
    </>
  );
}
