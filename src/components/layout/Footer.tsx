import { SOCIAL_LINKS } from "@/lib/navigation";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      data-footer
      className={[
        "flex flex-col items-center gap-8 px-[var(--container-padding-x)] py-[var(--section-padding-y)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Logo */}
      <span className="font-display text-[length:var(--text-logo)] font-normal uppercase tracking-[var(--tracking-hero)] text-text-heading">
        Silk Road Studio
      </span>

      {/* Links row */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a
          href="/privacy"
          className="font-label text-xs text-muted transition-colors hover:text-text"
        >
          Privacy
        </a>
        <a
          href="/terms"
          className="font-label text-xs text-muted transition-colors hover:text-text"
        >
          Terms
        </a>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="font-label text-xs text-muted transition-colors hover:text-text"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="font-label text-xs text-muted">
        &copy; {new Date().getFullYear()} Silk Road Studio
      </p>
    </footer>
  );
}
