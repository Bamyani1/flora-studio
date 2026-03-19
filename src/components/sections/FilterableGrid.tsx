"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { ProjectCard } from "@/components/sections/ProjectCard";
import type { AlbumMeta } from "@/types/project";

const CATEGORIES = ["all", "personal", "event", "sports", "solo"] as const;

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

      if (gridRef.current) {
        gridRef.current.style.opacity = "0";
      }

      setTimeout(() => {
        setActiveFilter(category);
        setIsAnimating(false);
      }, 300);
    },
    [activeFilter, isAnimating],
  );

  useEffect(() => {
    if (!gridRef.current) return;
    requestAnimationFrame(() => {
      if (gridRef.current) {
        gridRef.current.style.opacity = "1";
      }
    });
  }, [activeFilter]);

  return (
    <div>
      {/* Filter tabs */}
      <FadeIn>
        <div className="mb-[--space-12] flex gap-[--space-6]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                activeFilter === cat
                  ? "border-b-2 border-primary text-text-heading"
                  : "text-muted hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Album grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-[--grid-gap] md:grid-cols-2"
        style={{ transition: "opacity 300ms ease", opacity: 1 }}
      >
        {filtered.map((album, i) => (
          <ProjectCard
            key={album._id}
            album={album}
            index={i}
            large={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
