import { PRIMARY_NAV_ITEMS, NAV_CTA, SOCIAL_LINKS } from "@/lib/navigation";
import { BaharStudioLogo } from "@/components/ui/BaharStudioLogo";

const LEGAL_LINKS: { label: string; href: string }[] = [];

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      data-footer
      className={[
        "w-full border-t border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-lowest)] flex flex-col md:flex-row justify-between items-center px-[var(--container-padding-x)] py-16 gap-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Brand + copyright */}
      <div className="flex flex-col gap-4">
        <BaharStudioLogo width={120} className="text-text-heading" />
        <p className="font-label text-[10px] tracking-[0.2em] uppercase font-light text-[var(--color-on-surface-variant)] opacity-80 hover:opacity-100 transition-opacity duration-300">
          &copy; {new Date().getFullYear()} Bahar Studio. All rights reserved.
        </p>
      </div>

      {/* Page navigation */}
      <div className="flex flex-wrap gap-8 md:gap-12">
        {[...PRIMARY_NAV_ITEMS, NAV_CTA].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group/footerlink relative font-label text-[10px] tracking-[0.2em] uppercase font-light text-[var(--color-on-surface-variant)] hover:text-primary transition-colors duration-300"
          >
            {item.label}
            <span className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-primary transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/footerlink:scale-x-100" />
          </a>
        ))}
      </div>

      {/* Legal + Social links */}
      <div className="flex flex-wrap gap-8 md:gap-12">
        {LEGAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="group/footerlink relative font-label text-[10px] tracking-[0.2em] uppercase font-light text-[var(--color-on-surface-variant)] hover:text-primary transition-colors duration-300"
          >
            {link.label}
            <span className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-primary transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/footerlink:scale-x-100" />
          </a>
        ))}
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/footerlink relative font-label text-[10px] tracking-[0.2em] uppercase font-light text-[var(--color-on-surface-variant)] hover:text-primary transition-colors duration-300"
          >
            {link.label}
            <span className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-primary transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/footerlink:scale-x-100" />
          </a>
        ))}
      </div>
    </footer>
  );
}
