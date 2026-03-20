"use client";

import Image from "next/image";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

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
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-15%", "15%"],
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div style={{ y }} className="absolute inset-0 h-[130%] w-full -top-[15%]">
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
      </m.div>
    </div>
  );
}
