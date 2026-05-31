import Link from 'next/link';
import { siteConfig, whatsappLink } from '@/lib/site';

export function Footer() {
  const a = siteConfig.address;
  return (
    <footer className="bg-walnut-deep text-cream/90 mt-24">
      <div className="container-x py-20 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-display text-3xl tracking-[0.25em]">WOODLARK</div>
          <p className="mt-4 text-sm text-cream/60 max-w-sm leading-relaxed">
            {siteConfig.tagline}. Embracing Italian excellence, crafted for the bold.
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">Explore</div>
          <ul className="space-y-3 text-sm">
            {siteConfig.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-brass transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">Visit</div>
          <address className="not-italic text-sm leading-relaxed text-cream/70">
            {a.company}<br />
            {a.line1}<br />
            {a.line2} — {a.pincode}<br />
            District {a.district}, {a.state}
          </address>
          <div className="mt-6 space-y-2 text-sm">
            <div>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-brass transition-colors">
                WhatsApp · {siteConfig.whatsappDisplay}
              </a>
            </div>
            <div>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-brass transition-colors">
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-cream/50">
          <span>© {new Date().getFullYear()} Woodlark · Billionply</span>
          <span>Designed in Delhi · Crafted for the bold</span>
        </div>
      </div>
    </footer>
  );
}
