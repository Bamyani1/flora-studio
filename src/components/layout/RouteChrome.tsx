"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { TransitionOverlay } from "./TransitionOverlay";

export function RouteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isStandaloneProcessRoute = pathname === "/process";
  const hideFooter = isHomePage || isStandaloneProcessRoute;

  return (
    <>
      <Header />
      <MobileMenu />
      {children}
      {!hideFooter && <Footer />}
      {!hideFooter && <BackToTop />}
      <TransitionOverlay />
    </>
  );
}
