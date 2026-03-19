import { TextReveal } from "@/components/animations/TextReveal";

interface ProjectGridProps {
  children: React.ReactNode;
}

export function ProjectGrid({ children }: ProjectGridProps) {
  return (
    <section className="px-[--container-padding-x] py-[--section-padding-y] md:py-[--section-padding-y]">
      <div className="mx-auto max-w-[--max-width-content]">
        <TextReveal variant="lines" as="h2" className="mb-16 font-display text-3xl text-text-heading md:text-[length:var(--text-5xl)]">
          Selected Work
        </TextReveal>

        <div className="grid grid-cols-1 gap-[--grid-gap] md:grid-cols-2">
          {children}
        </div>
      </div>
    </section>
  );
}
