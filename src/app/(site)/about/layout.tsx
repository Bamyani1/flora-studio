import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the three photographers behind Flora Studio — a Dayton, Ohio studio built on patience, precision, and photographs worth keeping.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
