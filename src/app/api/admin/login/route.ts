import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminToken, checkAdminCredentials } from '@/lib/admin-auth';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'ورود نامعتبر است' }, { status: 400 });
  }

  const username = body && typeof body === 'object' && 'username' in body ? String((body as { username: unknown }).username ?? '') : '';
  const password = body && typeof body === 'object' && 'password' in body ? String((body as { password: unknown }).password ?? '') : '';

  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json({ error: 'یوزر یا پسورد اشتباه است' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: adminToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
