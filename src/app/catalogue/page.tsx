import type { Metadata } from 'next';
import { Download, BookOpen } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteConfig, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Catalogue — Woodlark Hybrid Veneer',
  description:
    'Browse and download the Woodlark hybrid veneer catalogue — the full palette of tones and finishes. All designs available in 8x4 and 10x4.',
  alternates: { canonical: siteUrl('/catalogue') },
  openGraph: { url: siteUrl('/catalogue'), images: [siteConfig.ogImage] },
};

const { catalogue } = siteConfig;
const hasCatalogue = Boolean(catalogue.url);

export default function CataloguePage() {
  return (
    <>
      {/* Intro */}
      <section className="container-x pt-24 pb-12 md:pt-32 md:pb-16 border-b border-border">
        <div className="text-[11px] uppercase tracking-[0.4em] text-brass mb-6">
          {catalogue.edition}
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-walnut-deep max-w-3xl text-balance">
          The Woodlark <em className="text-brass not-italic font-light">Catalogue</em>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
          The complete palette — every tone and finish in one place, all designs available in
          8x4 and 10x4. Browse it here, or download a copy to share with your client or
          specification team.
        </p>

        {hasCatalogue && (
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href={catalogue.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-3 px-7 py-3.5 text-xs uppercase tracking-[0.25em] bg-brass text-walnut-deep hover:bg-walnut-deep hover:text-cream transition-colors"
            >
              <Download size={16} />
              Download the Catalogue
            </a>
            <WhatsAppButton label="Get it on WhatsApp" variant="outline" message="Hi Woodlark — please share the latest catalogue." />
          </div>
        )}
      </section>

      {hasCatalogue ? (
        /* Inline viewer — the browser's native PDF renderer; download button above is the
           guaranteed fallback for browsers/devices that can't embed PDFs. */
        <section className="container-x py-12 md:py-16">
          <div className="aspect-[3/4] md:aspect-[16/10] w-full border border-border bg-card overflow-hidden">
            <object data={catalogue.url} type="application/pdf" className="w-full h-full">
              <iframe src={catalogue.url} title="Woodlark Catalogue" className="w-full h-full border-0" />
              <div className="flex h-full items-center justify-center p-10 text-center">
                <p className="text-muted-foreground">
                  Your browser can’t display the catalogue inline.{' '}
                  <a href={catalogue.url} className="text-brass underline" target="_blank" rel="noopener noreferrer">
                    Download the PDF
                  </a>{' '}
                  instead.
                </p>
              </div>
            </object>
          </div>
        </section>
      ) : (
        /* Fallback until the production catalogue PDF is hosted and `siteConfig.catalogue.url`
           is set. Keeps /catalogue useful (and honest) rather than showing a broken embed. */
        <section className="container-x py-20 md:py-28">
          <div className="max-w-2xl mx-auto border border-border bg-card p-10 md:p-14 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brass/15 text-brass mb-6">
              <BookOpen size={24} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-walnut-deep">
              The latest catalogue is available on request.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Message us on WhatsApp and we’ll send the current Woodlark hybrid veneer catalogue
              straight to you — same-day, six days a week.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <WhatsAppButton
                size="lg"
                variant="primary"
                label="Request the Catalogue"
                message="Hi Woodlark — please share the latest hybrid veneer catalogue."
              />
              <a
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('Catalogue request')}`}
                className="text-xs uppercase tracking-[0.25em] text-walnut-deep border-b border-walnut-deep pb-1 hover:text-brass hover:border-brass transition-colors"
              >
                Or email us →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA — consistent with the other pages. */}
      <section className="relative overflow-hidden bg-walnut-deep text-cream">
        <div className="container-x py-24 md:py-28 text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-brass mb-5">Specifying for a project?</div>
          <h2 className="font-display text-3xl md:text-5xl text-balance max-w-3xl mx-auto leading-[1.05]">
            Get samples, technical sheets and project pricing on WhatsApp.
          </h2>
          <div className="mt-10 flex justify-center">
            <WhatsAppButton size="lg" label={`Chat — ${siteConfig.whatsappDisplay}`} variant="ghost" />
          </div>
        </div>
      </section>
    </>
  );
}
