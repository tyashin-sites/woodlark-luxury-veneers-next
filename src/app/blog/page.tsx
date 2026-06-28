import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listPosts, formatBlogDate } from '@/lib/blog';
import { siteConfig, siteUrl } from '@/lib/site';

// Fresh SSR on every request (matches the platform's per-request blog render):
// new/pinned posts appear immediately and the notFound gate reflects live state.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Journal — Woodlark',
  description: `Notes on hybrid veneer, design and craft from Woodlark. ${siteConfig.tagline}.`,
  alternates: { canonical: siteUrl('/blog') },
  openGraph: {
    type: 'website',
    url: siteUrl('/blog'),
    title: 'Journal — Woodlark',
    description: `Notes on hybrid veneer, design and craft from Woodlark.`,
  },
};

type Search = { searchParams: Promise<{ page?: string }> };

export default async function BlogIndexPage({ searchParams }: Search) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const data = await listPosts(page);

  // Gate: blog off or no published posts → 404 so the platform/storefront
  // doesn't surface an empty page (and the nav "Journal" link stays hidden).
  if (!data.active || data.posts.length === 0) notFound();

  const { posts, totalPages } = data;

  return (
    <>
      <section className="container-x pt-24 md:pt-32 pb-10">
        <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-5">The Journal</div>
        <h1 className="font-display text-5xl md:text-7xl text-walnut-deep leading-[0.95] max-w-3xl text-balance">
          Notes on veneer, design & craft.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Stories, specification guidance and design thinking from the Woodlark studio.
        </p>
      </section>

      <section className="container-x pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col"
            >
              <div className="relative bg-muted aspect-[4/3] overflow-hidden">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary text-walnut-deep/30 font-display text-2xl">
                    Woodlark
                  </div>
                )}
                {post.pinned && (
                  <div className="absolute top-3 left-3 bg-cream text-walnut-deep text-[10px] uppercase tracking-[0.25em] px-3 py-1.5">
                    Featured
                  </div>
                )}
              </div>

              <div className="pt-5">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {formatBlogDate(post.publishedAt)}
                  {post.authorName ? ` · ${post.authorName}` : ''}
                </div>
                <h2 className="mt-3 font-display text-2xl text-walnut-deep leading-snug transition-colors group-hover:text-brass">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p
                    className="mt-3 text-sm text-muted-foreground leading-relaxed"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-[0.2em] text-brass border-b border-brass/40 pb-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="mt-20 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.25em]">
            {page > 1 ? (
              <a
                href={page - 1 === 1 ? '/blog' : `/blog?page=${page - 1}`}
                className="border-b border-walnut-deep pb-1 hover:text-brass hover:border-brass"
              >
                ← Newer
              </a>
            ) : (
              <span />
            )}
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <a
                href={`/blog?page=${page + 1}`}
                className="border-b border-walnut-deep pb-1 hover:text-brass hover:border-brass"
              >
                Older →
              </a>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </>
  );
}
