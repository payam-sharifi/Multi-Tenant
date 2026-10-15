import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { resolveLocale } from '@/lib/i18n/config';
import { getLocalizedSiteData } from '@/lib/i18n/localize';
import { buildSiteConfig } from '@/lib/site-config';

/**
 * Public, read-only view of a tenant's services section, already localized and validated.
 * GET /api/sites/<subdomain>/services?lang=de|en
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ subdomain: string }> },
) {
  const { subdomain } = await params;
  const locale = resolveLocale(new URL(request.url).searchParams.get('lang'));

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('websites')
    .select('site_data, theme_config')
    .eq('subdomain', subdomain)
    .single();

  if (error || !data?.site_data) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 });
  }

  const dict = getDictionary(locale);
  const config = buildSiteConfig(
    getLocalizedSiteData(data.site_data, locale),
    dict,
    locale,
    data.theme_config,
  );

  return NextResponse.json({
    locale,
    ...config.servicesBlock,
    items: config.services,
  });
}
