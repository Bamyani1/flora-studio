"use client";

import { usePathname } from "next/navigation";
import type { SocialLink } from "@/types/content";
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
  const isHomePage = pathname === "/";
  const isStandaloneProcessRoute = pathname === "/process";
  const hideFooter = isHomePage || isStandaloneProcessRoute;

  return (
    <>
      <Header />
      <MobileMenu socialLinks={socialLinks} />
      {children}
      {!hideFooter && <Footer socialLinks={socialLinks} />}
      {!hideFooter && <BackToTop />}
      <TransitionOverlay />
    </>
  );
}
