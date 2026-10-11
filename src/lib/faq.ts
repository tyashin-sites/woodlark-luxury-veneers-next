/**
 * CANONICAL FAQ CATALOGUE — the single content source for the /faq page, its
 * FAQPage JSON-LD, the home-page teaser, and (via the JSON-LD) the chatbot's
 * knowledge base. Supplied by the Woodlark team 2026-10-11 and edited for the
 * site voice.
 *
 * RULES baked in (do not undo when editing):
 *  - British/Indian spelling throughout (catalogue, colour, visualiser).
 *  - NO product counts in visible copy (customer directive 2026-08-12: a
 *    number goes stale on every publish). Point at /collection instead.
 *  - "Hybrid veneer" alone is a weak search term (dental results) — answers
 *    say "hybrid wood veneer" / "wood veneer" and name the use-cases.
 *  - No pricing figures. Pricing routes to a dealer or WhatsApp.
 *  - Answers are plain text (rendered verbatim AND serialised to JSON-LD);
 *    related pages go in `links`, never inline markup.
 *  - `id` is the deep-link anchor (#<id>) — never change one once live.
 */

export type FaqLink = { label: string; href: string; external?: boolean };

export type Faq = {
  id: string;
  q: string;
  a: string;
  links?: FaqLink[];
};

