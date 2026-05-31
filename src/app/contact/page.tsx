import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { siteConfig, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Woodlark — Samples, Pricing & Projects',
  description:
    'Reach the Woodlark team for sample requests, project pricing and specification support. WhatsApp +91 91388 80121 · sales@billionply.com.',
  alternates: { canonical: siteUrl('/contact') },
};

function ContactCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-7">
      <div className="flex items-center gap-3 text-brass mb-3">
        {icon}
        <span className="text-[10px] uppercase tracking-[0.3em]">{label}</span>
      </div>
      <div className="font-display text-2xl text-walnut-deep">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const a = siteConfig.address;
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-6">
          <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">Get in touch</div>
          <h1 className="font-display text-5xl md:text-7xl text-walnut-deep leading-[0.95] text-balance">
            Let&apos;s talk about your project.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
            The fastest way to reach Woodlark is on WhatsApp — our team responds the same day, six days a week. Request samples, technical sheets or project pricing.
          </p>
          <div className="mt-10">
            <WhatsAppButton size="lg" label={`Chat — ${siteConfig.whatsappDisplay}`} />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <ContactCard icon={<MessageCircle size={18} />} label="WhatsApp">
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-brass">
              {siteConfig.whatsappDisplay}
            </a>
          </ContactCard>
          <ContactCard icon={<Mail size={18} />} label="Email">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-brass">{siteConfig.email}</a>
          </ContactCard>
          <ContactCard icon={<MapPin size={18} />} label="Manufacturing & Showroom">
            <address className="not-italic leading-relaxed">
              {a.company}<br />
              {a.line1}<br />
              {a.line2} — {a.pincode}<br />
              District {a.district}, {a.state}, India
            </address>
          </ContactCard>
        </div>
      </div>
    </section>
  );
}
