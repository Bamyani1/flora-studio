"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return (
      <main
        id="main-content"
        className="flex min-h-screen flex-col items-center justify-center px-[var(--container-padding-x)] text-center"
      >
        <p className="font-label text-sm uppercase tracking-widest text-muted">
          Studio unavailable
        </p>
        <h1 className="mt-4 font-display font-normal text-5xl text-text-heading md:text-6xl">
          Sanity studio needs configuration
        </h1>
        <p className="mt-6 max-w-md text-center leading-relaxed text-muted">
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code>{" "}
          to enable the embedded studio.
        </p>
      </main>
    );
  }

  return (
    <main id="main-content">
      <NextStudio config={config} />
    </main>
  );
}
