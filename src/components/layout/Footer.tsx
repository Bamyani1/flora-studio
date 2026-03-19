import { SOCIAL_LINKS } from "@/lib/navigation";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={[
        "flex flex-col items-center gap-12 px-[--container-padding-x] py-[--section-padding-y] md:py-[--section-padding-y]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* CTA */}
      <a
        href="mailto:hello@bamyanstoryworks.com"
        className="text-center font-display text-3xl text-text-heading transition-colors duration-300 hover:text-primary md:text-[length:var(--text-footer-cta)]"
      >
        Let&apos;s work together
      </a>

      {/* Email */}
      <a
        href="mailto:hello@bamyanstoryworks.com"
        className="font-body text-lg text-muted transition-colors hover:text-text"
      >
        hello@bamyanstoryworks.com
      </a>

      {/* Social links */}
      <div className="flex gap-6">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-text"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="font-mono text-xs text-muted">
        &copy; {new Date().getFullYear()} Bamyan Storyworks. All rights reserved.
      </p>
    </footer>
  );
}
