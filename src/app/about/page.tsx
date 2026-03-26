"use client";

import Image from "next/image";
import { ChevronRight, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { personJsonLd } from "@/lib/metadata";

const TEAM_MEMBERS = [
  {
    role: "Photographer & Designer",
    name: "Mostafa Bamyani",
    img: "/images/portrait.jpg",
  },
  {
    role: "Photographer",
    name: "Murtaza Anwari",
    img: "/images/process/03.jpg",
  },
  {
    role: "Photographer",
    name: "Enayatullah Anwari",
    img: "/images/process/02.jpg",
  },
];

function StaggeredText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;

      if (reduced) {
        gsap.set(ref.current, { autoAlpha: 1 });
        return;
      }

      const split = new SplitText(ref.current, { type: "words", mask: "words" });

      gsap.fromTo(
        split.words,
        { yPercent: 120, opacity: 0, rotation: 5 },
        {
          yPercent: 0,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          ...withWillChange(),
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );

      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div ref={ref} className={className}>
      {text}
    </div>
  );
}

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const defaultImageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Team image crossfade (replaces AnimatePresence)
  const prevMember = useRef<number | null>(null);
  useEffect(() => {
    if (reduced) return;

    // Fade out previous
    if (prevMember.current !== null && imageRefs.current[prevMember.current]) {
      gsap.to(imageRefs.current[prevMember.current], {
        opacity: 0,
        scale: 1.03,
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else if (prevMember.current === null && defaultImageRef.current) {
      gsap.to(defaultImageRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    // Fade in current
    if (hoveredMember !== null && imageRefs.current[hoveredMember]) {
      gsap.fromTo(
        imageRefs.current[hoveredMember],
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" },
      );
    } else if (hoveredMember === null && defaultImageRef.current) {
      gsap.fromTo(
        defaultImageRef.current,
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" },
      );
    }

    prevMember.current = hoveredMember;
  }, [hoveredMember, reduced]);

  useGSAP(
    () => {
      if (!pageRef.current) return;

      if (reduced) {
        const allElements = pageRef.current.querySelectorAll("[data-about-animate]");
        gsap.set(allElements, { autoAlpha: 1, y: 0, x: 0, scale: 1, filter: "none" });
        return;
      }

      const elements = pageRef.current.querySelectorAll("[data-about-animate]");
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const animType = htmlEl.dataset.aboutAnimate;

        switch (animType) {
          case "hero-divider":
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, width: 0 },
              { autoAlpha: 1, width: "100%", duration: 1.5, ease: "power2.inOut" },
            );
            break;

          case "blur-in":
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, filter: "blur(10px)" },
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 1.5,
                delay: 0.8,
                ease: "power3.out",
                ...withWillChange("opacity, filter"),
              },
            );
            break;

          case "hero-subtitle":
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                delay: 0.9,
                ease: "power3.out",
                ...withWillChange(),
              },
            );
            break;

          case "bg-text": {
            const targetOpacity = htmlEl.dataset.targetOpacity ?? "0.03";
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, scale: parseFloat(htmlEl.dataset.fromScale ?? "0.9") },
              {
                autoAlpha: parseFloat(targetOpacity),
                scale: 1,
                duration: parseFloat(htmlEl.dataset.duration ?? "2"),
                ease: "power2.out",
                scrollTrigger: {
                  trigger: htmlEl,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              },
            );
            break;
          }

          case "fade-up": {
            const delay = parseFloat(htmlEl.dataset.delay ?? "0");
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, y: parseFloat(htmlEl.dataset.y ?? "20") },
              {
                autoAlpha: 1,
                y: 0,
                duration: parseFloat(htmlEl.dataset.duration ?? "1"),
                delay,
                ease: "power3.out",
                ...withWillChange(),
                scrollTrigger: htmlEl.dataset.noScroll
                  ? undefined
                  : { trigger: htmlEl, start: "top 85%", toggleActions: "play none none none" },
              },
            );
            break;
          }

          case "fade-left":
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, x: -30 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
                ...withWillChange(),
                scrollTrigger: {
                  trigger: htmlEl,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              },
            );
            break;

          case "team-item": {
            const staggerDelay = parseFloat(htmlEl.dataset.delay ?? "0");
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                delay: staggerDelay,
                ease: "power3.out",
                ...withWillChange(),
                scrollTrigger: {
                  trigger: htmlEl,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              },
            );
            break;
          }

          case "process-image":
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, scale: 0.95, filter: "brightness(0.5)" },
              {
                autoAlpha: 1,
                scale: 1,
                filter: "brightness(1)",
                duration: 1.5,
                ease: "power2.out",
                ...withWillChange("opacity, transform, filter"),
                scrollTrigger: {
                  trigger: htmlEl,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              },
            );
            break;

          case "letter-spacing":
            gsap.fromTo(
              htmlEl,
              { autoAlpha: 0, letterSpacing: "0em" },
              {
                autoAlpha: 1,
                letterSpacing: "0.8em",
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: htmlEl,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              },
            );
            break;

          default:
            break;
        }
      });
    },
    { scope: pageRef, dependencies: [reduced] },
  );

  // Safe JSON-LD content from our own metadata function
  const jsonLdContent = JSON.stringify(personJsonLd());

  return (
    <div ref={pageRef}>
      <main id="main-content" className="min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdContent }} />

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 film-reel-border overflow-hidden">
          <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
          <div className="max-w-screen-xl w-full flex flex-col items-center text-center relative z-10">
            <div
              data-about-animate="hero-divider"
              className="flex items-center justify-center gap-4 mb-10"
            >
              <span className="w-12 h-px bg-primary/40"></span>
              <span className="font-label uppercase tracking-[0.5em] text-primary text-[10px]">
                The Studio
              </span>
              <span className="w-12 h-px bg-primary/40"></span>
            </div>

            <h1 className="font-display text-5xl md:text-[8rem] text-on-surface leading-[0.9] tracking-tighter mb-10">
              <StaggeredText text="Who We" />
              <span data-about-animate="blur-in" className="italic text-primary block mt-4">
                Are.
              </span>
            </h1>

            <p
              data-about-animate="hero-subtitle"
              className="font-body text-xl md:text-2xl text-on-surface-variant/60 max-w-2xl leading-relaxed font-light"
            >
              A photography studio built on patience, precision, and the belief that everyone has
              something worth photographing.
            </p>
          </div>
        </section>

        <div className="w-full h-1 bg-surface-container-lowest"></div>
        <div className="scene-divider"></div>

        {/* Manifesto */}
        <section className="py-48 md:py-64 px-6 bg-surface-container-lowest relative overflow-hidden flex flex-col items-center justify-center">
          <div
            data-about-animate="bg-text"
            data-target-opacity="0.03"
            data-from-scale="0.9"
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <span className="font-display text-[30vw] select-none italic text-on-surface">
              Manifesto
            </span>
          </div>

          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
            <div data-about-animate="fade-up" className="flex items-center gap-6 mb-24">
              <span className="w-12 h-[1px] bg-primary/40"></span>
              <span className="font-label uppercase tracking-[0.5em] text-primary/60 text-[10px]">
                Our Approach
              </span>
              <span className="w-12 h-[1px] bg-primary/40"></span>
            </div>

            <blockquote className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.2] text-center text-on-surface max-w-5xl mx-auto relative z-10 tracking-tight">
              <div data-about-animate="fade-up" data-y="40" data-duration="1.2">
                We show up prepared, stay present, and make every{" "}
                <span className="text-primary italic font-light">frame</span> count. No shortcuts,
                no templates — just intention behind everything we do.
              </div>
            </blockquote>

            <div
              data-about-animate="fade-up"
              data-delay="0.6"
              className="mt-24 flex flex-col items-center gap-6"
            >
              <span className="font-label uppercase tracking-[0.4em] text-xs text-on-surface-variant/60">
                Our Approach
              </span>
              <div className="flex gap-2">
                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              </div>
            </div>
          </div>
        </section>

        <div className="scene-divider"></div>
        <div className="w-full h-1 bg-surface-container-lowest"></div>

        {/* Team */}
        <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-surface film-reel-border relative">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-20">
            {/* Left Column: Sticky Image & Header */}
            <div className="lg:sticky lg:top-32 h-fit flex flex-col gap-12">
              <div data-about-animate="fade-left">
                <span className="font-label uppercase tracking-[0.5em] text-primary/60 text-[10px] block mb-6">
                  The People
                </span>
                <h2 className="font-display text-5xl md:text-7xl tracking-tighter mb-6 text-on-surface">
                  The Team
                </h2>
                <p className="font-body text-on-surface-variant/60 leading-relaxed max-w-md text-base font-light">
                  Three photographers with a shared commitment to craft and a habit of paying close
                  attention.
                </p>
              </div>

              {/* Dynamic Image Container — stacked crossfade */}
              <div className="hidden lg:block w-full aspect-[4/5] relative rounded-sm overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-2xl">
                <div
                  ref={defaultImageRef}
                  className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest"
                >
                  <Camera className="w-12 h-12 text-outline-variant/20" />
                </div>

                {TEAM_MEMBERS.map((member, index) => (
                  <div
                    key={member.name}
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    className="absolute inset-0"
                    style={{ opacity: 0 }}
                  >
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 50vw, 0px"
                      className="object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive List */}
            <div className="flex flex-col justify-center pt-12 lg:pt-32">
              <div className="border-t border-outline-variant/20">
                {TEAM_MEMBERS.map((member, index) => (
                  <div
                    key={member.name}
                    data-about-animate="team-item"
                    data-delay={String(index * 0.1)}
                    onMouseEnter={() => setHoveredMember(index)}
                    onMouseLeave={() => setHoveredMember(null)}
                    className="group border-b border-outline-variant/20 py-10 md:py-16 cursor-pointer flex flex-col gap-6"
                  >
                    <div className="flex items-start md:items-center justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                        <span className="font-mono text-primary/40 text-sm group-hover:text-primary transition-colors duration-500">
                          0{index + 1}
                        </span>
                        <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-on-surface group-hover:text-white transition-colors duration-500 tracking-tight">
                          {member.name}
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500 shrink-0">
                        <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-on-primary transition-colors duration-500" />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 md:pl-16">
                      <span className="font-label uppercase tracking-[0.3em] text-[10px] md:text-xs text-primary transition-colors duration-500">
                        {member.role}
                      </span>
                    </div>

                    {/* Mobile Image */}
                    <div className="lg:hidden w-full aspect-[4/5] relative mt-8 rounded-sm overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        sizes="(max-width: 1023px) 100vw, 0px"
                        className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="scene-divider"></div>
        <div className="w-full h-1 bg-surface-container-lowest"></div>

        {/* Process */}
        <section className="py-64 px-12 bg-surface-container-lowest">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <div className="order-2 md:order-1 space-y-20">
              <div className="space-y-8">
                <div data-about-animate="fade-left" className="flex items-center gap-4">
                  <span className="font-label uppercase tracking-[0.5em] text-primary text-[10px]">
                    How It Works
                  </span>
                </div>
                <h2 className="font-display italic text-primary text-5xl md:text-7xl block tracking-tighter">
                  <StaggeredText text="How we work." />
                </h2>
                <p
                  data-about-animate="fade-up"
                  data-delay="0.3"
                  className="font-body text-2xl text-on-surface-variant font-light leading-relaxed max-w-xl"
                >
                  We grade and refine every image by hand to get the tone, mood, and consistency
                  right — not filtered, not batch-processed, not rushed.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 border-t border-outline-variant/10 pt-16">
                <div
                  data-about-animate="fade-up"
                  data-y="30"
                  data-delay="0.4"
                  className="space-y-6"
                >
                  <h4 className="font-label uppercase tracking-widest text-primary text-xs font-bold">
                    Selection
                  </h4>
                  <p className="font-body text-sm text-on-surface-variant/50 leading-loose">
                    From hundreds of frames, we keep only the ones where light, expression, and
                    composition come together.
                  </p>
                </div>
                <div
                  data-about-animate="fade-up"
                  data-y="30"
                  data-delay="0.6"
                  className="space-y-6"
                >
                  <h4 className="font-label uppercase tracking-widest text-primary text-xs font-bold">
                    Refinement
                  </h4>
                  <p className="font-body text-sm text-on-surface-variant/50 leading-loose">
                    Each image is individually graded. We build a visual language specific to your
                    project.
                  </p>
                </div>
              </div>
            </div>
            <div
              data-about-animate="process-image"
              className="order-1 md:order-2 aspect-square relative group overflow-hidden"
            >
              <Image
                alt="Studio Interior"
                className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-90 transition-all duration-[2s] scale-110 group-hover:scale-100 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8-vfQCZEqIx1r12WDFxwKuTM4vqEbXPUi1I13AGkEb1NVd05Gz8nQoDf8EOvRK16q72r9ssnVRcaGRiZSEllnkWBiWsJVO1sEEFr9xBqk9TPuebv0-GjqSj-X2l2fdtksi15YGuSDW0n_JQFP8tGeyQ9EMZhf2cZMKlpyhWh2ejN19eaXluDjkFseShyLy1qw4NdgABQfxJ4L3CMWVpDaMIMgnEVvqai4Q9zGp1l-BBPCYRxGt2MfNJdOvTJPoQgJ8FOw0Li60vQ"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[24px] border-surface-container-lowest mix-blend-multiply pointer-events-none transition-all duration-1000 group-hover:border-[12px]"></div>
            </div>
          </div>
        </section>

        <div className="scene-divider"></div>
        <div className="w-full h-1 bg-surface-container-lowest"></div>

        {/* CTA Section */}
        <section className="py-72 px-12 bg-surface text-center film-reel-border relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto space-y-16">
            <span
              data-about-animate="letter-spacing"
              className="font-label uppercase text-primary/40 text-[11px] block"
            >
              What&apos;s next
            </span>
            <h2 className="font-display text-6xl md:text-[9rem] tracking-tighter text-on-surface leading-[0.85]">
              <StaggeredText text="Let's make" />
              <span
                data-about-animate="fade-up"
                data-delay="0.8"
                className="italic text-primary block mt-4"
              >
                something.
              </span>
            </h2>
            <div data-about-animate="fade-up" data-delay="1.5" className="pt-12">
              <Button
                as={TransitionLink}
                href="/contact"
                variant="outline-accent"
                size="sm"
                className="gap-2 font-semibold"
              >
                Get in touch <span aria-hidden="true">&rarr;</span>
              </Button>
            </div>
          </div>
          <div
            data-about-animate="bg-text"
            data-target-opacity="0.03"
            data-from-scale="0.8"
            data-duration="3"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <span className="font-display text-[35vw] tracking-tighter">FIN</span>
          </div>
        </section>
      </main>
    </div>
  );
}
