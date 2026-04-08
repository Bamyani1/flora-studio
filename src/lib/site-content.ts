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
import { isE2EContentRuntime } from "@/lib/content-runtime.server";
import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
  ProcessPageContent,
  SiteSettings,
} from "@/types/content";

// Sanity disconnected — all content served from code-first placeholders.
// Sanity infrastructure (schemas, studio, client) remains in the codebase for future reconnection.

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isE2EContentRuntime()) return E2E_SITE_SETTINGS;
  return PLACEHOLDER_SITE_SETTINGS;
}

export async function getHomePageContent(): Promise<HomePageContent> {
  if (isE2EContentRuntime()) return E2E_HOME_PAGE;
  return PLACEHOLDER_HOME_PAGE;
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  if (isE2EContentRuntime()) return E2E_ABOUT_PAGE;
  return PLACEHOLDER_ABOUT_PAGE;
}

export async function getProcessPageContent(): Promise<ProcessPageContent> {
  if (isE2EContentRuntime()) return E2E_PROCESS_PAGE;
  return PLACEHOLDER_PROCESS_PAGE;
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  if (isE2EContentRuntime()) return E2E_CONTACT_PAGE;
  return PLACEHOLDER_CONTACT_PAGE;
}
