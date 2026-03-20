"use client";

import styles from "./process-reference.module.css";
import type { ProcessImage, ProcessStep } from "./types";
import { ProcessContact } from "./ProcessContact";
import { ProcessCustomCursor } from "./ProcessCustomCursor";
import { ProcessFooter } from "./ProcessFooter";
import { ProcessHero } from "./ProcessHero";
import { ProcessPageTransition } from "./ProcessPageTransition";
import { ProcessScrollProgress } from "./ProcessScrollProgress";
import { ProcessTimeline } from "./ProcessTimeline";

interface ProcessExperienceProps {
  heroImage: ProcessImage;
  portraitImage: ProcessImage;
  steps: ProcessStep[];
  quote: string;
}

export function ProcessExperience({
  heroImage,
  portraitImage,
  steps,
  quote,
}: ProcessExperienceProps) {
  return (
    <main id="main-content" className={`${styles.page} min-h-screen`}>
      <ProcessScrollProgress />
      <ProcessCustomCursor />
      <ProcessPageTransition>
        <div className="min-h-screen bg-[var(--process-surface)] text-[var(--process-on-surface)]">
          <ProcessHero image={heroImage} />
          <ProcessTimeline steps={steps} />
          <ProcessContact portrait={portraitImage} quote={quote} />
          <ProcessFooter />
        </div>
      </ProcessPageTransition>
    </main>
  );
}
