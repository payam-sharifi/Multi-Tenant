import type { CSSProperties } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/paths';
import { loadTenantSite } from '@/lib/load-tenant-site';
import { LegalPage } from '@/shared';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; subdomain: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : 'de';
  return { title: getDictionary(locale).legal.datenschutz };
}

export default async function DatenschutzPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; subdomain: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, subdomain } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang;
  const query = await searchParams;
  const host = (await headers()).get('host');
  const tenant = await loadTenantSite({ locale, subdomain, query, host });
  if (!tenant) notFound();

  const { dict, config: data } = tenant;

  return (
    <div
      style={
        {
          '--brand-primary': data.branding.primaryColor,
          '--brand-secondary': data.branding.secondaryColor,
        } as CSSProperties
      }
    >
      <LegalPage
        title={dict.legal.datenschutz}
        backHref={`${localizedPath(data.basePath || '/', locale)}${data.previewQuery || ''}`}
        backLabel={dict.legal.back}
      >
        <p>{dict.legal.privacyIntro}</p>
        <p>
          {data.branding.name}
          <br />
          {data.branding.address}
          <br />
          {data.branding.email}
        </p>
        <p>{dict.legal.privacyForm}</p>
        <p>{dict.legal.privacyStorage}</p>
        <p>{dict.legal.privacyRights}</p>
        <p>{dict.legal.privacyHosting}</p>
      </LegalPage>
    </div>
  );
}
