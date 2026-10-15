import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, hasAdminCookie } from '@/lib/admin-auth';

export async function requireAdminApi(): Promise<NextResponse | null> {
  const jar = await cookies();
  if (hasAdminCookie(jar.get(ADMIN_COOKIE)?.value)) return null;
  return NextResponse.json({ error: 'وارد شوید' }, { status: 401 });
}
