import { Download } from 'lucide-react';

// The hosted e-catalogue PDF (cover → all sheets → contact). It is a static
// asset, not an app route, so a plain <a download> is correct — `download` hints
// the browser to save it rather than navigate.
const HREF = '/woodlark-hybrid-veneer-catalogue.pdf';
const LABEL = 'Download catalogue (PDF)';

export function CatalogueDownload({
  tone = 'light',
  className = '',
}: {
  /** 'dark' for placement over dark hero imagery; 'light' for cream pages. */
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const base =
    'inline-flex items-center gap-3 px-7 py-3.5 text-xs uppercase tracking-[0.25em] transition-colors';
  const skin =
    tone === 'dark'
      ? 'border border-cream/40 text-cream hover:bg-cream hover:text-walnut-deep'
      : 'border border-walnut-deep/30 text-walnut-deep hover:bg-walnut-deep hover:text-cream';
  return (
    <a
      href={HREF}
      download
      className={`${base} ${skin} ${className}`}
      aria-label="Download the Woodlark hybrid veneer catalogue as a PDF"
    >
      <Download size={16} />
      {LABEL}
    </a>
  );
}
