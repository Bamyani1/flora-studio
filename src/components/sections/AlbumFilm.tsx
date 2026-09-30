"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AlbumFilmProps {
  src: string;
  poster?: string;
  title: string;
}

// Plays muted only while at least half of it is on screen, so it never burns
// data or CPU off-screen. Reduce Motion gets a still frame and a Play button,
// and a viewer's Pause is never overridden by scrolling back into view.
export function AlbumFilm({ src, poster, title }: AlbumFilmProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByViewerRef = useRef(false);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced || typeof IntersectionObserver === "undefined") {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
        } else if (!pausedByViewerRef.current) {
          video.play().catch(() => {});
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByViewerRef.current = false;
      video.play().catch(() => {});
    } else {
      pausedByViewerRef.current = true;
      video.pause();
    }
  };

  return (
    <figure className="relative mb-2 bg-surface-abyss px-4 py-[6svh]">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={`${title} film`}
        className="mx-auto block h-auto max-h-[85svh] w-auto max-w-full"
      />
      <figcaption className="mt-5 flex items-center justify-center gap-4">
        <span className="eyebrow text-muted">Film</span>
        <span className="h-px w-6 bg-primary/50" aria-hidden="true" />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause film" : "Play film"}
          className="eyebrow min-h-[44px] text-primary transition-colors can-hover:hover:text-text"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </figcaption>
    </figure>
  );
}
