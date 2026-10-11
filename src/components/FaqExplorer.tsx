'use client';

/**
 * FaqExplorer — the interactive body of /faq.
 *
 *  - Instant search across question + answer text. While a query is active the
 *    results flatten into one ranked list with the category as a kicker, and a
 *    short result set renders open so the answer is visible at once.
 *  - Category filters never scroll the page away.
 *  - Every question is deep-linkable (#<id>). Landing on a hash opens that
 *    question; each open answer offers a copy-link action.
 *  - No-JS / pre-hydration: everything is server-rendered as plain <details>,
 *    so the content (and the crawler's view of it) is never behind hydration.
 *
 * The FAQPage JSON-LD lives in the server page (page.tsx), not here.
 */

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Link2, Plus, Search, X } from 'lucide-react';
import { FAQ_CATEGORIES, type Faq, type FaqLink } from '@/lib/faq';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const norm = (s: string) => s.toLowerCase().normalize('NFKD');

/** Rank a FAQ against a query: 0 = no match; higher = better. */
function score(f: Faq, q: string): number {
  if (!q) return 1;
  const nq = norm(q);
  const inQ = norm(f.q).indexOf(nq);
  if (inQ === 0) return 100;
  if (inQ > 0) return 60;
  if (norm(f.a).includes(nq)) return 30;
  const hay = `${norm(f.q)} ${norm(f.a)}`;
  const words = nq.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words.every((w) => hay.includes(w))) return 15;
  return 0;
}

function useHashTarget(): string {
  const [target, setTarget] = useState('');
  useEffect(() => {
    const read = () => setTarget(decodeURIComponent(window.location.hash.slice(1)));
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  return target;
}

function FaqLinkChip({ link }: { link: FaqLink }) {
  const cls =
    'inline-flex items-center gap-2 border border-walnut-deep/25 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-walnut-deep hover:border-brass hover:text-brass transition-colors';
  if (link.external || link.href.startsWith('http')) {
    return (
      <a href={link.href} className={cls}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}

function FaqItem({ faq, kicker, forceOpen }: { faq: Faq; kicker?: string; forceOpen?: boolean }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (forceOpen && ref.current) ref.current.open = true;
  }, [forceOpen]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/faq#${faq.id}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the anchor still works */
    }
  };

  return (
    <details ref={ref} id={faq.id} className="group py-6 scroll-mt-36">
      <summary className="flex items-start justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span>
          {kicker && (
            <span className="block text-[10px] uppercase tracking-[0.3em] text-brass mb-2">{kicker}</span>
          )}
          <span className="font-display text-xl md:text-2xl text-walnut-deep leading-snug text-balance">
            {faq.q}
          </span>
        </span>
        <Plus
          size={18}
          className="mt-1.5 shrink-0 text-brass transition-transform duration-300 group-open:rotate-45"
          aria-hidden
        />
      </summary>
      <div className="mt-4 max-w-2xl">
        <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {faq.links?.map((l) => <FaqLinkChip key={l.href + l.label} link={l} />)}
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-brass transition-colors"
            aria-label={`Copy a direct link to “${faq.q}”`}
          >
            {copied ? (
              <>
                <Check size={13} aria-hidden /> Link copied
              </>
            ) : (
              <>
                <Link2 size={13} aria-hidden /> Copy link
              </>
            )}
          </button>
        </div>
      </div>
    </details>
  );
}

export function FaqExplorer() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const hashTarget = useHashTarget();

  // "/" focuses search from anywhere on the page (unless already typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // A hash pointing at a question inside a filtered-out category must win.
  useEffect(() => {
    if (!hashTarget) return;
    const owner = FAQ_CATEGORIES.find((c) => c.faqs.some((f) => f.id === hashTarget));
    if (!owner) return;
    if (category !== 'all' && category !== owner.id) setCategory('all');
    // An active search flattens the list and drops the target from the DOM.
    setQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashTarget]);

  const searching = deferredQuery.trim().length > 0;

  const results = useMemo(() => {
    if (!searching) return [];
    return FAQ_CATEGORIES.flatMap((c) =>
      c.faqs.map((f) => ({ faq: f, cat: c, s: score(f, deferredQuery.trim()) })),
    )
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s);
  }, [deferredQuery, searching]);

  const visibleCategories =
    category === 'all' ? FAQ_CATEGORIES : FAQ_CATEGORIES.filter((c) => c.id === category);

  return (
    <div>
      {/* Controls — sticky under the site header so the filter travels with the reader. */}
      <div className="sticky top-16 md:top-20 z-30 -mx-6 px-6 md:-mx-12 md:px-12 xl:-mx-20 xl:px-20 py-4 bg-background/90 backdrop-blur-md border-b border-border/60">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <label className="relative flex-1 max-w-xl">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the questions…  ( / )"
              aria-label="Search frequently asked questions"
              className="w-full border border-walnut-deep/20 bg-card pl-11 pr-10 py-3 text-sm text-walnut-deep placeholder:text-muted-foreground/70 outline-none focus:border-brass transition-colors [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-walnut-deep transition-colors"
              >
                <X size={15} aria-hidden />
              </button>
            )}
          </label>

          <div
            className="flex gap-2 overflow-x-auto md:overflow-visible md:flex-wrap pb-1 md:pb-0"
            role="tablist"
            aria-label="FAQ categories"
          >
            {[{ id: 'all', label: 'All' }, ...FAQ_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))].map(
              (c) => {
                const active = category === c.id && !searching;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setCategory(c.id);
                      setQuery('');
                    }}
                    className={`shrink-0 border px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                      active
                        ? 'bg-walnut-deep text-cream border-walnut-deep'
                        : 'border-walnut-deep/20 text-walnut-deep/80 hover:border-brass hover:text-brass'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>

      {searching ? (
        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground" aria-live="polite">
            {results.length === 0
              ? 'No matching answers'
              : `${results.length} answer${results.length === 1 ? '' : 's'} for “${deferredQuery.trim()}”`}
          </p>
          {results.length === 0 ? (
            <div className="mt-8 border border-border bg-card p-8 md:p-10 max-w-2xl">
              <p className="font-display text-2xl text-walnut-deep">We haven&apos;t written that one down yet.</p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Ask Lark, the assistant in the corner of this page, or send the question straight to the
                Woodlark team on WhatsApp.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <WhatsAppButton
                  size="md"
                  label="Ask on WhatsApp"
                  message="Hello Woodlark, I have a question about your hybrid veneer."
                />
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-6 py-3 text-xs uppercase tracking-[0.2em] border border-walnut-deep/30 text-walnut-deep hover:bg-walnut-deep hover:text-cream transition-colors"
                >
                  Browse all questions
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border border-t border-border">
              {results.map((r) => (
                <FaqItem key={r.faq.id} faq={r.faq} kicker={r.cat.label} forceOpen={results.length <= 4} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-20">
          {visibleCategories.map((c) => (
            <section key={c.id} id={`c-${c.id}`} className="scroll-mt-36">
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                <div className="lg:col-span-4 lg:sticky lg:top-44">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">{c.label}</div>
                  <p className="font-display text-2xl md:text-3xl text-walnut-deep leading-snug text-balance max-w-xs">
                    {c.blurb}
                  </p>
                </div>
                <div className="lg:col-span-8 divide-y divide-border border-t border-border">
                  {c.faqs.map((f) => (
                    <FaqItem key={f.id} faq={f} forceOpen={hashTarget === f.id} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
