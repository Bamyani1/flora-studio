"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RevealText } from "./RevealText";

export function LandingCuratorsNotes() {
  const labelRef = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    if (!labelRef.current || !dividerRef.current) return;

    if (reducedMotion) {
      gsap.set(labelRef.current, { autoAlpha: 1 });
      gsap.set(dividerRef.current, { autoAlpha: 1, scaleX: 1 });
      return;
    }

    gsap.fromTo(
      labelRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1,
        ...withWillChange(),
        scrollTrigger: {
          trigger: labelRef.current,
          start: "top 90%",
        },
      },
    );

    gsap.fromTo(
      dividerRef.current,
      { scaleX: 0, autoAlpha: 0 },
      {
        scaleX: 1,
        autoAlpha: 1,
        duration: 1.5,
        ease: "power3.out",
        ...withWillChange(),
        scrollTrigger: {
          trigger: dividerRef.current,
          start: "top 90%",
        },
      },
    );
  }, [reducedMotion]);

  return (
    <section className="py-32 md:py-60 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none"></div>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span
          ref={labelRef}
          className="font-label text-[10px] tracking-[0.6em] text-white/40 mb-16 block"
        >
          CURATOR&apos;S NOTES
        </span>

        <blockquote className="font-headline text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] italic mb-20 flex flex-wrap justify-center gap-x-4 gap-y-2">
          <RevealText text={'"Photography'} delay={0.1} />
          <RevealText text="is" delay={0.2} />
          <RevealText text="the" delay={0.3} />
          <RevealText text="only" delay={0.4} />
          <RevealText text="language" delay={0.5} />
          <RevealText text="that" delay={0.6} />
          <RevealText text="can" delay={0.7} />
          <RevealText text="be" delay={0.8} />
          <RevealText text="understood" delay={0.9} />
          <RevealText text="anywhere" delay={1.0} />
          <RevealText text="in" delay={1.1} />
          <RevealText text="the" delay={1.2} />
          <RevealText text={'world."'} delay={1.3} />
        </blockquote>

        <div
          ref={dividerRef}
          className="w-32 h-px bg-[#e9c176] mx-auto opacity-50 origin-center"
        ></div>
      </div>
    </section>
  );
}
