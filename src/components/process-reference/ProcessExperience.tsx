"use client";

import styles from "./process-reference.module.css";
import type { ProcessImage, ProcessStep } from "./types";
import { ProcessContact } from "./ProcessContact";
import { ProcessFooter } from "./ProcessFooter";
import { ProcessHero } from "./ProcessHero";
import { ProcessPageTransition } from "./ProcessPageTransition";
import { ProcessTimeline } from "./ProcessTimeline";

interface ProcessExperienceProps {
  heroImage: ProcessImage;
  steps: ProcessStep[];
}

export function ProcessExperience({
  heroImage,
  steps,
}: ProcessExperienceProps) {
  return (
    <main id="main-content" className={`${styles.page} min-h-screen`}>
      <ProcessPageTransition>
        <div className="min-h-screen bg-[var(--process-surface)] text-[var(--process-on-surface)]">
          <ProcessHero image={heroImage} />
          <ProcessTimeline steps={steps} />
          <ProcessContact />
          <ProcessFooter />
        </div>
      </ProcessPageTransition>
    </main>
  );
}
