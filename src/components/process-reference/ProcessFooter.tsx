import Link from "next/link";
import { LEGAL_NAV_ITEMS } from "@/lib/navigation";
import { ProcessMagnetic } from "./ProcessMagnetic";
import { FloraStudioLogo } from "@/components/ui/FloraStudioLogo";
import type { SocialLink } from "@/types/content";

export function ProcessFooter({ socialLinks }: { socialLinks: SocialLink[] }) {
  const footerLinks = [
    ...socialLinks.map((link) => ({ label: link.label, href: link.url, external: true })),
    { label: "Journal", href: "/work", external: false },
  ] as const;

  return (
    <footer className="flex w-full flex-col items-end justify-between border-t border-white/5 bg-zinc-950 px-8 py-20 md:flex-row md:px-16">
      <div className="mb-12 flex w-full flex-col gap-8 md:mb-0 md:w-auto">
        <FloraStudioLogo width={120} className="text-neutral-200" />
        <div className="font-label text-[10px] uppercase tracking-[0.15em] text-neutral-500">
          © {new Date().getFullYear()} Flora Studio. All rights reserved.
        </div>
      </div>
      <div className="flex flex-col items-start gap-8 md:items-end">
        <div className="flex flex-wrap gap-10">
          {footerLinks.map((link) => (
            <ProcessMagnetic key={link.label}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-label text-[10px] uppercase tracking-[0.15em] text-neutral-600 transition-colors duration-300 hover:text-neutral-200"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="inline-block font-label text-[10px] uppercase tracking-[0.15em] text-neutral-600 transition-colors duration-300 hover:text-neutral-200"
                >
                  {link.label}
                </Link>
              )}
            </ProcessMagnetic>
          ))}
        </div>
        <div className="flex flex-wrap gap-6">
          {LEGAL_NAV_ITEMS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-block font-label text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition-colors duration-300 hover:text-neutral-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
