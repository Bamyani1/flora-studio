"use client";

import Image from "next/image";
import type { ImageProps } from "next/image";
import { PLACEHOLDER_MEDIA_LABEL } from "@/lib/site-media";
import { cn } from "@/lib/utils";

type SiteMediaProps = Omit<ImageProps, "src" | "loader" | "quality"> & {
  src?: ImageProps["src"] | null;
  label?: string;
};

export function SiteMedia({
  src,
  alt,
  className,
  fill,
  width,
  height,
  style,
  sizes,
  priority,
  loading,
  label = PLACEHOLDER_MEDIA_LABEL,
  ...rest
}: SiteMediaProps) {
  const decorative = alt.length === 0;
  const isPlaceholder = !src || (typeof src === "string" && src.startsWith("placeholder://"));

  if (!isPlaceholder) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : (width as number)}
        height={fill ? undefined : (height as number)}
        className={className}
        style={style}
        sizes={sizes}
        priority={priority}
        loading={loading}
        {...rest}
      />
    );
  }

  return (
    <div
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : alt}
      className={cn(
        "relative isolate overflow-hidden bg-[var(--color-surface)] text-[var(--color-text)]",
        fill && "absolute inset-0",
        className,
      )}
      data-media-placeholder="true"
      data-placeholder-label={label}
      role={decorative ? undefined : "img"}
      style={{
        ...(style ?? {}),
        ...(!fill && width && height ? { aspectRatio: `${width} / ${height}` } : {}),
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(186,112,56,0.28),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(232,226,216,0.12),_transparent_34%),linear-gradient(145deg,_var(--color-surface)_0%,_var(--color-surface-lowest)_48%,_var(--color-background)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,transparent_0,transparent_calc(50%-0.5px),rgba(232,226,216,0.16)_calc(50%-0.5px),rgba(232,226,216,0.16)_calc(50%+0.5px),transparent_calc(50%+0.5px)),linear-gradient(to_bottom,transparent_0,transparent_calc(50%-0.5px),rgba(232,226,216,0.12)_calc(50%-0.5px),rgba(232,226,216,0.12)_calc(50%+0.5px),transparent_calc(50%+0.5px))]"
      />
      <div aria-hidden="true" className="absolute inset-[6%] border border-white/10" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent"
      />
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center px-6">
        <div className="border border-primary/30 bg-background/60 px-4 py-3 backdrop-blur-sm">
          <span className="font-label text-[10px] uppercase tracking-[0.35em] text-primary">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
