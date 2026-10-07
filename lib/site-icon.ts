export const DEFAULT_FAVICON = '/favicon.png';

const ICON_KEYS = [
  'favicon',
  'favicon_url',
  'icon',
  'icon_url',
  'site_icon',
  'apple_touch_icon',
  'apple_icon',
] as const;

function isUsableIcon(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return (
    /^(https?:\/\/|\/|data:image\/)/i.test(trimmed) ||
    /\.(png|jpe?g|gif|webp|svg|ico)(\?.*)?$/i.test(trimmed)
  );
}

export function resolveSiteIcon(siteData: unknown): string {
  if (!siteData || typeof siteData !== 'object') return DEFAULT_FAVICON;

  const record = siteData as Record<string, unknown>;

  for (const key of ICON_KEYS) {
    if (isUsableIcon(record[key])) return record[key].trim();
  }

  if (isUsableIcon(record.logo)) return record.logo.trim();

  return DEFAULT_FAVICON;
}
