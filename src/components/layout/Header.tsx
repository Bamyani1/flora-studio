"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { focusBracket, headerShrink, landingHeaderEntrance } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HEADER_NAV_ITEMS, isNavItemActive } from "@/lib/navigation";
import { TransitionLink } from "./TransitionLink";
import { HeaderContactAction } from "./HeaderContactAction";
import { useUIStore } from "@/stores/ui-store";
import { FloraStudioLogo, type FloraStudioLogoHandle } from "@/components/ui/FloraStudioLogo";
import styles from "./Header.module.css";

type Lock = "settle" | "hunt" | "confirm" | "instant";

function BracketCorners() {
  return (
    <>
      <span />
      <span />
      <span />
      <span />
    </>
  );
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<FloraStudioLogoHandle>(null);
  const navRef = useRef<HTMLElement>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const bracketTargetRef = useRef<HTMLElement | null>(null);
  const lastPathRef = useRef<string | null>(null);
  const confirmPendingRef = useRef(false);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const menuOpen = useUIStore((s) => s.menuOpen);
  const transitionPhase = useUIStore((s) => s.transitionPhase);
  const isHomePage = pathname === "/";

  // Homepage entrance animation
  useGSAP(() => {
    if (!headerRef.current) return;

    if (!isHomePage || reducedMotion) {
      gsap.set(headerRef.current, { autoAlpha: 1 });
      return;
    }

    gsap.fromTo(headerRef.current, landingHeaderEntrance.from, landingHeaderEntrance.to);
  }, [reducedMotion, isHomePage]);

  // Scroll-scrub compaction over 0-150px; the scrim deepens off the hero photo
  useGSAP(() => {
    const header = headerRef.current;
    const scrim = scrimRef.current;
    if (!header || !scrim) return;

    if (reducedMotion) {
      gsap.set(header, headerShrink.to);
      gsap.set(scrim, headerShrink.scrim.to);
      return;
    }

    const tl = gsap.timeline({ scrollTrigger: headerShrink.scrollTrigger });
    tl.fromTo(header, headerShrink.from, { ...headerShrink.to, ease: "none" }, 0);
    tl.fromTo(scrim, headerShrink.scrim.from, { ...headerShrink.scrim.to, ease: "none" }, 0);

    // Desktop-only: logo shrink
    const logo = logoRef.current?.root;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      if (logo)
        tl.fromTo(logo, headerShrink.logo.from, { ...headerShrink.logo.to, ease: "none" }, 0);
    });
  }, [reducedMotion]);

  const activeLink = useCallback(
    () => navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? null,
    [],
  );

  // Move the AF bracket onto a nav link (or hide it when nothing is in focus)
  const focusOn = useCallback(
    (target: HTMLElement | null, lock: Lock) => {
      const nav = navRef.current;
      const bracket = bracketRef.current;
      if (!nav || !bracket) return;
      if (target === bracketTargetRef.current && lock !== "confirm" && lock !== "instant") return;
      bracketTargetRef.current = target;

      gsap.killTweensOf(bracket);

      if (!target) {
        gsap.to(bracket, { autoAlpha: 0, duration: reducedMotion || lock === "instant" ? 0 : 0.2 });
        return;
      }

      const n = nav.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      const box = { x: t.left - n.left, y: t.top - n.top, width: t.width, height: t.height };
      bracket.dataset.state = target.getAttribute("aria-current") ? "locked" : "hunting";

      if (reducedMotion || lock === "instant") {
        gsap.set(bracket, { ...box, autoAlpha: 1 });
        return;
      }

      const { overshoot, lock: snap, confirm, rackFocus } = focusBracket;
      const tl = gsap.timeline();
      tl.to(bracket, {
        x: box.x - overshoot.x,
        y: box.y - overshoot.y,
        width: box.width + overshoot.x * 2,
        height: box.height + overshoot.y * 2,
        autoAlpha: 1,
        duration: lock === "hunt" ? overshoot.hunt : overshoot.settle,
        ease: overshoot.ease,
      }).to(bracket, { ...box, ...snap });
      if (lock === "confirm") tl.to(bracket, confirm);

      target
        .querySelector("span")
        ?.animate([{ filter: `blur(${rackFocus.blur}px)` }, { filter: "blur(0px)" }], {
          duration: rackFocus.duration,
          easing: rackFocus.easing,
        });
    },
    [reducedMotion],
  );

  // First paint settles on the current page; a route change is confirmed once
  // the transition shutter lifts, so the blink isn't hidden behind it
  useLayoutEffect(() => {
    if (lastPathRef.current === null) {
      lastPathRef.current = pathname;
      focusOn(activeLink(), "settle");
      return;
    }
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    confirmPendingRef.current = true;
  }, [pathname, focusOn, activeLink]);

  useEffect(() => {
    if (transitionPhase !== "idle" || !confirmPendingRef.current) return;
    confirmPendingRef.current = false;
    focusOn(activeLink(), "confirm");
  }, [transitionPhase, pathname, focusOn, activeLink]);

  useEffect(() => {
    const realign = () => focusOn(bracketTargetRef.current ?? activeLink(), "instant");
    window.addEventListener("resize", realign);
    document.fonts?.ready.then(realign).catch(() => {});
    return () => window.removeEventListener("resize", realign);
  }, [focusOn, activeLink]);

  return (
    <div className="fixed top-0 w-full z-50 pointer-events-none">
      <header
        ref={headerRef}
        data-site-header
        className="relative flex h-[var(--header-height)] items-center px-6 md:px-12 font-body pointer-events-auto"
        style={{ visibility: isHomePage ? "hidden" : undefined }}
      >
        <div ref={scrimRef} className={`${styles.scrim} -z-10`} aria-hidden="true" />

        <TransitionLink
          href="/"
          aria-label="Flora Studio"
          className="text-[var(--color-header-link-active)] opacity-90 can-hover:hover:opacity-100 transition-opacity duration-500"
        >
          <FloraStudioLogo ref={logoRef} className="h-auto w-[140px] md:w-[156px]" />
        </TransitionLink>

        <nav
          ref={navRef}
          aria-label="Main navigation"
          onMouseLeave={() => focusOn(activeLink(), "settle")}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) focusOn(activeLink(), "settle");
          }}
          className="relative ml-auto hidden md:flex items-center gap-1"
        >
          {HEADER_NAV_ITEMS.map((item) => (
            <span
              key={item.href}
              onMouseEnter={(e) => focusOn(e.currentTarget.querySelector("a"), "hunt")}
              onFocus={(e) => focusOn(e.currentTarget.querySelector("a"), "hunt")}
            >
              {/* The bracket is the focus indicator for these links */}
              <TransitionLink
                href={item.href}
                aria-current={isNavItemActive(pathname, item.href) ? "page" : undefined}
                className="block px-4 py-2.5 text-[14px] text-[var(--color-header-link-muted)] transition-colors duration-300 focus-visible:outline-none aria-[current=page]:text-[var(--color-header-link-active)] can-hover:hover:text-[var(--color-header-link-active)]"
              >
                <span className="inline-block">{item.label}</span>
              </TransitionLink>
            </span>
          ))}
          <div ref={bracketRef} className={styles.bracket} aria-hidden="true">
            <BracketCorners />
          </div>
        </nav>

        <HeaderContactAction className="ml-8 hidden md:inline-block rounded-[2px] bg-[var(--color-header-cta-bg)] px-4 py-2 text-[13px] font-medium text-[var(--color-surface-deep)] transition-colors duration-300 can-hover:hover:bg-[var(--color-hero-gold)]">
          <span>Get in touch</span>
        </HeaderContactAction>

        {/* Mobile: a direct conversion path next to the menu — otherwise the only
            inquire route is buried behind the menu or a full page of scroll.
            Pseudo-elements grow both tap targets to ~44px without inflating the boxes. */}
        <div className="ml-auto flex items-center gap-3 md:hidden">
          <HeaderContactAction
            label="Book"
            className="relative rounded-[2px] bg-[var(--color-header-cta-bg)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-surface-deep)] before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-['']"
          />
          <button
            type="button"
            className="relative px-3 py-1.5 text-[13px] text-[var(--color-header-link-active)] before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-['']"
            onClick={() => useUIStore.getState().setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            Menu
            <span className={`${styles.bracket} ${styles.bracketStatic}`} aria-hidden="true">
              <BracketCorners />
            </span>
          </button>
        </div>
      </header>
    </div>
  );
}
