"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ProcessParallaxImageProps {
  src: string;
  alt: string;
  blurDataURL?: string | null;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function ProcessParallaxImage({
  src,
  alt,
  blurDataURL,
  className = "",
  imageClassName = "",
  priority = false,
}: ProcessParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current || !innerRef.current || reduced) return;

      gsap.fromTo(
        innerRef.current,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onEnter: () => { if (innerRef.current) innerRef.current.style.willChange = "transform"; },
            onLeave: () => { if (innerRef.current) innerRef.current.style.willChange = "auto"; },
            onEnterBack: () => { if (innerRef.current) innerRef.current.style.willChange = "transform"; },
            onLeaveBack: () => { if (innerRef.current) innerRef.current.style.willChange = "auto"; },
          },
        },
      );
    },
    { scope: containerRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={innerRef} className="absolute inset-0 h-[130%] w-full -top-[15%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover ${imageClassName}`}
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL ?? undefined}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
    </div>
  );
}
