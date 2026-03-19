import { FadeIn } from "@/components/animations/FadeIn";
import { ClipReveal } from "@/components/animations/ClipReveal";

const CATEGORIES = ["Personal", "Event", "Sports", "Solo"];

export function CategoriesStrip() {
  return (
    <section className="px-[--container-padding-x] py-[--section-padding-y] md:py-[--section-padding-y]">
      <div className="mx-auto grid max-w-[--max-width-content] grid-cols-2 gap-y-8 md:grid-cols-4">
        {CATEGORIES.map((label, i) => (
          <div key={label} className="flex items-center gap-0">
            {i > 0 && (
              <ClipReveal direction="left" className="hidden h-12 w-[1px] bg-border md:block" />
            )}
            <FadeIn delay={i * 0.1} className="flex-1 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                {label}
              </span>
            </FadeIn>
          </div>
        ))}
      </div>
    </section>
  );
}
