"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[var(--container-padding-x)]">
      <p className="font-label text-sm uppercase tracking-widest text-muted">
        Error
      </p>
      <h1 className="mt-4 font-display font-normal text-5xl text-text-heading md:text-6xl">
        Something went wrong
      </h1>
      <p className="mt-6 max-w-md text-center text-muted leading-relaxed">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-10 inline-flex min-h-[44px] items-center border border-border px-6 py-3 font-label text-sm uppercase tracking-wider text-text transition-colors hover:border-border-hover hover:text-text-heading"
      >
        Try again
      </button>
    </main>
  );
}
