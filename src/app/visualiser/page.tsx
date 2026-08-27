import { pageMetadata } from '@/lib/site';
import { VisualiserGrid, type SpaceExperience } from '@/components/VisualiserGrid';

export const metadata = pageMetadata({
  title: 'Visualiser',
  description:
    'See Woodlark wood veneer in real spaces — kitchens, wardrobes, corridors and more. Explore each room in 3D, change finishes live, and view it in your own space with AR.',
  path: '/visualiser',
});

// The Thridify account this site's 3D experiences are published under (the
// same account the product-page "View in 3D" plugin resolves). Overridable
// per environment; the platform plugin config is the source of truth.
const THRIDIFY_ACCOUNT_ID =
  process.env.NEXT_PUBLIC_THRIDIFY_ACCOUNT_ID ?? '07eeb24d9d5496c5c40ab735b137c89f';

const MODELS_BASE = 'https://models.thridify.com';

/**
 * Space labels arrive as publish-time identifiers ("L_Shaped Kitchen",
 * "Tv Unit", "corridor"). Render them like a person wrote them.
 */
function prettifyLabel(label: string): string {
  return label
    .replace(/_/g, '-')
    .split(' ')
    .map((word) => {
      if (word.toLowerCase() === 'tv') return 'TV';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

async function getSpaces(): Promise<SpaceExperience[]> {
  try {
    const res = await fetch(`${MODELS_BASE}/${THRIDIFY_ACCOUNT_ID}/experiences.json`, {
      // The file is edge-cached upstream (60s + a long stale window); a short
      // ISR window keeps the page fresh without hitting it per request.
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      experiences?: Array<{ pid: string; previewId: string; label: string; poster: string | null }>;
    };
    return (data.experiences ?? [])
      .filter((e) => e.pid && e.previewId)
      .map((e) => ({
        pid: e.pid,
        previewId: e.previewId,
        label: prettifyLabel(e.label || e.pid),
        poster: e.poster,
      }));
  } catch {
    return [];
  }
}

export default async function VisualiserPage() {
  const spaces = await getSpaces();

  return (
    <main>
      <section className="container-x pt-16 md:pt-24 pb-12 md:pb-16">
        <p className="text-[11px] uppercase tracking-[0.25em] text-walnut-deep/60 mb-5">
          Visualiser
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-walnut-deep leading-[0.95] max-w-4xl text-balance">
          See our veneers in real spaces.
        </h1>
        <p className="mt-6 max-w-2xl text-walnut-deep/70 leading-relaxed">
          Choose a room below to explore it in 3D — change the veneer on walls, wardrobes and
          cabinetry live, then view it in your own space with AR on your phone or tablet.
        </p>
      </section>

      <section className="container-x pb-24">
        {spaces.length > 0 ? (
          <VisualiserGrid accountId={THRIDIFY_ACCOUNT_ID} spaces={spaces} />
        ) : (
          <p className="text-walnut-deep/60">
            The visualiser is being prepared. Please check back shortly, or browse the{' '}
            <a href="/collection" className="underline underline-offset-4">
              collection
            </a>
            .
          </p>
        )}
      </section>
    </main>
  );
}
