import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/require-admin';
import { listUnreadBySite } from '@/lib/support';

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;
  return NextResponse.json(await listUnreadBySite());
}
