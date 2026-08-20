// A short, reusable explainer of what hybrid veneer is. Shown on the home page
// and on every product page so the material is defined wherever a visitor lands.
// British/Indian spelling throughout, to match the rest of the site.
const HYBRID_VENEER_COPY = [
  'Hybrid veneer is an advanced decorative surfacing material that combines the elegance of natural wood with the consistency of engineered veneer. Crafted through a specialised process, it offers the richness of real wood grains while ensuring uniformity in texture, colour, and pattern.',
  'Ideal for premium furniture, wall panelling, cabinetry, and interior décor, hybrid veneer provides excellent durability, easy maintenance, and a luxurious finish. Its ability to replicate exotic wood aesthetics while remaining cost-effective makes it a preferred choice for architects, interior designers, and furniture manufacturers seeking high-quality, sustainable, and visually appealing solutions.',
];

export function HybridVeneerIntro({
  compact = false,
  className = '',
}: {
  /** Tighter spacing and type for in-page use (e.g. a product page). */
  compact?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`container-x border-t border-border ${
        compact ? 'py-14 md:py-16' : 'py-20 md:py-28'
      } ${className}`}
    >
      <div className="max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.3em] text-brass mb-4">
          What is Hybrid Veneer
        </div>
        <h2
          className={`font-display text-walnut-deep mb-6 ${
            compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'
          }`}
        >
          The elegance of natural wood, engineered for consistency.
        </h2>
        <div
          className={`space-y-4 text-muted-foreground leading-relaxed ${
            compact ? 'text-sm md:text-base' : 'text-base md:text-lg'
          }`}
        >
          {HYBRID_VENEER_COPY.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
