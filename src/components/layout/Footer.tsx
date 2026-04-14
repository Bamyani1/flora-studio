import Link from "next/link";
import { LEGAL_NAV_ITEMS, PRIMARY_NAV_ITEMS } from "@/lib/navigation";
import { FloraStudioLogo } from "@/components/ui/FloraStudioLogo";
import type { SocialLink } from "@/types/content";

export function Footer({
  className,
  socialLinks,
}: {
  className?: string;
  socialLinks: SocialLink[];
}) {
  return (
    <footer
      data-footer
      className={[
        "flex w-full flex-col items-end justify-between border-t border-white/5 bg-surface-abyss px-8 py-20 md:flex-row md:px-16",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left — Logo + Copyright */}
      <div className="mb-12 flex w-full flex-col gap-8 md:mb-0 md:w-auto">
        <FloraStudioLogo width={120} className="text-neutral-200" />
        <div className="font-label text-[10px] uppercase tracking-[0.15em] text-neutral-500">
          &copy; {new Date().getFullYear()} Flora Studio. All rights reserved.
        </div>
      </div>

      {/* Right — Social + Journal, then Legal */}
      <div className="flex flex-col items-start gap-8 md:items-end">
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-10">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-block font-label text-[10px] uppercase tracking-[0.15em] text-neutral-600 transition-colors duration-300 hover:text-neutral-200"
            >
              {item.label}
            </Link>
          ))}
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-label text-[10px] uppercase tracking-[0.15em] text-neutral-600 transition-colors duration-300 hover:text-neutral-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <nav aria-label="Legal links" className="flex flex-wrap gap-6">
          {LEGAL_NAV_ITEMS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-block font-label text-[9px] uppercase tracking-[0.16em] text-neutral-500 transition-colors duration-300 hover:text-neutral-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
