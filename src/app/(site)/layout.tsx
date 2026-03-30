import { CookieConsentManager } from "@/components/legal/CookieConsentManager";
import { RouteChrome } from "@/components/layout/RouteChrome";
import { getSiteSettings } from "@/lib/site-content";
import { Providers } from "@/providers/Providers";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <Providers>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip-link focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-background focus:outline-none"
      >
        Skip to content
      </a>
      <RouteChrome socialLinks={siteSettings.socialLinks}>{children}</RouteChrome>
      <CookieConsentManager />
    </Providers>
  );
}
