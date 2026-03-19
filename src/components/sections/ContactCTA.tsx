import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { MagneticButton } from "@/components/animations/MagneticButton";

export function ContactCTA() {
  return (
    <section className="flex flex-col items-center gap-8 px-[--container-padding-x] py-[--section-padding-y] text-center">
      <TextReveal variant="lines" as="h2" className="font-display text-3xl text-text-heading md:text-[length:var(--text-5xl)]">
        Let&apos;s work together
      </TextReveal>

      <FadeIn delay={0.2}>
        <MagneticButton as="a" href="mailto:hello@bamyanstoryworks.com" className="inline-block font-body text-lg text-muted transition-colors hover:text-text">
          hello@bamyanstoryworks.com
        </MagneticButton>
      </FadeIn>
    </section>
  );
}
