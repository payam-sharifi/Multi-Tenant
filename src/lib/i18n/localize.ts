import { locales, type Locale } from './config';

const LOCALE_KEY_SET = new Set<string>(locales);
const LOCALE_SUFFIX = new RegExp(`_(${locales.join('|')})$`);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isLocaleMap(value: unknown): value is Partial<Record<Locale, unknown>> {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => LOCALE_KEY_SET.has(key));
}

function deepMerge(target: unknown, source: unknown): unknown {
  if (!isPlainObject(source)) return source;
  if (!isPlainObject(target)) return source;

  const output: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(source)) {
    output[key] = deepMerge(target[key], value);
  }
  return output;
}

export function localizeContent<T>(data: T, locale: Locale): T {
  if (data == null) return data;
  if (Array.isArray(data)) {
    return data.map((item) => localizeContent(item, locale)) as T;
  }
  if (!isPlainObject(data)) return data;

  if (isLocaleMap(data)) {
    return localizeContent((data[locale] ?? data.de ?? data.en) as T, locale);
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'translations' || key === 'i18n' || key === 'locales') continue;
    if (LOCALE_SUFFIX.test(key)) continue;
    result[key] = localizeContent(value, locale);
  }

  const suffix = `_${locale}`;
  for (const [key, value] of Object.entries(data)) {
    if (!key.endsWith(suffix)) continue;
    const baseKey = key.slice(0, -suffix.length);
    result[baseKey] = localizeContent(value, locale);
  }

  return result as T;
}

export function getLocalizedSiteData<T>(siteData: T, locale: Locale): T {
  if (!isPlainObject(siteData)) return localizeContent(siteData, locale);

  const overlay =
    (siteData.i18n as Record<string, unknown> | undefined)?.[locale] ??
    (siteData.locales as Record<string, unknown> | undefined)?.[locale] ??
    (siteData.translations as Record<string, unknown> | undefined)?.[locale];

  const merged = overlay ? deepMerge(siteData, overlay) : siteData;
  return localizeContent(merged as T, locale);
}
