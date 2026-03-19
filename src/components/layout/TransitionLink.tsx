"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { pageTransitionLeave } from "@/lib/animations";
import { useUIStore } from "@/stores/ui-store";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  transitionType?: "wipe" | "morph";
  flipId?: string;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
}

export function TransitionLink({
  href,
  children,
  transitionType = "wipe",
  flipId,
  className,
  onClick,
  prefetch = true,
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAnimating = useRef(false);
  const startTransition = useUIStore((s) => s.startTransition);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      // Don't transition to current page
      if (href === pathname) return;
      // Prevent double-click during animation
      if (isAnimating.current) return;

      onClick?.();
      isAnimating.current = true;

      // If morph: capture Flip state
      let morphState: unknown = null;
      if (transitionType === "morph" && flipId) {
        const sourceEl = document.querySelector(`[data-flip-id="${flipId}"]`);
        if (sourceEl) {
          const { Flip } = require("@/lib/gsap");
          morphState = Flip.getState(sourceEl);
        }
      }

      startTransition(transitionType, morphState);

      const overlay = document.querySelector("[data-transition-overlay]");
      if (!overlay) {
        router.push(href);
        isAnimating.current = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href);
          isAnimating.current = false;
        },
      });

      tl.fromTo(overlay, pageTransitionLeave.overlay.from, pageTransitionLeave.overlay.to);
    },
    [href, pathname, transitionType, flipId, onClick, startTransition, router],
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
