import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The art of visual silence. Meet the team behind Silk Studio and our cinematic photography process.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
