"use client";

import { m, useScroll } from "motion/react";

export function ProcessScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <m.div
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-[var(--process-primary)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
