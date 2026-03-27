"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

/** Ref handle exposing individual SVG elements for GSAP animation */
export interface BaharStudioMarkHandle {
  threads: SVGPathElement[];
  frame: SVGRectElement | null;
  convergence: SVGCircleElement | null;
  seedTips: SVGEllipseElement[];
  root: SVGSVGElement | null;
}

interface BaharStudioMarkProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Custom SVG viewBox */
  viewBox?: string;
}

/**
 * Bahar Studio mark.
 *
 * A thin rectangular frame (photograph) with three organic threads
 * growing from inside and pushing beyond its top edge.
 */
export const BaharStudioMark = forwardRef<BaharStudioMarkHandle, BaharStudioMarkProps>(
  function BaharStudioMark({ size = 24, className, style, viewBox }, ref) {
    const svgRef = useRef<SVGSVGElement>(null);
    const threadRefs = useRef<(SVGPathElement | null)[]>([]);
    const frameRef = useRef<SVGRectElement>(null);
    const convergenceRef = useRef<SVGCircleElement>(null);
    const seedTipRefs = useRef<(SVGEllipseElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      get threads() {
        return threadRefs.current.filter(Boolean) as SVGPathElement[];
      },
      get frame() {
        return frameRef.current;
      },
      get convergence() {
        return convergenceRef.current;
      },
      get seedTips() {
        return seedTipRefs.current.filter(Boolean) as SVGEllipseElement[];
      },
      get root() {
        return svgRef.current;
      },
    }));

    return (
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={viewBox ?? "0 0 110 110"}
        fill="none"
        className={className}
        style={style}
        aria-hidden="true"
      >
        {/* Rectangular photo frame — thin, subtle */}
        <rect
          ref={frameRef}
          x={25}
          y={32}
          width={60}
          height={50}
          rx={1}
          stroke="currentColor"
          strokeWidth={1.2}
          fill="none"
          opacity={0.45}
        />

        {/* Left thread — starts inside frame, breaks through top */}
        <path
          ref={(el) => {
            threadRefs.current[0] = el;
          }}
          d="M55 76 C52 68, 46 58, 40 48 C36 42, 32 36, 28 24 C26 18, 25 14, 24 8"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />

        {/* Center thread */}
        <path
          ref={(el) => {
            threadRefs.current[1] = el;
          }}
          d="M55 76 C55 66, 55 56, 55 46 C55 38, 55 30, 55 20 C55 15, 55 10, 55 5"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />

        {/* Right thread */}
        <path
          ref={(el) => {
            threadRefs.current[2] = el;
          }}
          d="M55 76 C58 68, 64 58, 70 48 C74 42, 78 36, 82 24 C84 18, 85 14, 86 8"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />

        {/* Base convergence point */}
        <circle ref={convergenceRef} cx={55} cy={76} r={3.5} fill="currentColor" />

        {/* Seed tips at thread ends */}
        <ellipse
          ref={(el) => {
            seedTipRefs.current[0] = el;
          }}
          cx={23}
          cy={6}
          rx={2}
          ry={3}
          fill="currentColor"
          transform="rotate(-10, 23, 6)"
        />
        <ellipse
          ref={(el) => {
            seedTipRefs.current[1] = el;
          }}
          cx={55}
          cy={3}
          rx={2}
          ry={3}
          fill="currentColor"
        />
        <ellipse
          ref={(el) => {
            seedTipRefs.current[2] = el;
          }}
          cx={87}
          cy={6}
          rx={2}
          ry={3}
          fill="currentColor"
          transform="rotate(10, 87, 6)"
        />
      </svg>
    );
  },
);
