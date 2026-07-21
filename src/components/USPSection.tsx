// 2026-07-03: product attributes per the customer — "True-To-Nature Appearance",
// "Consistent Grain", "All designs available in 8x4 and 10x4".
const usps = [
  { n: '01', title: 'True-to-nature appearance',   body: 'Grain, depth and tone that read like natural timber — the look of fine wood, without the batch-to-batch lottery.' },
  { n: '02', title: 'Consistent grain',            body: 'The swatch you specify is the wall you receive — sheet after sheet, project after project.' },
  { n: '03', title: 'Built for project scale',     body: 'Hotels, residences, retail roll-outs — the same veneer, available again next month and the month after.' },
  { n: '04', title: 'Available in 8x4 and 10x4',   body: 'Every design in the collection comes in both 8x4 and 10x4 sheets, so a single specification covers the whole project.' },
];

export function USPSection() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">The Woodlark Promise</div>
          <h2 className="font-display text-4xl md:text-5xl text-walnut-deep leading-[1.05] text-balance">
            Italian excellence, engineered for the realities of large projects.
          </h2>
        </div>
        <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-12">
          {usps.map((u) => (
            <div key={u.n}>
              <div className="text-[11px] tracking-[0.25em] text-brass mb-3">{u.n}</div>
              <h3 className="font-display text-2xl text-walnut-deep mb-2">{u.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
