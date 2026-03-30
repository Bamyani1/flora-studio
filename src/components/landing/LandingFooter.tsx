import { PRIMARY_NAV_ITEMS, NAV_CTA } from "@/lib/navigation";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { BaharStudioLogo } from "@/components/ui/BaharStudioLogo";

const UTILITY_LINKS: { label: string; href: string }[] = [];

export function LandingFooter() {
  return (
    <footer className="relative z-20 flex flex-col items-center gap-10 w-full border-t border-white/10 bg-surface-abyss py-24 md:py-32 px-6">
      <div className="grain-medium absolute inset-0 z-[2]" aria-hidden="true" />
      <BaharStudioLogo className="w-[160px] md:w-[200px] text-white" />
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 font-label uppercase tracking-[0.2em] text-[10px]">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            className="group relative text-white/50 hover:text-primary transition-colors duration-700"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </TransitionLink>
        ))}
        <TransitionLink
          href={NAV_CTA.href}
          className="group relative text-white/50 hover:text-primary transition-colors duration-700"
        >
          {NAV_CTA.label}
          <span className="absolute -bottom-1 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </TransitionLink>
        {UTILITY_LINKS.map((link) => (
          <TransitionLink
            key={link.href}
            href={link.href}
            className="group relative text-white/50 hover:text-primary transition-colors duration-700"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </TransitionLink>
        ))}
      </div>
      <div className="mt-8 font-label uppercase tracking-[0.2em] text-[9px] text-white/30 text-center">
        &copy; {new Date().getFullYear()} BAHAR STUDIO. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
