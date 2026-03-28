import type { Metadata } from "next";
import { ProcessExperience } from "@/components/process-reference/ProcessExperience";
import { PROCESS_HERO_MEDIA, PROCESS_STEPS } from "@/lib/site-media";

export const metadata: Metadata = {
  title: "Process",
  description:
    "From conversation to delivery — how we work at Bahar Studio. Four phases, one standard: nothing leaves until it's worth keeping.",
};

export default function ProcessPage() {
  return <ProcessExperience heroImage={PROCESS_HERO_MEDIA} steps={PROCESS_STEPS} />;
}
