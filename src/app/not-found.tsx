import { TransitionLink } from "@/components/layout/TransitionLink";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[--container-padding-x]">
      <p className="font-mono text-sm uppercase tracking-widest text-muted">
        404
      </p>
      <h1 className="mt-4 font-display text-5xl text-text-heading md:text-6xl">
        Page not found
      </h1>
      <p className="mt-6 max-w-md text-center text-muted leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <TransitionLink
        href="/"
        className="mt-10 inline-flex min-h-[44px] items-center border border-border px-6 py-3 font-body text-sm tracking-wide text-text transition-colors hover:border-border-hover hover:text-text-heading"
      >
        Back to home
      </TransitionLink>
    </main>
  );
}
