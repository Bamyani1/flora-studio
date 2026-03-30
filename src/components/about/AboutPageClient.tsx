"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { withWillChange } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { SiteMedia } from "@/components/ui/SiteMedia";
import { resolveImageUrl } from "@/lib/image-url";
import type { AboutPageContent } from "@/types/content";

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

interface AboutPageClientProps {
  content: AboutPageContent;
}

export function AboutPageClient({ content }: AboutPageClientProps) {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const defaultImageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const teamMembers = content.team.members;

  const prevMember = useRef<number | null>(null);
  useEffect(() => {
    if (reduced) return;

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

  return (
    <div ref={pageRef}>
      <main id="main-content" className="min-h-screen">
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 film-reel-border overflow-hidden">
          <div className="grain-medium absolute inset-0 z-grain" aria-hidden="true" />
          <div className="max-w-screen-xl w-full flex flex-col items-center text-center relative z-10">
            <div
              data-about-animate="hero-divider"
              className="flex items-center justify-center gap-4 mb-10"
            >
              <span className="w-12 h-px bg-primary/40"></span>
              <span className="font-label uppercase tracking-[0.5em] text-primary text-[10px]">
                {content.hero.eyebrow}
              </span>
              <span className="w-12 h-px bg-primary/40"></span>
            </div>

            <h1 className="font-display text-5xl md:text-[8rem] text-on-surface leading-[0.9] tracking-tighter mb-10">
              <StaggeredText text={content.hero.titleLine1} />
              <span data-about-animate="blur-in" className="italic text-primary block mt-4">
                {content.hero.titleLine2}
              </span>
            </h1>

            <p
              data-about-animate="hero-subtitle"
              className="font-body text-xl md:text-2xl text-on-surface-variant/60 max-w-2xl leading-relaxed font-light"
            >
              {content.hero.description}
            </p>
          </div>
        </section>

        <div className="w-full h-1 bg-surface-container-lowest"></div>
        <div className="scene-divider"></div>

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
                {content.manifesto.eyebrow}
              </span>
              <span className="w-12 h-[1px] bg-primary/40"></span>
            </div>

            <blockquote className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.2] text-center text-on-surface max-w-5xl mx-auto relative z-10 tracking-tight">
              <div data-about-animate="fade-up" data-y="40" data-duration="1.2">
                {content.manifesto.quotePrefix}{" "}
                <span className="text-primary italic font-light">
                  {content.manifesto.quoteAccent}
                </span>{" "}
                {content.manifesto.quoteSuffix}
              </div>
            </blockquote>

            <div
              data-about-animate="fade-up"
              data-delay="0.6"
              className="mt-24 flex flex-col items-center gap-6"
            >
              <span className="font-label uppercase tracking-[0.4em] text-xs text-on-surface-variant/60">
                {content.manifesto.footerLabel}
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

        <section className="py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-surface film-reel-border relative">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-20">
            <div className="lg:sticky lg:top-32 h-fit flex flex-col gap-12">
              <div data-about-animate="fade-left">
                <span className="font-label uppercase tracking-[0.5em] text-primary/60 text-[10px] block mb-6">
                  {content.team.eyebrow}
                </span>
                <h2 className="font-display text-5xl md:text-7xl tracking-tighter mb-6 text-on-surface">
                  {content.team.title}
                </h2>
                <p className="font-body text-on-surface-variant/60 leading-relaxed max-w-md text-base font-light">
                  {content.team.description}
                </p>
              </div>

              <div className="hidden lg:block w-full aspect-[4/5] relative rounded-sm overflow-hidden bg-surface-container-lowest border border-outline-variant/10 shadow-2xl">
                <div
                  ref={defaultImageRef}
                  className="absolute inset-0 bg-surface-container-lowest"
                >
                  <SiteMedia alt="About team placeholder" fill className="object-cover" />
                </div>

                {teamMembers.map((member, index) => (
                  <div
                    key={member.name}
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    className="absolute inset-0"
                    style={{ opacity: 0 }}
                  >
                    <SiteMedia
                      src={resolveImageUrl(member.portrait ?? undefined)}
                      alt={member.portrait?.alt ?? `Portrait of ${member.name}`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 0px"
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center pt-12 lg:pt-32">
              <div className="border-t border-outline-variant/20">
                {teamMembers.map((member, index) => (
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

                    <div className="lg:hidden w-full aspect-[4/5] relative mt-8 rounded-sm overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
                      <SiteMedia
                        src={resolveImageUrl(member.portrait ?? undefined)}
                        alt={member.portrait?.alt ?? `Portrait of ${member.name}`}
                        fill
                        sizes="(max-width: 1023px) 100vw, 0px"
                        className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-1000"
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

        <section className="py-64 px-12 bg-surface-container-lowest">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <div className="order-2 md:order-1 space-y-20">
              <div className="space-y-8">
                <div data-about-animate="fade-left" className="flex items-center gap-4">
                  <span className="font-label uppercase tracking-[0.5em] text-primary text-[10px]">
                    {content.process.eyebrow}
                  </span>
                </div>
                <h2 className="font-display italic text-primary text-5xl md:text-7xl block tracking-tighter">
                  <StaggeredText text={content.process.title} />
                </h2>
                <p
                  data-about-animate="fade-up"
                  data-delay="0.3"
                  className="font-body text-2xl text-on-surface-variant font-light leading-relaxed max-w-xl"
                >
                  {content.process.description}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 border-t border-outline-variant/10 pt-16">
                {content.process.cards.map((card, index) => (
                  <div
                    key={card.title}
                    data-about-animate="fade-up"
                    data-y="30"
                    data-delay={String(0.4 + index * 0.2)}
                    className="space-y-6"
                  >
                    <h4 className="font-label uppercase tracking-widest text-primary text-xs font-bold">
                      {card.title}
                    </h4>
                    <p className="font-body text-sm text-on-surface-variant/50 leading-loose">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div
              data-about-animate="process-image"
              className="order-1 md:order-2 aspect-square relative group overflow-hidden"
            >
              <SiteMedia
                alt={content.process.image.alt ?? ""}
                className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-90 transition-all duration-[2s] scale-110 group-hover:scale-100 shadow-[0_0_80px_color-mix(in_srgb,black_80%,transparent)]"
                src={resolveImageUrl(content.process.image)}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 border-[24px] border-surface-container-lowest mix-blend-multiply pointer-events-none transition-all duration-1000 group-hover:border-[12px]"></div>
            </div>
          </div>
        </section>

        <div className="scene-divider"></div>
        <div className="w-full h-1 bg-surface-container-lowest"></div>

        <section className="py-72 px-12 bg-surface text-center film-reel-border relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto space-y-16">
            <span
              data-about-animate="letter-spacing"
              className="font-label uppercase text-primary/40 text-[11px] block"
            >
              {content.cta.eyebrow}
            </span>
            <h2 className="font-display text-6xl md:text-[9rem] tracking-tighter text-on-surface leading-[0.85]">
              <StaggeredText text={content.cta.titleLine1} />
              <span
                data-about-animate="fade-up"
                data-delay="0.8"
                className="italic text-primary block mt-4"
              >
                {content.cta.titleLine2}
              </span>
            </h2>
            <div data-about-animate="fade-up" data-delay="1.5" className="pt-12">
              <Button
                as={TransitionLink}
                href={content.cta.cta.href}
                variant="outline-accent"
                size="sm"
                className="gap-2 font-semibold"
              >
                {content.cta.cta.label} <span aria-hidden="true">&rarr;</span>
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
