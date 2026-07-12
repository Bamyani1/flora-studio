import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/albums";
import { generateLqipDataUrl, generateLocalLqipDataUrl } from "@/lib/lqip";
import { resolveImageUrl } from "@/lib/image-url";
import { breadcrumbJsonLd, jsonLdString } from "@/lib/metadata";
import { publicEnv } from "@/lib/public-env";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { Button } from "@/components/ui/Button";
import { WorkChapters } from "@/components/sections/WorkChapters";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Browse the portfolio of Flora Studio. Weddings and graduations, events, sports, portraits, and commercial photography captured in Dayton, Ohio.",
};

export default async function WorkPage() {
  const albums = await getAllAlbums();

  const firstCoverUrl = albums[0] ? resolveImageUrl(albums[0].coverImage) : null;
  const heroBlurDataURL = firstCoverUrl?.startsWith("https://cdn.sanity.io")
    ? await generateLqipDataUrl(firstCoverUrl)
    : firstCoverUrl?.startsWith("/")
      ? await generateLocalLqipDataUrl(firstCoverUrl)
      : undefined;

  const SITE_URL = publicEnv.siteUrl;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Work", url: `${SITE_URL}/work` },
  ]);

  if (albums.length === 0) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
        />
        <main
          id="main-content"
          className="flex min-h-screen items-center justify-center bg-surface px-6 py-24 text-center"
        >
          <div className="max-w-2xl">
            <p className="eyebrow text-primary">Work</p>
            <h1 className="mt-6 font-display text-4xl text-text-heading md:text-5xl">
              No published albums right now.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted">
              The work archive is being updated. Check back soon or get in touch if you want to
              discuss a session.
            </p>
            <Button
              as={TransitionLink}
              href="/contact"
              variant="outline"
              size="xs"
              className="mt-10 min-h-[44px]"
            >
              Get in touch
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumb) }}
      />
      <main id="main-content">
        <h1 className="sr-only">Work</h1>
        <WorkChapters albums={albums} heroBlurDataURL={heroBlurDataURL} />
      </main>
    </>
  );
}
