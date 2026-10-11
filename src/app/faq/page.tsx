import Link from 'next/link';
import { FaqExplorer } from '@/components/FaqExplorer';
import { CatalogueDownload } from '@/components/CatalogueDownload';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ALL_FAQS, FAQ_CATEGORIES } from '@/lib/faq';
import { pageMetadata, siteConfig, siteUrl } from '@/lib/site';

/**
 * /faq — the sitewide FAQ hub.
 *
 * One page owns the "questions people actually ask" intent, for humans (a
 * searchable, deep-linkable explorer) and for machines (a single FAQPage
 * JSON-LD carrying every Q&A verbatim). The Tyashin chatbot crawler reads
 * FAQPage JSON-LD as question/answer pairs, so this same block is what trains
 * Lark — keep page copy and `src/lib/faq.ts` as one source.
 *
 * Ownership: the Tyashin edge defines a platform `/faq` page but it is
 * storefront-owned by default, so this route serves. Do not flip that toggle
 * in the admin or this page disappears behind the platform's accordion.
 */

export const metadata = pageMetadata({
  // The layout template appends "· Woodlark". Leads with the searchable term
  // ("wood veneer"), not "hybrid veneer" alone (which surfaces dental results).
  title: 'Wood Veneer FAQ — Hybrid Veneer Questions Answered',
  description:
    'Straight answers about Woodlark hybrid wood veneer: how it differs from natural veneer, 8×4 and 10×4 sheet sizes, kitchens, wardrobes and commercial projects, samples, bulk orders, dealership and repeat availability.',
  path: '/faq',
});

export default function FaqPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl('/faq')}#faq`,
        url: siteUrl('/faq'),
        name: 'Woodlark hybrid wood veneer FAQ',
        inLanguage: 'en-IN',
        publisher: { '@type': 'Organization', name: siteConfig.name, url: siteUrl('/') },
        mainEntity: ALL_FAQS.map((f) => ({
          '@type': 'Question',
          '@id': `${siteUrl('/faq')}#${f.id}`,
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: siteUrl('/faq') },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="container-x pt-24 md:pt-32 pb-10">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-brass transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden>·</li>
            <li className="text-brass" aria-current="page">
              FAQ
            </li>
          </ol>
        </nav>
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-5">Frequently asked</div>
            <h1 className="font-display text-5xl md:text-7xl text-walnut-deep leading-[0.95] text-balance">
              Hybrid wood veneer, explained.
            </h1>
          </div>
          <p className="lg:col-span-4 text-muted-foreground leading-relaxed max-w-md">
            The questions architects, interior designers, dealers and project buyers ask us most, across{' '}
            {FAQ_CATEGORIES.length} topics. Search them, filter them, or share a link to any single answer.
          </p>
        </div>
      </section>

      <section className="container-x pb-24 md:pb-32">
        <FaqExplorer />
      </section>

      <section className="relative overflow-hidden bg-walnut-deep text-cream">
        <div className="container-x py-24 md:py-32 text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-brass mb-5">Still deciding?</div>
          <h2 className="font-display text-4xl md:text-6xl text-balance max-w-3xl mx-auto leading-[1.05]">
            See the sheets, then ask us anything on WhatsApp.
          </h2>
          <p className="mt-6 text-cream/70 max-w-xl mx-auto">
            Request A4 samples, the dealer price list or project pricing. Same-day response, six days a week.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppButton
              size="lg"
              label={`Chat — ${siteConfig.whatsappDisplay}`}
              variant="ghost"
              message="Hello Woodlark, I would like to request samples and the catalogue."
            />
            <CatalogueDownload tone="dark" className="py-4" />
          </div>
        </div>
      </section>
    </>
  );
}