export type FaqCategory = {
  id: string;
  label: string;
  blurb: string;
  faqs: Faq[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'material',
    label: 'The material',
    blurb: 'What hybrid wood veneer is, how it is made, and where it is used.',
    faqs: [
      {
        id: 'what-is-hybrid-veneer',
        q: 'What is hybrid veneer, and how is it different from natural veneer?',
        a: 'Hybrid veneer, like Woodlark, is engineered to combine the aesthetic beauty of natural wood with far greater consistency and availability. With natural veneer every sheet varies in colour, grain and texture depending on the tree it came from. Hybrid wood veneer is designed so that every sheet looks and feels uniform: the same grain pattern, tone and finish across every sheet in a batch and across future replenishments. For projects that need matching surfaces across rooms, or over time, hybrid veneer is the more reliable choice.',
        links: [{ label: 'Browse the collection', href: '/collection' }],
      },
      {
        id: 'sheet-sizes',
        q: 'What sheet sizes does Woodlark hybrid veneer come in?',
        a: 'Woodlark hybrid wood veneer is available in two sheet sizes: 8×4 feet and 10×4 feet. The 8×4 sheet is the industry standard and suits most furniture and cabinetry work. The 10×4 sheet is made for larger surfaces such as full-height wardrobes, wall panelling and commercial installations, where fewer seams are preferred.',
        links: [{ label: 'See 8×4 and 10×4 designs', href: '/collection' }],
      },
      {
        id: 'how-many-designs',
        q: 'How many designs are in the Woodlark veneer range?',
        a: 'The Woodlark catalogue is organised in two ranges, 8×4 and 10×4, and every design carries a unique code (for example H-1, H-47 or H-101) that identifies a distinct grain pattern, tone and texture. The complete, current range is on the Collection page of this website and in the online catalogue, and is also available through your nearest Woodlark authorised dealer.',
        links: [
          { label: 'Collection', href: '/collection' },
          { label: 'Open the catalogue', href: '/catalogue/', external: true },
        ],
      },
      {
        id: 'modular-kitchens-wardrobes',
        q: 'Is Woodlark veneer suitable for modular kitchens and wardrobe shutters?',
        a: 'Yes. Woodlark hybrid wood veneer is widely used for modular kitchen shutters, wardrobe doors, TV unit panels and wall cladding. Because grain and colour are consistent from sheet to sheet, it is particularly suited to projects where many shutters or panels must match perfectly, which is difficult to achieve with natural veneer.',
        links: [{ label: 'See veneers in a kitchen', href: '/visualiser' }],
      },
      {
        id: 'commercial-projects',
        q: 'Can Woodlark veneer be used for commercial interior projects?',
        a: 'Absolutely. One of Woodlark’s key strengths is suitability for large-scale commercial work: hotels, offices, retail spaces and hospitality interiors. Because every design is consistently available in bulk, project managers and interior contractors can specify a design at the start of a project and be confident the same material will be there throughout, including for snag replacements and future phases.',
      },
      {
        id: 'consistency-across-sheets',
        q: 'What makes Woodlark veneer consistent across sheets?',
        a: 'Consistency is the core of what makes Woodlark a hybrid veneer brand. Each design is produced to a fixed specification, so the grain pattern, colour tone and texture stay uniform across every sheet, whether you order ten sheets or a thousand. When you reorder weeks or months later you receive the same design, with no batch-to-batch colour drift. That is the fundamental advantage over natural veneer, where no two sheets are ever identical.',
      },
      {
        id: 'modern-interior-styles',
        q: 'Is Woodlark veneer compatible with modern interior design styles?',
        a: 'Yes. The Woodlark range has been curated with contemporary interiors in mind: clean, linear grain patterns, muted and warm tones, and finishes that complement the minimalist, Scandinavian and neo-classical styles that lead residential and commercial interior design today. The full catalogue on this website gives a clear view of the range.',
        links: [{ label: 'Open the catalogue', href: '/catalogue/', external: true }],
      },
      {
        id: 'how-it-is-made',
        q: 'How is Woodlark hybrid veneer manufactured?',
        a: 'Woodlark sources premium veneer from trusted international suppliers, which is then carefully hot-pressed at our own factory under controlled conditions to achieve consistent quality, texture and finish.',
        links: [{ label: 'Our story', href: '/about' }],
      },
    ],
  },
  {
    id: 'dealers',
    label: 'Dealers & trade',
    blurb: 'Becoming an authorised dealer, order quantities, margins and support.',
    faqs: [
      {
        id: 'become-a-dealer',
        q: 'How can I become a Woodlark authorised dealer?',
        a: 'Simply contact us to discuss our authorised dealer models. Each model comes with its own terms and conditions, so you can choose the option that best suits your business and your market.',
        links: [{ label: 'Contact the trade team', href: '/contact' }],
      },
      {
        id: 'dealer-minimum-order',
        q: 'What is the minimum order quantity (MOQ) to start a dealership?',
        a: 'You can start a Woodlark dealership with an initial order of 500 pieces, depending on the dealer model selected. As your business grows you can gradually increase your order quantity and become a major Woodlark Veneer stockist in your market.',
        links: [{ label: 'Talk to us about dealership', href: '/contact' }],
      },
      {
        id: 'dealer-margin',
        q: 'What margin or trade discount does Woodlark offer to dealers?',
        a: 'Woodlark offers a dedicated dealer price list along with a choice of trade discount options. The applicable margin and benefits depend on the dealer model you select, so dealers can choose the structure that best suits their business.',
        links: [{ label: 'Request the dealer price list', href: '/contact' }],
      },
      {
        id: 'dealer-marketing-support',
        q: 'Does Woodlark provide marketing support and branding material to dealers?',
        a: 'Yes. Woodlark provides dealers with samples, catalogues, branding materials and digital marketing support. Dealers can also use the online 3D Visualiser on this website to show Woodlark veneers on different interior models, helping customers picture the final look and choose with confidence.',
        links: [{ label: 'Try the 3D Visualiser', href: '/visualiser' }],
      },
      {
        id: 'territory-exclusivity',
        q: 'Does Woodlark offer exclusive dealership in a territory?',
        a: 'Yes. We aim to offer territory-based exclusivity to our dealers, depending on the dealer model and the agreed geographical radius. Direct enquiries we receive from that territory are generally routed to the authorised dealer serving the area, which helps protect and support their business.',
      },
    ],
  },
  {
    id: 'ordering',
    label: 'Ordering & delivery',
    blurb: 'Samples, bulk orders, repeat availability, lead times and coverage.',
    faqs: [
      {
        id: 'bulk-order-projects',
        q: 'How do I place a bulk order for a large interior project?',
        a: 'For large interior or commercial projects, contact your nearest Woodlark authorised dealer with your design codes and quantities. Our dealers handle project-scale orders and can advise on lead times, stock availability and logistics. For very large volumes, you can also send a direct enquiry to our trade team.',
        links: [{ label: 'Send a project enquiry', href: '/contact' }],
      },
      {
        id: 'samples',
        q: 'Can I get a sample before placing a bulk order?',
        a: 'Yes. We provide A4-size samples of the veneer range along with our catalogue, so you can review the designs and finishes before placing a bulk order. You can also explore the complete range on this website and use the online 3D Visualiser to see how each veneer looks in different interiors.',
        links: [
          { label: 'Request samples', href: '/contact' },
          { label: '3D Visualiser', href: '/visualiser' },
        ],
      },
      {
        id: 'delivery-timeline',
        q: 'What is the delivery timeline for Woodlark veneer orders?',
        a: 'Delivery timelines depend on order quantity, product availability and destination. We always give priority to urgent orders and make every effort to deliver on time.',
      },
      {
        id: 'repeat-availability',
        q: 'Is the same veneer design guaranteed to be available for repeat or ongoing orders?',
        a: 'Yes, and this is one of Woodlark’s most important commitments. Every design in the Woodlark catalogue is maintained in continuous availability. Whether you are completing a large project in phases or returning months later for additional material, the same design, in the same colour and grain, will be available. This matters most on commercial projects and for dealers managing large client accounts.',
      },
      {
        id: 'supply-regions',
        q: 'Which cities and regions does Woodlark currently supply to?',
        a: 'Woodlark supplies pan-India, serving dealers, architects, interior designers and customers across major cities and regions. Our growing distribution network provides reliable supply and timely delivery across India.',
        links: [{ label: 'Find your nearest dealer', href: '/contact' }],
      },
    ],
  },
  {
    id: 'trust',
    label: 'Quality & trust',
    blurb: 'Standards, certifications, and seeing the range before you commit.',
    faqs: [
      {
        id: 'certifications',
        q: 'What certifications or quality standards does Woodlark veneer meet?',
        a: 'Woodlark follows the required quality and compliance standards for veneer manufacturing and supply in India, including the relevant ISI and ISO certifications. We maintain strict quality checks throughout manufacturing to ensure consistent, reliable products.',
      },
      {
        id: 'see-the-catalogue-first',
        q: 'Can I see the full Woodlark product catalogue before contacting a dealer?',
        a: 'Yes. The complete Woodlark catalogue, across both the 8×4 and 10×4 ranges, is on this website. Each design is listed with its unique code and a high-quality photograph of the veneer sheet. Browse the range, shortlist designs, then reach your nearest authorised dealer or contact us directly to request samples or place an order.',
        links: [
          { label: 'Collection', href: '/collection' },
          { label: 'Open the catalogue', href: '/catalogue/', external: true },
        ],
      },
    ],
  },
];

export const ALL_FAQS: Faq[] = FAQ_CATEGORIES.flatMap((c) => c.faqs);

/** The questions surfaced on the home page — the ones a first-time specifier asks. */
export const HOME_FAQ_IDS = [
  'what-is-hybrid-veneer',
  'sheet-sizes',
  'repeat-availability',
  'samples',
];

export function getFaq(id: string): Faq | undefined {
  return ALL_FAQS.find((f) => f.id === id);
}
