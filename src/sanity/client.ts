import { createClient, type SanityClient } from "@sanity/client";
import { publicEnv } from "@/lib/public-env";

let _client: SanityClient | null = null;

function getClient(): SanityClient {
  if (!_client) {
    const projectId = publicEnv.sanityProjectId;
    if (!projectId) {
      throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
    }
    _client = createClient({
      projectId,
      dataset: publicEnv.sanityDataset,
      apiVersion: publicEnv.sanityApiVersion,
      useCdn: process.env.NODE_ENV === "production",
    });
  }
  return _client;
}

export const client = new Proxy({} as SanityClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
