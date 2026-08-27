'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SpaceExperience = {
  pid: string;
  previewId: string;
  label: string;
  poster: string | null;
};

const VIEWER_ORIGIN = 'https://viewer.thridify.com';

type ThridifyHandle = {
  activate: () => Promise<void>;
  destroy: () => void;
};

type ThridifySDK = {
  mount: (
    el: Element,
    options: { productId: string; strategy?: 'on-demand' | 'preload' | 'eager' },
  ) => Promise<ThridifyHandle>;
};

declare global {
  interface Window {
    Thridify?: ThridifySDK;
  }
}

/** Load the Thridify SDK exactly once, resolving when window.Thridify exists. */
function ensureSdk(accountId: string): Promise<ThridifySDK> {
  return new Promise((resolve, reject) => {
    if (window.Thridify) {
      resolve(window.Thridify);
      return;
    }
    const existing = document.querySelector('script[src*="/sdk/v1/thridify.js"]');
    const onReady = () => {
      if (window.Thridify) resolve(window.Thridify);
      else reject(new Error('Thridify SDK loaded but did not initialise'));
    };
    window.addEventListener('thridify:sdk-ready', onReady, { once: true });
    if (existing) return; // already loading — the event above resolves us
    const script = document.createElement('script');
    script.src = `${VIEWER_ORIGIN}/sdk/v1/thridify.js`;
    script.setAttribute('data-account', accountId);
    script.async = true;
    script.onerror = () => reject(new Error('Failed to load the 3D viewer'));
    document.head.appendChild(script);
  });
}

/**
 * Space cards + a fullscreen, single-experience launcher.
 *
 * Deliberately NOT declarative `[data-thridify-product]` mounts: those would
 * boot a 3D viewer per card simultaneously — browsing spaces happens in cheap
 * HTML, and exactly one experience loads on tap (that restraint is also what
 * keeps older iPads alive). `data-thridify-switcher="off"` is forward-looking:
 * current viewers ignore it, the next release reads it to hide the in-viewer
 * experience switcher (this page IS the switcher).
 */
export function VisualiserGrid({
  accountId,
  spaces,
}: {
  accountId: string;
  spaces: SpaceExperience[];
}) {
  const [activePid, setActivePid] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'live' | 'error'>('idle');
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<ThridifyHandle | null>(null);

  const close = useCallback(() => {
    handleRef.current?.destroy();
    handleRef.current = null;
    setActivePid(null);
    setStatus('idle');
  }, []);

  const launch = useCallback(
    async (space: SpaceExperience) => {
      setActivePid(space.pid);
      setStatus('loading');
      try {
        const sdk = await ensureSdk(accountId);
        const container = overlayRef.current?.querySelector('[data-visualiser-stage]');
        if (!container) throw new Error('Stage container missing');
        container.innerHTML = '';
        handleRef.current?.destroy();
        const handle = await sdk.mount(container, {
          productId: space.pid,
          strategy: 'on-demand',
        });
        handleRef.current = handle;
        await handle.activate();
        setStatus('live');
      } catch (e) {
        console.error('[Visualiser] Failed to launch experience:', e);
        setStatus('error');
      }
    },
    [accountId],
  );

  // Escape closes the experience.
  useEffect(() => {
    if (!activePid) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePid, close]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {spaces.map((space) => (
          <button
            key={space.previewId}
            type="button"
            onClick={() => launch(space)}
            className="group block text-left w-full"
          >
            <div className="relative overflow-hidden bg-muted aspect-[4/3]">
              {space.poster ? (
                <img
                  src={space.poster}
                  alt={`${space.label} rendered with Woodlark veneer`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-walnut-deep/40 text-sm">
                  {space.label}
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-cream/90 text-walnut-deep text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                Explore in 3D
              </div>
            </div>
            <div className="pt-4">
              <span className="text-walnut-deep">{space.label}</span>
            </div>
          </button>
        ))}
      </div>

      {activePid && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[999] bg-cream/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="3D visualiser"
        >
          <div
            data-visualiser-stage
            data-thridify-switcher="off"
            className="absolute inset-0"
          />
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-walnut-deep/70 text-sm uppercase tracking-[0.2em]">
                Preparing your space…
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <p className="text-walnut-deep/80">
                The 3D experience could not load. Please try again.
              </p>
              <button
                type="button"
                onClick={close}
                className="underline underline-offset-4 text-walnut-deep"
              >
                Back to spaces
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={close}
            aria-label="Close 3D visualiser"
            className="absolute top-4 right-4 z-10 bg-cream/90 text-walnut-deep w-10 h-10 flex items-center justify-center text-xl leading-none shadow-sm"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
