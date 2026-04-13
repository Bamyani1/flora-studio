"use client";

import { useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { navOverlayOpen, navOverlayClose } from "@/lib/animations";
import { NAV_CTA, PRIMARY_NAV_ITEMS, isNavItemActive } from "@/lib/navigation";
import type { SocialLink } from "@/types/content";
import { TransitionLink } from "./TransitionLink";
import { HeaderContactAction } from "./HeaderContactAction";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useUIStore } from "@/stores/ui-store";
import { FloraStudioLogo } from "@/components/ui/FloraStudioLogo";

export function MobileMenu({ socialLinks }: { socialLinks: SocialLink[] }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const splitInstancesRef = useRef<InstanceType<typeof SplitText>[]>([]);

  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const lenis = useLenis();

  useFocusTrap(containerRef, menuOpen);

  // SplitText setup
  useGSAP(
    () => {
      if (!menuItemsRef.current) return;

      const items = menuItemsRef.current.querySelectorAll<HTMLElement>(".menu-item-text");
      splitInstancesRef.current = Array.from(items).map(
        (el) =>
          new SplitText(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
          }),
      );

      // Set initial hidden state
      splitInstancesRef.current.forEach((split) => {
        gsap.set(split.lines, { yPercent: 100 });
      });

      return () => {
        splitInstancesRef.current.forEach((s) => s.revert());
        splitInstancesRef.current = [];
      };
    },
    { scope: containerRef },
  );

  // Open / close animations
  useEffect(() => {
    if (!containerRef.current || !backdropRef.current) return;

    const ctx = gsap.context(() => {
      if (menuOpen) {
        // Lock scroll
        lenis?.stop();

        // Show container
        gsap.set(containerRef.current, { autoAlpha: 1, pointerEvents: "auto" });

        // Enable will-change for animation performance
        if (backdropRef.current) backdropRef.current.style.willChange = "transform, opacity";

        const tl = gsap.timeline();

        // Backdrop fade in
        tl.fromTo(backdropRef.current, navOverlayOpen.backdrop.from, navOverlayOpen.backdrop.to);

        // Menu items reveal
        splitInstancesRef.current.forEach((split, i) => {
          tl.to(
            split.lines,
            {
              ...navOverlayOpen.menuItems.to,
            },
            navOverlayOpen.menuItems.delay! + i * 0.08,
          );
        });
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, { autoAlpha: 0, pointerEvents: "none" });
            }
            // Reset will-change
            if (backdropRef.current) backdropRef.current.style.willChange = "auto";
            // Unlock scroll
            lenis?.start();
          },
        });

        // Menu items slide up
        splitInstancesRef.current.forEach((split, i) => {
          tl.to(
            split.lines,
            {
              ...navOverlayClose.menuItems.to,
            },
            i * 0.04,
          );
        });

        // Backdrop fade out — extract delay as timeline position, not tween delay
        const { delay: backdropPosition, ...backdropTo } = navOverlayClose.backdrop.to;
        tl.to(backdropRef.current, backdropTo, backdropPosition);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [menuOpen, lenis]);

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen, setMenuOpen]);

  const handleLinkClick = useCallback(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  return (
    <div
      ref={containerRef}
      data-mobile-menu
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className="fixed inset-0 z-50"
      style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-background/95 backdrop-blur-xl"
        style={{ opacity: 0 }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between px-[var(--container-padding-x)] py-[var(--header-height)]">
        <div className="flex items-center justify-between">
          <TransitionLink
            href="/"
            onClick={handleLinkClick}
            aria-label="Flora Studio"
            className="text-[var(--color-header-link-active)]"
          >
            <FloraStudioLogo width={140} />
          </TransitionLink>

          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="block h-[2px] w-6 translate-y-[7px] rotate-45 bg-[var(--color-header-link-active)]" />
            <span className="block h-[2px] w-6 opacity-0 bg-[var(--color-header-link-active)]" />
            <span className="block h-[2px] w-6 -translate-y-[7px] -rotate-45 bg-[var(--color-header-link-active)]" />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <nav ref={menuItemsRef} className="flex flex-col items-center gap-6">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                aria-current={isNavItemActive(pathname, item.href) ? "page" : undefined}
                className={`menu-item-text group relative font-display text-4xl uppercase tracking-[0.06em] transition-colors ${
                  isNavItemActive(pathname, item.href)
                    ? "text-[var(--color-header-link-active)]"
                    : "text-[var(--color-header-link-muted)] hover:text-[var(--color-header-cta-bg)]"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-[1px] w-full origin-left bg-[var(--color-header-cta-bg)] transition-transform duration-500 ease-out ${
                    isNavItemActive(pathname, item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </TransitionLink>
            ))}
          </nav>

          <HeaderContactAction
            label={NAV_CTA.label}
            onBeforeAction={handleLinkClick}
            className="mt-12 inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded bg-gradient-to-br from-[var(--color-header-cta-bg)] to-[var(--color-header-cta-bg-hover)] px-8 py-4 font-label text-xs uppercase tracking-[0.2em] text-[var(--color-header-cta-text)] transition-transform hover:scale-[1.02]"
          />
        </div>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              onClick={handleLinkClick}
              className="font-label text-[10px] uppercase tracking-[0.15em] text-[var(--color-header-link-muted)] transition-colors hover:text-[var(--color-header-link-active)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
