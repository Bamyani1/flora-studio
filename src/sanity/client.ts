import "server-only";
import { createClient } from "next-sanity";
import { publicEnv } from "@/lib/public-env";

export type SanityPerspective = "published" | "previewDrafts" | "raw";

interface SanityFetchOptions {
  query: string;
  params?: Record<string, unknown>;
  perspective?: SanityPerspective;
  revalidate?: number | false;
}

export function hasSanityProject() {
  return Boolean(publicEnv.sanityProjectId);
}

export class SanityConfigurationError extends Error {
  constructor(detail: string) {
    super(detail);
    this.name = "SanityConfigurationError";
  }
}

function getRequiredSanityReadToken() {
  const token = process.env.SANITY_READ_TOKEN;

  if (!token) {
    throw new SanityConfigurationError(
      "Missing SANITY_READ_TOKEN for server-side Sanity reads.",
    );
  }

  return token;
}

function getSanityClient(options: {
  perspective?: SanityPerspective;
  token?: string;
  useCdn?: boolean;
} = {}) {
  const projectId = publicEnv.sanityProjectId;

  if (!projectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  }

  const perspective = options.perspective ?? "published";
  const token = options.token ?? getRequiredSanityReadToken();
  const useCdn =
    options.useCdn ??
    (!token && perspective === "published" && process.env.NODE_ENV === "production");

  return createClient({
    projectId,
    dataset: publicEnv.sanityDataset,
    apiVersion: publicEnv.sanityApiVersion,
    perspective,
    useCdn,
    token,
  });
}

export async function sanityFetch<T>({
  query,
  params,
  perspective = "published",
  revalidate = 60,
}: SanityFetchOptions): Promise<T> {
  const client = getSanityClient({ perspective });

  return client.fetch<T>(query, params ?? {}, {
    next: revalidate === false ? undefined : { revalidate },
    cache: revalidate === false ? "no-store" : undefined,
  });
}
