import clinicBaseFixture from '@/fixtures/clinic-base.json';
import clinicHermesFixture from '@/fixtures/clinic-hermes-minimal.json';
import clinicHermesFullFixture from '@/fixtures/clinic-hermes-full.json';
import handwerkBaseFixture from '@/fixtures/handwerk-base.json';
import handwerkHermesFixture from '@/fixtures/handwerk-hermes-minimal.json';
import handwerkHermesFullFixture from '@/fixtures/handwerk-hermes-full.json';
import haustechnikBaseFixture from '@/fixtures/haustechnik-base.json';
import { isBusinessType } from '@/lib/site-config';
import type { WebsiteRow } from '@/lib/tenant';

export function resolveTenantBasePath(hostHeader: string | null, subdomain: string): string {
  const hostname = (hostHeader || '').split(':')[0].toLowerCase();
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `/${subdomain}`;
  }
  return '';
}

export function getDevFixture(
  query: Record<string, string | string[] | undefined>,
): WebsiteRow | null {
  const fixture = query.fixture;
  switch (fixture) {
    case 'clinic-base':
    case 'clinic-premium':
      return clinicBaseFixture as WebsiteRow;
    case 'clinic-hermes-minimal':
      return clinicHermesFixture as WebsiteRow;
    case 'clinic-hermes-full':
      return clinicHermesFullFixture as WebsiteRow;
    case 'handwerk-base':
    case 'handwerk-premium':
      return handwerkBaseFixture as WebsiteRow;
    case 'handwerk-hermes-minimal':
      return handwerkHermesFixture as WebsiteRow;
    case 'handwerk-hermes-full':
      return handwerkHermesFullFixture as WebsiteRow;
    case 'haustechnik-base':
    case 'haustechnik-premium':
    case 'mueller-haustechnik':
      return haustechnikBaseFixture as WebsiteRow;
    default:
      return null;
  }
}

export function resolvePreviewThemeConfig(
  query: Record<string, string | string[] | undefined>,
  themeConfig: unknown,
): unknown {
  const preview = typeof query.template === 'string' ? query.template : '';
  if (preview === 'clinic-base' || preview === 'clinic-premium') {
    return { theme: 'medical', template: 'clinic-base' };
  }
  if (preview === 'handwerk-base' || preview === 'handwerk-premium') {
    return { theme: 'services', template: 'handwerk-base' };
  }
  if (
    preview === 'haustechnik-base' ||
    preview === 'haustechnik-premium' ||
    preview === 'mueller-haustechnik'
  ) {
    return { theme: 'services', template: 'haustechnik-base' };
  }
  if (isBusinessType(preview)) return { theme: preview };
  return themeConfig;
}
