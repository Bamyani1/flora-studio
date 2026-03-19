"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { NAV_ITEMS } from "@/lib/navigation";
import { TransitionLink } from "./TransitionLink";
import { useUIStore } from "@/stores/ui-store";

export function Header({ className }: { className?: string }) {
  const headerRef = useRef<HTMLElement>(null);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  useGSAP(
    () => {
      if (!headerRef.current) return;

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "100vh top",
        onEnter: () => headerRef.current?.classList.add("header-scrolled"),
        onLeaveBack: () => headerRef.current?.classList.remove("header-scrolled"),
      });
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className={[
        "fixed top-0 left-0 z-40 flex h-[--header-height] w-full items-center justify-between px-[--container-padding-x] transition-[background-color,backdrop-filter] duration-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <TransitionLink
        href="/"
        className="font-display text-2xl tracking-[--tracking-hero] text-text-heading"
      >
        BAMYAN
      </TransitionLink>

      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
        {NAV_ITEMS.map((item) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className="nav-link relative text-sm uppercase tracking-wider text-muted transition-colors hover:text-text"
          >
            {item.label}
          </TransitionLink>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span className="block h-[2px] w-6 bg-text transition-transform" />
        <span className="block h-[2px] w-6 bg-text transition-opacity" />
        <span className="block h-[2px] w-6 bg-text transition-transform" />
      </button>
    </header>
  );
}
