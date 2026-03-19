import { client } from "@/sanity/client";
import { FEATURED_ALBUMS_QUERY, ABOUT_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_FEATURED_ALBUMS, PLACEHOLDER_ABOUT } from "@/lib/placeholder-data";
import type { AlbumMeta } from "@/types/project";
import { Hero } from "@/components/sections/Hero";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { CategoriesStrip } from "@/components/sections/CategoriesStrip";
import { ContactCTA } from "@/components/sections/ContactCTA";

async function getFeaturedAlbums(): Promise<AlbumMeta[]> {
  try {
    return await client.fetch(FEATURED_ALBUMS_QUERY);
  } catch {
    return PLACEHOLDER_FEATURED_ALBUMS;
  }
}

async function getAbout() {
  try {
    return await client.fetch(ABOUT_QUERY);
  } catch {
    return PLACEHOLDER_ABOUT;
  }
}

export default async function HomePage() {
  const [albums, about] = await Promise.all([getFeaturedAlbums(), getAbout()]);

  return (
    <main>
      <Hero />

      <ProjectGrid>
        {albums.map((album, i) => (
          <ProjectCard key={album._id} album={album} index={i} large={i === 0} />
        ))}
      </ProjectGrid>

      <AboutTeaser
        bio={about?.bio ?? PLACEHOLDER_ABOUT.bio}
        portraitUrl={about?.portrait?.asset?._ref ? undefined : null}
        portraitBlur={about?.portraitBlur}
      />

      <CategoriesStrip />

      <ContactCTA />
    </main>
  );
}
