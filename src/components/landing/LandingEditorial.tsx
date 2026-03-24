"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { fadeUp, withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { CinematicImageReveal } from "./CinematicImageReveal";
import { RevealText } from "./RevealText";
import { getLocalBlur } from "@/lib/image-manifest";

export function LandingEditorial() {
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!descRef.current || !ctaRef.current) return;

    if (reducedMotion) {
      gsap.set([descRef.current, ctaRef.current], { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(
      descRef.current,
      fadeUp.from,
      {
        ...fadeUp.to,
        ...withWillChange(),
        scrollTrigger: {
          trigger: descRef.current,
          ...fadeUp.scrollTrigger,
        },
      },
    );

    gsap.fromTo(
      ctaRef.current,
      fadeUp.from,
      {
        ...fadeUp.to,
        ...withWillChange(),
        scrollTrigger: {
          trigger: ctaRef.current,
          ...fadeUp.scrollTrigger,
        },
      },
    );
  }, [reducedMotion]);

  return (
    <section className="py-32 md:py-52 px-6 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <CinematicImageReveal
          src="/images/golden-hour/hero.jpg"
          alt="Golden hour landscape photography"
          className="w-full h-[60vh] md:h-[800px] mb-24 md:mb-32"
          overlay={true}
          blurDataURL={getLocalBlur("/images/golden-hour/hero.jpg")}
        />

        <div className="max-w-4xl text-center flex flex-col items-center">
          <h2 className="font-headline text-4xl md:text-6xl text-white leading-tight mb-10">
            <RevealText text="The intersection of" />
            <br />
            <span className="italic text-white/70">
              <RevealText text="shadow" delay={0.2} />
            </span>{" "}
            <RevealText text="and" delay={0.3} />{" "}
            <span className="text-primary">
              <RevealText text="form." delay={0.4} />
            </span>
          </h2>

          <p
            ref={descRef}
            className="font-body text-white/60 text-lg md:text-xl leading-relaxed mb-16 max-w-2xl"
          >
            Our approach to visual storytelling is rooted in the philosophy of
            the &quot;Digital Gallery.&quot; Every frame is captured with
            intentionality, prioritizing the emotion of the moment over the
            noise of the modern world.
          </p>

          <div ref={ctaRef}>
            <TransitionLink
              href="/work"
              className="group relative overflow-hidden border border-white/20 px-8 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-white hover:border-white/60 transition-colors duration-500"
            >
              <span className="relative z-10">View the Collection</span>
              <div className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"></div>
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
