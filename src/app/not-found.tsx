import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-7xl text-walnut-deep">404</div>
        <h2 className="mt-4 font-display text-2xl text-walnut-deep">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/" className="text-xs uppercase tracking-[0.25em] border-b border-walnut-deep pb-1">
            Return home →
          </Link>
        </div>
      </div>
    </div>
  );
}
