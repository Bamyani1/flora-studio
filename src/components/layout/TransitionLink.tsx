"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { pageTransitionEnter, pageTransitionLeave } from "@/lib/animations";
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
  const isAnimating = useRef(false);
  const ctxRef = useRef<gsap.Context | null>(null);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const startTransition = useUIStore((s) => s.startTransition);
  const endTransition = useUIStore((s) => s.endTransition);

  const clearPendingTransition = useCallback(
    (forceEndTransition = false) => {
      if (fallbackTimeoutRef.current) {
        window.clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }

      ctxRef.current?.revert();
      ctxRef.current = null;
      isAnimating.current = false;

      if (forceEndTransition && useUIStore.getState().isTransitioning) {
        endTransition();
      }
    },
    [endTransition],
  );

  const scheduleFailsafeCleanup = useCallback(() => {
    if (fallbackTimeoutRef.current) {
      window.clearTimeout(fallbackTimeoutRef.current);
    }
    fallbackTimeoutRef.current = window.setTimeout(() => {
      clearPendingTransition(true);
    }, (pageTransitionLeave.totalDuration + pageTransitionEnter.totalDuration + 0.4) * 1000);
  }, [clearPendingTransition]);

  // Clean up GSAP context on unmount
  useEffect(() => {
    clearPendingTransition();
  }, [pathname, clearPendingTransition]);

  useEffect(
    () => () => {
      clearPendingTransition(true);
    },
    [clearPendingTransition],
  );

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

      // Prevent double-click during animation
      if (isAnimating.current) return;
      // Prevent competing transitions from other links
      if (useUIStore.getState().isTransitioning) return;

      const overlay = document.querySelector("[data-transition-overlay]");
      if (!overlay) {
        clearPendingTransition(true);
        router.push(href);
        return;
      }

      isAnimating.current = true;
      startTransition();
      scheduleFailsafeCleanup();

      // Revert previous context before creating new one
      ctxRef.current = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            router.push(href);
          },
        });

        tl.fromTo(overlay, pageTransitionLeave.overlay.from, pageTransitionLeave.overlay.to);
      });
    },
    [href, pathname, onClick, clearPendingTransition, startTransition, scheduleFailsafeCleanup, router],
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
