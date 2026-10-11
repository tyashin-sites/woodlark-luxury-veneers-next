import Link from 'next/link';
import { Plus } from 'lucide-react';
import { HOME_FAQ_IDS, getFaq } from '@/lib/faq';

/**
 * Home-page FAQ teaser — four questions from the canonical catalogue, rendered
 * as plain <details> (no JS, crawlable), each deep-linking into /faq.
 *
 * Deliberately emits NO FAQPage JSON-LD: the /faq hub owns that block, and a
 * second FAQPage on the home page would be duplicate structured data.
 */
export function FaqTeaser() {
  const faqs = HOME_FAQ_IDS.map(getFaq).filter((f): f is NonNullable<typeof f> => Boolean(f));
  if (faqs.length === 0) return null;

  return (
    <section className="container-x py-20 md:py-28 border-t border-border">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">Frequently asked</div>
          <h2 className="font-display text-3xl md:text-4xl text-walnut-deep leading-tight text-balance">
            Before you specify, the answers.
          </h2>
          <Link
            href="/faq"
            className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-walnut-deep border-b border-walnut-deep pb-1 hover:text-brass hover:border-brass transition-colors"
          >
            All questions →
          </Link>
        </div>
        <div className="lg:col-span-8 divide-y divide-border border-t border-border">
          {faqs.map((f) => (
            <details key={f.id} className="group py-5">
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-display text-xl md:text-2xl text-walnut-deep leading-snug text-balance">
                  {f.q}
                </span>
                <Plus
                  size={18}
                  className="mt-1.5 shrink-0 text-brass transition-transform duration-300 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <div className="mt-4 max-w-2xl">
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                <Link
                  href={`/faq#${f.id}`}
                  className="mt-4 inline-block text-[10px] uppercase tracking-[0.22em] text-brass hover:text-walnut-deep transition-colors"
                >
                  Open in the FAQ →
                </Link>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
