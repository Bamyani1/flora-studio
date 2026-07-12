import type { Metadata } from "next";
import { RouteChrome } from "@/components/layout/RouteChrome";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/site-content";

// Own metadata so a dead link doesn't masquerade as the homepage (and doesn't
// leak the internal /_not-found route as a canonical)
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
  alternates: { canonical: null },
};

export default async function NotFound() {
  const siteSettings = await getSiteSettings();

  return (
    // Full site chrome: a lost visitor still needs the wordmark, the nav, and
    // (on phones) the menu — an unbranded dead end strands them
    <RouteChrome socialLinks={siteSettings.socialLinks}>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[var(--container-padding-x)] pt-[var(--header-height)]">
        <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />

        {/* Decorative background text — kept above the content block so it
            never muddies the action row */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[12vh] flex select-none justify-center"
          aria-hidden="true"
        >
          <span className="font-display text-[22vw] leading-none tracking-tighter text-text/[0.05]">
            404
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <p className="eyebrow text-primary">404 &mdash; Out of frame</p>
          <h1 className="mt-4 font-display text-5xl font-light italic text-text-heading md:text-6xl">
            Page not found
          </h1>
          <p className="mt-6 max-w-md text-center leading-relaxed text-muted">
            This shot didn&apos;t make the final cut &mdash; the page you&apos;re after has moved
            or never existed.
          </p>

          <div className="scene-divider mt-8 w-full max-w-xs" />

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Button as={TransitionLink} href="/" size="xs" className="min-h-[44px]">
              Go home
            </Button>
            <Button
              as={TransitionLink}
              href="/work"
              variant="outline"
              size="xs"
              className="min-h-[44px]"
            >
              View work
            </Button>
            <Button
              as={TransitionLink}
              href="/contact"
              variant="outline"
              size="xs"
              className="min-h-[44px]"
            >
              Get in touch
            </Button>
          </div>
        </div>
      </main>
    </RouteChrome>
  );
}
