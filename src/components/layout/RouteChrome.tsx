"use client";

import { usePathname } from "next/navigation";
import type { SocialLink } from "@/types/content";
import { useUIStore } from "@/stores/ui-store";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { TransitionOverlay } from "./TransitionOverlay";

export function RouteChrome({
  children,
  socialLinks,
}: {
  children: React.ReactNode;
  socialLinks: SocialLink[];
}) {
  const pathname = usePathname();
  const menuOpen = useUIStore((s) => s.menuOpen);
  const isHomePage = pathname === "/";
  const isStandaloneProcessRoute = pathname === "/process";
  const hideFooter = isHomePage || isStandaloneProcessRoute;

  return (
    <>
      {/* The header must leave the tab order (inert) and fade out while the
          menu dialog is open — otherwise its wordmark/MENU button double up
          behind the overlay and keyboard focus can escape to it. */}
      <div
        inert={menuOpen || undefined}
        className={`transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`}
      >
        <Header />
      </div>
      <MobileMenu socialLinks={socialLinks} />
      <div inert={menuOpen || undefined}>
        {children}
        {!hideFooter && <Footer socialLinks={socialLinks} />}
        {!hideFooter && <BackToTop />}
      </div>
      <TransitionOverlay />
    </>
  );
}
