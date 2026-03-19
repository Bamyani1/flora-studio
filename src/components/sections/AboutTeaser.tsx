import Image from "next/image";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { ParallaxSection } from "@/components/animations/ParallaxSection";

interface AboutTeaserProps {
  bio: string;
  portraitUrl?: string | null;
  portraitBlur?: string | null;
}

export function AboutTeaser({ bio, portraitUrl, portraitBlur }: AboutTeaserProps) {
  return (
    <section className="px-[--container-padding-x] py-[--section-padding-y]">
      <div className="mx-auto grid max-w-[--max-width-content] grid-cols-1 gap-12 md:grid-cols-2 md:gap-[--grid-gap]">
        {/* Left: Portrait */}
        <ParallaxSection speed={0.08}>
          <ImageReveal className="aspect-[4/5] w-full">
            {portraitUrl ? (
              <Image
                src={portraitUrl}
                alt="Portrait"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder={portraitBlur ? "blur" : undefined}
                blurDataURL={portraitBlur ?? undefined}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-surface to-surface-elevated" />
            )}
          </ImageReveal>
        </ParallaxSection>

        {/* Right: Philosophy text */}
        <div className="flex flex-col justify-center gap-8">
          <TextReveal variant="lines" className="font-display text-2xl leading-snug text-text-heading md:text-[length:var(--text-3xl)]">
            {bio}
          </TextReveal>

          <FadeIn delay={0.3}>
            <TransitionLink
              href="/about"
              className="inline-block font-body text-lg text-primary transition-colors hover:text-text"
            >
              About me &rarr;
            </TransitionLink>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
