"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { imageReveal } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ImageRevealProps {
  children: React.ReactNode;
  overlayColor?: string;
  className?: string;
}

export function ImageReveal({
  children,
  overlayColor = imageReveal.overlayColor,
  className,
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current || !overlayRef.current || !imageWrapRef.current) return;

      if (reduced) {
        gsap.set(overlayRef.current, { scaleX: 0 });
        gsap.set(imageWrapRef.current, { scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          ...imageReveal.scrollTrigger,
        },
      });

      tl.fromTo(overlayRef.current, imageReveal.overlay.from, imageReveal.overlay.to);
      tl.fromTo(imageWrapRef.current, imageReveal.image.from, imageReveal.image.to, 0);
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <div ref={imageWrapRef} style={{ scale: reduced ? 1 : 1.3 }}>
        {children}
      </div>
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor, transformOrigin: "left center" }}
        aria-hidden="true"
      />
    </div>
  );
}
