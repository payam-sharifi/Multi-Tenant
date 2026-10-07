import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['de', 'en'] as const;
const defaultLocale = 'de';

function isLocale(value: string): value is (typeof locales)[number] {
  return (locales as readonly string[]).includes(value);
}

function getHostSubdomain(hostHeader: string, mainDomain: string): string | null {
  const hostname = hostHeader.split(':')[0].toLowerCase();
  const domain = mainDomain.toLowerCase();

  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;

  if (hostname.endsWith('.localhost')) {
    const sub = hostname.slice(0, -'.localhost'.length);
    return sub.split('.')[0] || null;
  }

  if (hostname === domain || hostname === `www.${domain}`) return null;

  if (hostname.endsWith(`.${domain}`)) {
    return hostname.slice(0, -(domain.length + 1)).split('.')[0] || null;
  }

  return hostname.split('.')[0] || null;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost';
  let subdomain = getHostSubdomain(hostname, mainDomain);
  const segments = url.pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first === defaultLocale) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = `/${segments.slice(1).join('/')}`;
    return NextResponse.redirect(redirectUrl);
  }

  const locale = first && isLocale(first) ? first : defaultLocale;
  const afterLocale = locale === first ? segments.slice(1) : segments;

  if (!subdomain) {
    subdomain = afterLocale[0] || 'localhost';
    const restSegments = afterLocale.slice(1);
    const restPath = restSegments.length ? `/${restSegments.join('/')}` : '';
    const rewriteUrl = url.clone();
    rewriteUrl.pathname = `/${locale}/${subdomain}${restPath}`;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);

    const response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
    response.headers.set('Content-Language', locale);
    return response;
  }

  const restPath = afterLocale.length ? `/${afterLocale.join('/')}` : '';
  const rewriteUrl = url.clone();
  rewriteUrl.pathname = `/${locale}/${subdomain}${restPath}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
