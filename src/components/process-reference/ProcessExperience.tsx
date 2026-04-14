"use client";

import styles from "./process-reference.module.css";
import type { ProcessImage, ProcessStep } from "./types";
import type { SocialLink } from "@/types/content";
import { ProcessContact } from "./ProcessContact";
import { Footer } from "@/components/layout/Footer";
import { ProcessHero } from "./ProcessHero";
import { ProcessPageTransition } from "./ProcessPageTransition";
import { ProcessTimeline } from "./ProcessTimeline";

interface ProcessExperienceProps {
  heroImage: ProcessImage;
  heroTitleLine1: string;
  heroTitleLine2: string;
  introTitle: string;
  introDescription: string;
  steps: ProcessStep[];
  contactHeading: string;
  contactButtonLabel: string;
  contactButtonHref: string;
  socialLinks: SocialLink[];
}

export function ProcessExperience({
  heroImage,
  heroTitleLine1,
  heroTitleLine2,
  introTitle,
  introDescription,
  steps,
  contactHeading,
  contactButtonLabel,
  contactButtonHref,
  socialLinks,
}: ProcessExperienceProps) {
  return (
    <main id="main-content" className={`${styles.page} min-h-screen`}>
      <ProcessPageTransition>
        <div className="min-h-screen bg-[var(--process-surface)] text-[var(--process-on-surface)]">
          <ProcessHero image={heroImage} titleLine1={heroTitleLine1} titleLine2={heroTitleLine2} />
          <ProcessTimeline title={introTitle} description={introDescription} steps={steps} />
          <ProcessContact
            heading={contactHeading}
            buttonHref={contactButtonHref}
            buttonLabel={contactButtonLabel}
          />
          <Footer socialLinks={socialLinks} />
        </div>
      </ProcessPageTransition>
    </main>
  );
}
