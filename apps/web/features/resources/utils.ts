/**
 * Resource utility functions.
 */

/**
 * Resolves a file URL to a fully-qualified accessible URL.
 *
 * - If the URL is already absolute (Cloudinary HTTPS URL, external link, blob, data), returns as-is.
 * - If the URL is a relative path (e.g., `/uploads/filename.pdf`), resolves against NEXT_PUBLIC_API_URL
 *   (defaulting to http://localhost:4000 in local development) so it can be embedded or fetched reliably.
 */
export function resolveFileUrl(url?: string | null): string {
  if (!url) return "";

  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const cleanBase = apiBase.replace(/\/+$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return `${cleanBase}${cleanPath}`;
}
