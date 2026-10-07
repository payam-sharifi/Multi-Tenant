import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getLocalizedSiteData } from '@/lib/i18n/localize';
import { resolveSiteIcon } from '@/lib/site-icon';
import { buildSiteConfig, isBusinessType } from '@/lib/site-config';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import TemplateRenderer from '@/components/TemplateRenderer';

async function getWebsiteData(subdomain: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('websites')
    .select('site_data, theme_config, subdomain')
    .eq('subdomain', subdomain)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; subdomain: string }>;
}): Promise<Metadata> {
  const { lang, subdomain } = await params;
  const locale: Locale = isLocale(lang) ? lang : 'de';
  const dict = getDictionary(locale);
  const website = await getWebsiteData(subdomain);
  const localized = website?.site_data
    ? getLocalizedSiteData(website.site_data, locale)
    : null;
  const icon = resolveSiteIcon(localized);
  const site = localized
    ? buildSiteConfig(localized, dict, locale, website?.theme_config)
    : null;

  return {
    title: site?.branding.name || dict.meta.defaultTitle,
    description: site?.hero.subtitle || dict.meta.defaultDescription,
    icons: {
      icon: [{ url: icon }],
      apple: icon,
    },
    alternates: {
      languages: {
        de: '/',
        en: '/en',
        'x-default': '/',
      },
    },
  };
}

export default async function DynamicWebsitePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; subdomain: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, subdomain } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang;
  const dict = getDictionary(locale);
  const website = await getWebsiteData(subdomain);
  const query = await searchParams;
  const preview = typeof query.template === 'string' ? query.template : '';

  if (!website?.site_data) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900"
        style={{ '--brand-primary': '#4f46e5' } as CSSProperties}
      >
        <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <LanguageSwitcher locale={locale} dict={dict} />
          </div>
          <h1 className="mb-3 text-3xl font-extrabold">{dict.notFound.title}</h1>
          <p className="text-gray-600">{dict.notFound.message}</p>
        </div>
      </div>
    );
  }

  const localized = getLocalizedSiteData(website.site_data, locale);
  const themeConfig =
    process.env.NODE_ENV !== 'production' && isBusinessType(preview)
      ? { theme: preview }
      : website.theme_config;
  const config = buildSiteConfig(localized, dict, locale, themeConfig);

  return <TemplateRenderer data={config} dict={dict} locale={locale} />;
}
