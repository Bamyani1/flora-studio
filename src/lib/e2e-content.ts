import {
  PLACEHOLDER_ABOUT_PAGE,
  PLACEHOLDER_CONTACT_PAGE,
  PLACEHOLDER_HOME_PAGE,
  PLACEHOLDER_PROCESS_PAGE,
  PLACEHOLDER_SITE_SETTINGS,
} from "@/lib/placeholder-site-content";
import { PLACEHOLDER_ALBUM_MAP } from "@/lib/placeholder-data";
import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
  ProcessPageContent,
  SiteSettings,
} from "@/types/content";
import type { Album } from "@/types/project";

export const E2E_PRIMARY_ALBUM_SLUG = "march-madness";

export const E2E_ALBUMS: Album[] = [PLACEHOLDER_ALBUM_MAP[E2E_PRIMARY_ALBUM_SLUG]];
export const E2E_SITE_SETTINGS: SiteSettings = PLACEHOLDER_SITE_SETTINGS;
export const E2E_HOME_PAGE: HomePageContent = PLACEHOLDER_HOME_PAGE;
export const E2E_ABOUT_PAGE: AboutPageContent = PLACEHOLDER_ABOUT_PAGE;
export const E2E_PROCESS_PAGE: ProcessPageContent = PLACEHOLDER_PROCESS_PAGE;
export const E2E_CONTACT_PAGE: ContactPageContent = PLACEHOLDER_CONTACT_PAGE;

export function getE2EAlbumBySlug(slug: string) {
  return E2E_ALBUMS.find((album) => album.slug.current === slug) ?? null;
}
