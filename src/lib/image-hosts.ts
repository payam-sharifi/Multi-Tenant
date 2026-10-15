/**
 * Remote image hosts that tenant content may reference.
 * Shared by next.config.ts (images.remotePatterns) and the site-data parser,
 * so a URL coming from the backend can never crash next/image.
 */
const BUILTIN_HOSTS = ['images.unsplash.com'];

function hostOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function allowedImageHosts(): string[] {
  const extra = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);
  const supabase = hostOf(process.env.NEXT_PUBLIC_SUPABASE_URL);
  return Array.from(new Set([...BUILTIN_HOSTS, ...(supabase ? [supabase] : []), ...extra]));
}

/** Returns the URL when it is https and its host is allowed, otherwise undefined. */
export function safeImageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const raw = value.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return undefined;
    return allowedImageHosts().includes(url.hostname) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}
