import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // استخراج ساب‌دامین (مثلاً massage-mohammad از massage-mohammad.easysitebuilder.com)
  const subdomain = hostname.split('.')[0];

  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};