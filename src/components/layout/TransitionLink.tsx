"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
}

export function TransitionLink({
  href,
  children,
  className,
  onClick,
  prefetch = true,
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
    router.prefetch(href);
  }, [router, href]);

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
