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
  return { title: getDictionary(locale).legal.impressum };
}

export default async function ImpressumPage({
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
        title={dict.legal.impressum}
        backHref={`${localizedPath(data.basePath || '/', locale)}${data.previewQuery || ''}`}
        backLabel={dict.legal.back}
      >
        <p>{dict.legal.placeholderNote}</p>
        <h2 className="pt-2 text-base font-bold text-neutral-900">{dict.legal.responsible}</h2>
        <p>
          {data.branding.name}
          <br />
          {data.branding.address}
        </p>
        {data.owner ? (
          <>
            <h2 className="pt-2 text-base font-bold text-neutral-900">{dict.legal.representedBy}</h2>
            <p>{data.owner}</p>
          </>
        ) : null}
        <h2 className="pt-2 text-base font-bold text-neutral-900">{dict.legal.contactHeading}</h2>
        <p>
          {dict.contact.phone}: {data.branding.phone}
          <br />
          {dict.contact.email}: {data.branding.email}
        </p>
      </LegalPage>
    </div>
  );
}
