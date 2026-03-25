"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { landingHeaderEntrance, headerShrink } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HEADER_NAV_ITEMS, isNavItemActive } from "@/lib/navigation";
import { TransitionLink } from "./TransitionLink";
import { HeaderContactAction } from "./HeaderContactAction";
import { useUIStore } from "@/stores/ui-store";
import { ThreeThreadsMark, type ThreeThreadsMarkHandle } from "@/components/ui/ThreeThreadsMark";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<ThreeThreadsMarkHandle>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const isHomePage = pathname === "/";
  const isContactPage = pathname === "/contact";

  // Homepage entrance animation
  useGSAP(() => {
    if (!headerRef.current) return;

    if (!isHomePage || reducedMotion) {
      gsap.set(headerRef.current, { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(headerRef.current, landingHeaderEntrance.from, landingHeaderEntrance.to);
  }, [reducedMotion, isHomePage]);

  // Scroll-scrub morphing — continuous interpolation over 0-150px
  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    if (reducedMotion || isContactPage) {
      gsap.set(header, {
        ...headerShrink.to,
        backdropFilter: `blur(${headerShrink.blur.to}px)`,
        webkitBackdropFilter: `blur(${headerShrink.blur.to}px)`,
      });
      return;
    }

    const blur = { value: headerShrink.blur.from };

    const tl = gsap.timeline({
      scrollTrigger: {
        ...headerShrink.scrollTrigger,
        onUpdate: () => {
          header.style.backdropFilter = `blur(${blur.value}px)`;
          (
            header.style as CSSStyleDeclaration & { webkitBackdropFilter: string }
          ).webkitBackdropFilter = `blur(${blur.value}px)`;
        },
      },
    });

    // Header: height, padding, background, border, shadow, borderRadius
    tl.fromTo(header, headerShrink.from, { ...headerShrink.to, ease: "none" }, 0);

    // Blur via proxy object
    tl.fromTo(
      blur,
      { value: headerShrink.blur.from },
      { value: headerShrink.blur.to, ease: "none" },
      0,
    );

    // Desktop-only: logo, width, opacity, logo morph
    const logo = logoRef.current;
    const icon = iconRef.current?.root;
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": () => {
        if (logo) {
          tl.fromTo(logo, headerShrink.logo.from, { ...headerShrink.logo.to, ease: "none" }, 0);
          // Crossfade: text fades out
          tl.fromTo(
            logo,
            headerShrink.logoMorph.text.from,
            { ...headerShrink.logoMorph.text.to, ease: "none" },
            0,
          );
        }
        if (icon) {
          // Crossfade: icon fades in
          tl.fromTo(
            icon,
            headerShrink.logoMorph.icon.from,
            { ...headerShrink.logoMorph.icon.to, ease: "none" },
            0,
          );
        }
      },
    });
  }, [reducedMotion, isContactPage]);

  // Contact page: set logo to compact morph state (icon visible, text hidden)
  useGSAP(() => {
    if (!isContactPage) return;
    const logo = logoRef.current;
    const icon = iconRef.current?.root;
    if (logo) gsap.set(logo, { ...headerShrink.logoMorph.text.to });
    if (icon) gsap.set(icon, { ...headerShrink.logoMorph.icon.to });
  }, [isContactPage]);

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center pointer-events-none">
      <header
        ref={headerRef}
        className="w-full border-b px-6 md:px-12 flex items-center justify-between pointer-events-auto"
        style={{
          visibility: isHomePage ? "hidden" : undefined,
          height: "5rem",
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
          backgroundColor: "#111210",
          borderColor: "rgba(255,255,255,0.15)",
          borderRadius: "0px",
        }}
      >
        {/* Left nav — desktop only */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8 w-1/3">
          {HEADER_NAV_ITEMS.map((item) => (
            <TransitionLink key={item.href} href={item.href} className="relative group">
              <span
                className={`text-[10px] font-label uppercase tracking-[0.2em] transition-colors duration-500 ${
                  isNavItemActive(pathname, item.href)
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`absolute -bottom-2 left-0 w-full h-[1px] bg-white transition-transform duration-500 origin-left ${
                  isNavItemActive(pathname, item.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </TransitionLink>
          ))}
        </nav>

        {/* Center logo — wordmark crossfades to aperture icon on scroll */}
        <div className="w-1/2 flex justify-start md:w-1/3 md:justify-center">
          <TransitionLink href="/" className="relative flex items-center justify-center">
            <span
              ref={logoRef}
              className="text-lg md:text-2xl font-headline uppercase tracking-[0.3em] font-light whitespace-nowrap text-primary"
            >
              SAFFRON STUDIOS
            </span>
            <ThreeThreadsMark
              ref={iconRef}
              size={28}
              className="absolute text-primary"
              style={{ visibility: "hidden" }}
            />
          </TransitionLink>
        </div>

        {/* Right section — desktop CTA */}
        <div className="hidden md:flex items-center justify-end w-1/3">
          <HeaderContactAction
            label="Get in touch"
            className="relative group p-[3px] bg-white font-label text-[10px] uppercase tracking-[0.2em] overflow-hidden inline-flex"
          >
            {/* Outer spinning gradient glow */}
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#a3a3a3_95%,#e5e5e5_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
            {/* Inner spinning gradient */}
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_85%,#d4d4d4_95%,#737373_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Button content */}
            <span className="relative z-10 w-full h-full bg-white text-black px-6 py-2.5 flex items-center justify-center gap-2">
              Connect
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="transform transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </HeaderContactAction>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-[10px] font-label uppercase tracking-[0.2em] text-white border border-white/20 px-4 py-1.5 hover:bg-white hover:text-black transition-colors"
          onClick={() => useUIStore.getState().setMenuOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </header>
    </div>
  );
}
