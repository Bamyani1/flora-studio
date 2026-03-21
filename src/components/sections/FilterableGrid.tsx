"use client";

import { useState, useRef, useCallback } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { ProjectCard } from "@/components/sections/ProjectCard";
import type { AlbumMeta } from "@/types/project";

import { CATEGORY_META } from "@/lib/categories";

const CATEGORIES = ["all", "landscapes", "nightsky", "sports", "portraits", "stories"] as const;

interface FilterableGridProps {
  albums: AlbumMeta[];
}

export function FilterableGrid({ albums }: FilterableGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isAnimating, setIsAnimating] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === "all"
      ? albums
      : albums.filter((a) => a.category === activeFilter);

  const handleFilter = useCallback(
    (category: string) => {
      if (category === activeFilter || isAnimating) return;
      setIsAnimating(true);

      const grid = gridRef.current;
      if (!grid) return;

      grid.style.opacity = "0";
      const onEnd = (e: TransitionEvent) => {
        if (e.target !== grid) return;
        grid.removeEventListener("transitionend", onEnd);
        setActiveFilter(category);
        setIsAnimating(false);
        requestAnimationFrame(() => {
          if (gridRef.current) gridRef.current.style.opacity = "1";
        });
      };
      grid.addEventListener("transitionend", onEnd);
    },
    [activeFilter, isAnimating],
  );

  return (
    <div>
      {/* Filter tabs */}
      <FadeIn>
        <div className="mb-[var(--space-12)] flex flex-wrap gap-[var(--space-6)]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`min-h-[44px] inline-flex items-center border px-4 py-2 font-label text-xs uppercase tracking-wider transition-colors ${
                activeFilter === cat
                  ? "border-primary bg-primary/10 text-text-heading"
                  : "border-border text-muted hover:text-text"
              }`}
            >
              {cat === "all" ? "All" : CATEGORY_META[cat]?.label ?? cat}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Album grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-2"
        style={{ transition: "opacity 400ms var(--ease-out)", opacity: 1 }}
      >
        {filtered.map((album, i) => (
          <ProjectCard
            key={album._id}
            album={album}
            index={i}
            large={i === 0}
            eagerImage={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
