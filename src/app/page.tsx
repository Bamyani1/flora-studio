import { TransitionLink } from "@/components/layout/TransitionLink";

export default function HomePage() {
  return (
    <main className="min-h-[200vh] px-[--container-padding-x] pt-[--header-height]">
      <section className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="font-display text-text-heading text-6xl tracking-tight">BAMYAN</h1>
        <p className="mt-4 font-body text-lg uppercase tracking-wider text-muted">Storyworks</p>
        <nav className="mt-12 flex gap-8">
          <TransitionLink href="/work" className="text-lg text-muted transition-colors hover:text-text">
            Work
          </TransitionLink>
          <TransitionLink href="/about" className="text-lg text-muted transition-colors hover:text-text">
            About
          </TransitionLink>
          <TransitionLink href="/contact" className="text-lg text-muted transition-colors hover:text-text">
            Contact
          </TransitionLink>
        </nav>
      </section>
    </main>
  );
}
