/**
 * Image URL helpers shared by the public site and the admin UI.
 *
 * Uploads are served from `/api/uploads/{folder}/{filename}` (binaries stored in
 * MongoDB). Nothing is written to `public/uploads`, because serverless hosts
 * have a read-only filesystem and any local write would vanish on redeploy.
 */

/** Public URL prefix for binaries served out of MongoDB. */
export const UPLOAD_URL_PREFIX = '/api/uploads/';

/** Legacy prefix from the old disk-based storage. These files no longer exist. */
const LEGACY_UPLOAD_PREFIX = '/uploads/';

/** Shown in place of a legacy disk upload that is no longer retrievable. */
export const IMAGE_PLACEHOLDER = '/assets/Logo/logo.png';

/** True for URLs this app owns and can delete. */
export function isStoredUploadUrl(url: string | undefined | null): boolean {
  return Boolean(url && url.startsWith(UPLOAD_URL_PREFIX));
}

/** True for dead references to the old `public/uploads` disk storage. */
export function isLegacyDiskUploadUrl(url: string | undefined | null): boolean {
  return Boolean(url && url.startsWith(LEGACY_UPLOAD_PREFIX));
}

/**
 * Resolve a stored image reference to something safe to render.
 *
 * Legacy `/uploads/...` paths point at files that did not survive deployment, so
 * they fall back to a placeholder rather than rendering a broken image.
 */
export function resolveImageSrc(
  url: string | undefined | null,
  placeholder: string = IMAGE_PLACEHOLDER
): string {
  const src = url?.trim();
  if (!src) return placeholder;
  if (isLegacyDiskUploadUrl(src)) return placeholder;
  return src;
}
