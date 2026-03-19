import { TransitionLink } from "@/components/layout/TransitionLink";

export default function WorkPage() {
  return (
    <main className="min-h-[200vh] px-[--container-padding-x] pt-[--header-height]">
      <section className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="font-display text-text-heading text-6xl tracking-tight">Work</h1>
        <p className="mt-4 text-lg text-muted">Selected projects and albums.</p>
        <TransitionLink href="/" className="mt-12 text-lg text-muted transition-colors hover:text-text">
          &larr; Back to Home
        </TransitionLink>
      </section>
    </main>
  );
}
