import { TransitionLink } from "@/components/layout/TransitionLink";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[var(--container-padding-x)]">
      <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />

      {/* Decorative background text */}
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        aria-hidden="true"
      >
        <span className="font-display text-[25vw] tracking-tighter text-text/[0.03]">404</span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <p className="font-label text-sm uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-4 font-display text-5xl font-normal text-text-heading md:text-6xl">
          Page not found
        </h1>
        <p className="mt-6 max-w-md text-center leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="scene-divider mt-8 w-full max-w-xs" />

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <TransitionLink
            href="/"
            className="inline-flex min-h-[44px] items-center border border-border px-6 py-3 font-label text-sm uppercase tracking-wider text-text transition-colors hover:border-border-hover hover:text-text-heading"
          >
            Go home
          </TransitionLink>
          <TransitionLink
            href="/work"
            className="inline-flex min-h-[44px] items-center border border-border/50 px-6 py-3 font-label text-sm uppercase tracking-wider text-text transition-colors hover:border-border-hover hover:text-text-heading"
          >
            View work
          </TransitionLink>
          <TransitionLink
            href="/contact"
            className="inline-flex min-h-[44px] items-center border border-border/50 px-6 py-3 font-label text-sm uppercase tracking-wider text-text transition-colors hover:border-border-hover hover:text-text-heading"
          >
            Get in touch
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
