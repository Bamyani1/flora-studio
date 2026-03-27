"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  prefetch?: boolean;
  "aria-label"?: string;
}

export function TransitionLink({
  href,
  children,
  className,
  style,
  onClick,
  prefetch = true,
  "aria-label": ariaLabel,
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const transitionPhase = useUIStore((s) => s.transitionPhase);
  const requestRouteTransition = useUIStore((s) => s.requestRouteTransition);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.();

      if (e.defaultPrevented) return;

      const isPlainLeftClick =
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey;
      const target = e.currentTarget.target;
      const bypassTransition =
        !isPlainLeftClick || (target !== "" && target !== "_self") || e.currentTarget.hasAttribute("download");

      if (bypassTransition) return;

      // Don't transition to current page
      if (href === pathname) return;

      e.preventDefault();

      if (transitionPhase !== "idle") return;

      requestRouteTransition(href);
    },
    [href, onClick, pathname, requestRouteTransition, transitionPhase],
  );

  const handleMouseEnter = useCallback(() => {
    if (prefetch === false) return;
    router.prefetch(href);
  }, [href, prefetch, router]);

  return (
    <Link
      href={href}
      className={className}
      style={style}
      aria-label={ariaLabel}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
