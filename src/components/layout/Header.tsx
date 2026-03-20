"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV_ITEMS, NAV_CTA, isNavItemActive } from "@/lib/navigation";
import { TransitionLink } from "./TransitionLink";
import { useUIStore } from "@/stores/ui-store";
import { HeaderContactAction } from "./HeaderContactAction";

export function Header({ className }: { className?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-header
      className={[
        "fixed top-0 left-0 z-40 flex h-[var(--header-height)] w-full items-center justify-between px-[var(--container-padding-x)] transition-all duration-500",
        scrolled
          ? "border-b border-[var(--color-header-border-soft)] bg-[var(--color-header-bg-strong)] shadow-2xl shadow-black/40 backdrop-blur-lg"
          : "bg-transparent",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <TransitionLink
        href="/"
        className="font-display text-[length:var(--text-logo)] font-light uppercase tracking-[var(--tracking-logo-process)] text-[var(--color-header-link-active)]"
      >
        Silk Studio
      </TransitionLink>

      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden items-center gap-10 md:flex">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className={`group relative font-display text-[length:var(--text-nav)] uppercase tracking-[var(--tracking-nav-process)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isNavItemActive(pathname, item.href)
                ? "text-[var(--color-header-link-active)]"
                : "text-[var(--color-header-link-muted)] hover:text-[var(--color-header-cta-bg)]"
            }`}
          >
            {item.label}
            <span
              className={`absolute -bottom-1 left-0 h-[1px] w-full origin-left bg-[var(--color-header-cta-bg)] transition-transform duration-500 ease-out ${
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
        className="hidden rounded bg-gradient-to-br from-[var(--color-header-cta-bg)] to-[var(--color-header-cta-bg-hover)] px-6 py-2 font-label text-xs uppercase tracking-widest text-[var(--color-header-cta-text)] transition-transform hover:scale-[1.03] md:inline-flex"
      />

      {/* Mobile hamburger */}
      <button
        type="button"
        className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <span
          className={`block h-[2px] w-6 origin-center bg-[var(--color-header-link-active)] transition-transform ${
            menuOpen ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-[var(--color-header-link-active)] transition-opacity ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 origin-center bg-[var(--color-header-link-active)] transition-transform ${
            menuOpen ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>
    </header>
  );
}
