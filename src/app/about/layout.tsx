import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team behind Saffron Studios and how we work.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
