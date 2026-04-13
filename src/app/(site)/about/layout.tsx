import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the photographer behind Flora Studio. Based in Dayton, Ohio — photographing milestones, portraits, and gatherings with intention.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
