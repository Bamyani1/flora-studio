"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { navOverlayOpen, navOverlayClose } from "@/lib/animations";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/navigation";
import { TransitionLink } from "./TransitionLink";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useUIStore } from "@/stores/ui-store";

export function MobileMenu() {
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

    if (menuOpen) {
      // Lock scroll
      lenis?.stop();

      // Show container
      gsap.set(containerRef.current, { autoAlpha: 1, pointerEvents: "auto" });

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

      // Backdrop fade out
      tl.to(backdropRef.current, navOverlayClose.backdrop.to, navOverlayClose.backdrop.to.delay);
    }
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
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className="fixed inset-0 z-50"
      style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
    >
      {/* Backdrop */}
      <div ref={backdropRef} className="absolute inset-0 bg-overlay" style={{ opacity: 0 }} />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-between px-[--container-padding-x] py-[--header-height]">
        {/* Wordmark */}
        <div className="font-display text-2xl tracking-[--tracking-hero] text-text-heading">
          BAMYAN
        </div>

        {/* Nav items */}
        <nav ref={menuItemsRef} className="flex flex-col items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="menu-item-text font-display text-4xl text-text-heading"
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        {/* Social links */}
        <div className="flex gap-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
