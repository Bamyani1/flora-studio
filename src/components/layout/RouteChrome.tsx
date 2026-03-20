"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { TransitionOverlay } from "./TransitionOverlay";

export function RouteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneProcessRoute = pathname === "/process";

  return (
    <>
      <Header />
      <MobileMenu />
      {children}
      {!isStandaloneProcessRoute && <Footer />}
      {!isStandaloneProcessRoute && <BackToTop />}
      <TransitionOverlay />
    </>
  );
}
