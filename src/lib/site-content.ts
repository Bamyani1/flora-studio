import {
  PLACEHOLDER_ABOUT_PAGE,
  PLACEHOLDER_CONTACT_PAGE,
  PLACEHOLDER_HOME_PAGE,
  PLACEHOLDER_PROCESS_PAGE,
  PLACEHOLDER_SITE_SETTINGS,
} from "@/lib/placeholder-site-content";
import {
  E2E_ABOUT_PAGE,
  E2E_CONTACT_PAGE,
  E2E_HOME_PAGE,
  E2E_PROCESS_PAGE,
  E2E_SITE_SETTINGS,
} from "@/lib/e2e-content";
import {
  getContentRuntimeMode,
  isE2EContentRuntime,
  resolveContentAvailabilityFailure,
} from "@/lib/content-runtime.server";
import { sanityFetch } from "@/sanity/client";
import {
  ABOUT_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  HOME_PAGE_QUERY,
  PROCESS_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/queries";
import {
  mapAboutPageContent,
  mapHomePageContent,
  mapProcessPageContent,
  type RawAboutPage,
  type RawHomePage,
  type RawProcessPage,
} from "@/lib/sanity-mappers";
import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
  ProcessPageContent,
  SiteSettings,
} from "@/types/content";

function shouldFetchFromSanity() {
  const mode = getContentRuntimeMode();
  return mode === "production" || mode === "preview";
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isE2EContentRuntime()) return E2E_SITE_SETTINGS;
  if (!shouldFetchFromSanity()) return PLACEHOLDER_SITE_SETTINGS;

  try {
    const doc = await sanityFetch<SiteSettings | null>({ query: SITE_SETTINGS_QUERY });
    if (!doc) throw new Error("siteSettings document not found");
    return doc;
  } catch (error) {
    return resolveContentAvailabilityFailure("siteSettings", error, () => PLACEHOLDER_SITE_SETTINGS);
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  if (isE2EContentRuntime()) return E2E_HOME_PAGE;
  if (!shouldFetchFromSanity()) return PLACEHOLDER_HOME_PAGE;

  try {
    const doc = await sanityFetch<RawHomePage | null>({ query: HOME_PAGE_QUERY });
    if (!doc) throw new Error("homePage document not found");
    return mapHomePageContent(doc);
  } catch (error) {
    return resolveContentAvailabilityFailure("homePage", error, () => PLACEHOLDER_HOME_PAGE);
  }
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  if (isE2EContentRuntime()) return E2E_ABOUT_PAGE;
  if (!shouldFetchFromSanity()) return PLACEHOLDER_ABOUT_PAGE;

  try {
    const doc = await sanityFetch<RawAboutPage | null>({ query: ABOUT_PAGE_QUERY });
    if (!doc) throw new Error("aboutPage document not found");
    return mapAboutPageContent(doc);
  } catch (error) {
    return resolveContentAvailabilityFailure("aboutPage", error, () => PLACEHOLDER_ABOUT_PAGE);
  }
}

export async function getProcessPageContent(): Promise<ProcessPageContent> {
  if (isE2EContentRuntime()) return E2E_PROCESS_PAGE;
  if (!shouldFetchFromSanity()) return PLACEHOLDER_PROCESS_PAGE;

  try {
    const doc = await sanityFetch<RawProcessPage | null>({ query: PROCESS_PAGE_QUERY });
    if (!doc) throw new Error("processPage document not found");
    return mapProcessPageContent(doc);
  } catch (error) {
    return resolveContentAvailabilityFailure("processPage", error, () => PLACEHOLDER_PROCESS_PAGE);
  }
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  if (isE2EContentRuntime()) return E2E_CONTACT_PAGE;
  if (!shouldFetchFromSanity()) return PLACEHOLDER_CONTACT_PAGE;

  try {
    const doc = await sanityFetch<ContactPageContent | null>({ query: CONTACT_PAGE_QUERY });
    if (!doc) throw new Error("contactPage document not found");
    return doc;
  } catch (error) {
    return resolveContentAvailabilityFailure("contactPage", error, () => PLACEHOLDER_CONTACT_PAGE);
  }
}
