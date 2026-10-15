import { getDictionary, type Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import { getLocalizedSiteData } from '@/lib/i18n/localize';
import { buildSiteConfig } from '@/lib/site-config';
import { getWebsiteData } from '@/lib/tenant';
import { getDevFixture, resolvePreviewThemeConfig, resolveTenantBasePath } from '@/lib/tenant-preview';
import type { SiteConfig } from '@/lib/types/template';

function previewQueryString(query: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const key of ['fixture', 'template'] as const) {
    const value = query[key];
    if (typeof value === 'string' && value) params.set(key, value);
  }
  const text = params.toString();
  return text ? `?${text}` : '';
}

export async function loadTenantSite({
  locale,
  subdomain,
  query = {},
  host,
}: {
  locale: Locale;
  subdomain: string;
  query?: Record<string, string | string[] | undefined>;
  host: string | null;
}): Promise<{ dict: Dictionary; config: SiteConfig } | null> {
  const website = getDevFixture(query) ?? (await getWebsiteData(subdomain));
  if (!website?.site_data) return null;

  const dict = getDictionary(locale);
  const localized = getLocalizedSiteData(website.site_data, locale);
  const config = buildSiteConfig(
    localized,
    dict,
    locale,
    resolvePreviewThemeConfig(query, website.theme_config),
  );
  config.basePath = resolveTenantBasePath(host, subdomain);
  config.previewQuery = previewQueryString(query);
  return { dict, config };
}
