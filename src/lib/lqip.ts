import "server-only";

export async function generateLqipDataUrl(
  imageUrl: string | null | undefined,
): Promise<string | undefined> {
  if (!imageUrl || !imageUrl.startsWith("https://cdn.sanity.io")) return undefined;

  const lqipUrl = `${imageUrl}?w=20&blur=50&q=30&fit=crop&auto=format`;

  try {
    const response = await fetch(lqipUrl, { signal: AbortSignal.timeout(2000) });
    if (!response.ok) return undefined;

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return undefined;
  }
}
