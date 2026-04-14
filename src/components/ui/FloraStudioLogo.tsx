"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

/** Ref handle exposing the root SVG element for GSAP animation */
export interface FloraStudioLogoHandle {
  root: SVGSVGElement | null;
}

interface FloraStudioLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Flora Studio wordmark logo.
 * Uses currentColor so the parent controls fill via text-color utilities.
 */
export const FloraStudioLogo = forwardRef<FloraStudioLogoHandle, FloraStudioLogoProps>(
  function FloraStudioLogo({ width = 180, height, className, style }, ref) {
    const svgRef = useRef<SVGSVGElement>(null);

    useImperativeHandle(ref, () => ({
      get root() {
        return svgRef.current;
      },
    }));

    return (
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox="0 0 676.06 106.6"
        fill="none"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M7.64,13.52h33.24v3.68l-23.81-2.07v25.16h22.46v1.62h-22.46v34.23H7.64V13.52Z"
        />
        <path fill="currentColor" d="M91.64,72.28l-1.53,3.86h-33.87V13.52h9.43v61.09l25.96-2.34Z" />
        <path
          fill="currentColor"
          d="M100.62,44.88c0-17.88,13.57-31.98,32.25-31.98s31.89,14.29,31.89,31.98-12.85,31.9-31.89,31.9c-20.66,0-32.25-14.29-32.25-31.9ZM154.53,44.79c0-18.33-7.28-30.55-21.65-30.55s-21.92,13.12-21.92,30.46c0,19.05,6.83,30.64,22.01,30.64s21.56-12.67,21.56-30.55Z"
        />
        <path
          fill="currentColor"
          d="M183.73,76.14V13.52h16.26c12.85,0,21.38,6.83,21.38,16.44,0,7.82-7.01,15-19.5,15.72,0,.09-.09.27-.09.36,19.95,1.53,23,25.34,27.04,30.1h-10.33c-3.14-4.94-5.3-26.86-20.75-29.47v-1.35c9.52-1.53,13.3-8.71,13.3-15.27,0-8.36-5.3-14.91-14.38-14.91h-3.5v61h-9.43Z"
        />
        <path
          fill="currentColor"
          d="M259.91,27.09l-5.66-13.57h9.52l26.86,62.62h-9.97l-6.56-15.54h-25.96l-6.02,15.54h-4.4l22.19-49.06ZM273.48,59.07l-12.85-30.46-11.95,30.46h24.8Z"
        />
        <path
          fill="currentColor"
          d="M364.58,32.84c0-10.06-2.61-18.06-11.14-18.42-5.93,0-9.52,2.52-10.24,8.89-.09.54-.18,1.08-.18,1.71,0,15.81,30.64,11.59,32.52,31.45.09.9.18,1.71.18,2.7-.36,5.48-4.04,17.61-22.19,17.61-11.68,0-20.39-6.47-20.39-18.24,0-1.44.18-2.96.45-4.67h1.62c-.36,1.53-.45,3.06-.45,4.49,0,10.51,7.37,16.71,17.79,16.71,8.54,0,14.46-4.58,14.46-13.21,0-6.47-4.49-10.51-11.86-13.57-9.43-4.13-20.3-7.55-20.3-18.69,0-7.28,4.49-16.71,18.69-16.71s20.12,8.98,20.12,18.33c0,.54,0,1.17-.09,1.62h-8.98Z"
        />
        <path
          fill="currentColor"
          d="M402.4,76.14V15.14l-17.7,2.16v-3.77l22.55.27,23.72-.27v3.77l-19.05-2.16v61h-9.52Z"
        />
        <path
          fill="currentColor"
          d="M478.59,13.52h9.52v39.71c0,10.33-3.32,23.54-22.28,23.54s-21.92-13.21-21.92-23.54V13.52h9.34v45.1c0,7.28,1.62,16.71,12.67,16.71s12.67-9.34,12.67-16.71V13.52Z"
        />
        <path
          fill="currentColor"
          d="M509.13,13.61h16.26c21.65,0,34.23,12.58,34.23,30.19s-13.39,32.34-34.14,32.34h-16.35V13.61ZM518.57,74.62h6.2c13.48,0,24.62-9.97,24.62-30.46,0-22.55-13.21-29.02-25.52-29.02h-5.3v59.48Z"
        />
        <path fill="currentColor" d="M578.67,76.14V13.52h9.52v62.62h-9.52Z" />
        <path
          fill="currentColor"
          d="M606.88,44.88c0-17.88,13.57-31.98,32.25-31.98s31.89,14.29,31.89,31.98-12.85,31.9-31.89,31.9c-20.66,0-32.25-14.29-32.25-31.9ZM660.79,44.79c0-18.33-7.28-30.55-21.65-30.55s-21.92,13.12-21.92,30.46c0,19.05,6.83,30.64,22.01,30.64s21.56-12.67,21.56-30.55Z"
        />
      </svg>
    );
  },
);
