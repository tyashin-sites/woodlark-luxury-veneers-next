import { WhatsAppButton } from '@/components/WhatsAppButton';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata({
  // Just "Our Story" — the layout template appends "· Woodlark", so keeping the
  // brand in the title too produced "Our Story — Woodlark · Woodlark".
  title: 'Our Story',
  description:
    'A legacy of more than 30 years, inspired by Italy. Woodlark makes luxury hybrid wood veneer — decorative veneer engineered for consistency and scale across wall panelling, cabinetry and furniture.',
  path: '/about',
});

const pillars = [
  {
    k: 'Consistency',
    title: 'The same sheet, every time.',
    body:
      'The tone you specify is the tone you receive — across one wall, ten rooms, or three hundred. No batch-to-batch surprise, no design drift halfway through a project.',
  },
  {
    k: 'Built for scale',
    title: 'Convenient for large projects.',
    body:
      'Hotels, residential towers, retail roll-outs — the same Woodlark veneer is available at the start of your project, and still available the month you order the last sheet.',
  },
  {
    k: 'Cost-effective',
    title: 'Premium without the premium.',
    body:
      'Premium aesthetics without premium pricing, and a wide palette to choose from — so designers get more freedom and clients get more predictable budgets.',
  },
  {
    k: 'Modern by design',
    title: 'Matches the way we live now.',
    body:
      'Our tones are developed to complement contemporary interiors — minimal, layered, warm — not to mimic the catalogues of a decade ago.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <img
          src="/images/hero-3.jpg"
          alt=""
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-walnut-deep via-walnut-deep/50 to-transparent" />
        <div className="container-x relative pb-16 text-cream">
          <div className="text-[10px] uppercase tracking-[0.4em] text-brass mb-4">Our Story</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-3xl leading-[0.95] text-balance">
            {/* 2026-07-03: was "Born in Delhi." — customer does not want a Delhi-brand association. */}
            A legacy of more than 30 years.
            <br />
            Inspired by Italy.
          </h1>
        </div>
      </section>

      {/* Opening — who Woodlark is */}
      <section className="container-x py-24 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">What we make</div>
          <h2 className="font-display text-4xl text-walnut-deep leading-tight text-balance">
            Hybrid veneer, made to feel like hardwood and behave like a modern material.
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Woodlark began with a simple frustration — beautiful Indian interior projects kept
            stalling when natural veneer ran out, or when the next batch came back a quiet shade
            off. We started Woodlark to fix that, end-to-end.
          </p>
          <p>
            Today, every sheet we make is engineered to look and feel like the best of hardwood and
            behave like the modern material it is — consistent, repeatable, ready when your project
            is.
          </p>
        </div>
      </section>

      {/* Middle — the four pillars */}
      <section className="bg-walnut-deep text-cream py-24">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">
              Why designers choose Woodlark
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">
              Four things every Woodlark sheet promises.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-14">
            {pillars.map((p) => (
              <div key={p.k}>
                <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-3">{p.k}</div>
                <h3 className="font-display text-2xl md:text-3xl mb-3 text-cream">{p.title}</h3>
                <p className="text-cream/70 text-sm md:text-base leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Close — human statement */}
      <section className="container-x py-24 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">
          The people behind it
        </div>
        <p className="font-display text-2xl md:text-3xl text-walnut-deep leading-snug text-balance">
          We are a small team that cares about the wall behind every chair we sit in. If Woodlark is
          in your specification, it&apos;s because someone made sure the next sheet will look
          exactly like the last one — and the one after that.
        </p>
      </section>

      <section className="container-x py-24 text-center border-t border-border">
        <h2 className="font-display text-4xl md:text-5xl text-walnut-deep max-w-2xl mx-auto text-balance">
          Specifying Woodlark for your next project?
        </h2>
        <div className="mt-10 flex justify-center">
          <WhatsAppButton size="lg" />
        </div>
      </section>
    </>
  );
}
