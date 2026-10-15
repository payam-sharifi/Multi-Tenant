import { defaultLocale, type Locale } from '@/lib/i18n/config';

/** Locale-aware public path. German stays unprefixed (`/impressum`), English uses `/en/...`. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}
