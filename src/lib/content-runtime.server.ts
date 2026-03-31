import "server-only";

export type ContentRuntimeMode = "local" | "preview" | "production" | "e2e";

const VALID_CONTENT_RUNTIME_MODES = new Set<ContentRuntimeMode>([
  "local",
  "preview",
  "production",
  "e2e",
]);

export class ContentUnavailableError extends Error {
  resource: string;

  constructor(resource: string, cause?: unknown) {
    const detail =
      cause instanceof Error
        ? `${cause.name}: ${cause.message}`
        : typeof cause === "string"
          ? cause
          : null;

    super(
      detail
        ? `Live content unavailable for ${resource}. ${detail}`
        : `Live content unavailable for ${resource}.`,
    );
    this.name = "ContentUnavailableError";
    this.resource = resource;
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}

export function getContentRuntimeMode(): ContentRuntimeMode {
  const explicitMode = process.env.CONTENT_RUNTIME_MODE;

  if (explicitMode) {
    if (VALID_CONTENT_RUNTIME_MODES.has(explicitMode as ContentRuntimeMode)) {
      return explicitMode as ContentRuntimeMode;
    }

    throw new Error(
      `Invalid CONTENT_RUNTIME_MODE "${explicitMode}". Expected one of ${Array.from(VALID_CONTENT_RUNTIME_MODES).join(", ")}.`,
    );
  }

  if (process.env.NODE_ENV !== "production") {
    return "local";
  }

  if (process.env.VERCEL_ENV === "preview") {
    return "preview";
  }

  return "production";
}

export function isSoftContentRuntime(mode = getContentRuntimeMode()) {
  return mode === "local" || mode === "preview";
}

export function isE2EContentRuntime(mode = getContentRuntimeMode()) {
  return mode === "e2e";
}

export function warnContentFallback(resource: string, error: unknown) {
  const detail =
    error instanceof Error
      ? { name: error.name, message: error.message }
      : { name: "UnknownError", message: String(error) };

  console.warn(
    `[ContentFallback] ${JSON.stringify({
      resource,
      mode: getContentRuntimeMode(),
      error: detail,
    })}`,
  );
}

export function resolveContentAvailabilityFailure<T>(
  resource: string,
  error: unknown,
  fallback: () => T,
): T {
  if (isSoftContentRuntime()) {
    warnContentFallback(resource, error);
    return fallback();
  }

  throw new ContentUnavailableError(resource, error);
}
