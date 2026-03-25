import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { ProcessMagnetic } from "./ProcessMagnetic";

const footerLinks = [
  { label: "Instagram", href: SOCIAL_LINKS[0].href, external: true },
  { label: "Behance", href: SOCIAL_LINKS[1].href, external: true },
  { label: "LinkedIn", href: SOCIAL_LINKS[2].href, external: true },
  { label: "Journal", href: "/work", external: false },
] as const;

export function ProcessFooter() {
  return (
    <footer className="flex w-full flex-col items-end justify-between border-t border-white/5 bg-zinc-950 px-8 py-20 md:flex-row md:px-16">
      <div className="mb-12 flex w-full flex-col gap-8 md:mb-0 md:w-auto">
        <div className="font-display text-lg italic text-neutral-200">Saffron Studios</div>
        <div className="font-label text-[10px] uppercase tracking-[0.15em] text-neutral-500">
          © {new Date().getFullYear()} Saffron Studios. All rights reserved. Cinematic Lens Series.
        </div>
      </div>
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
    </footer>
  );
}
