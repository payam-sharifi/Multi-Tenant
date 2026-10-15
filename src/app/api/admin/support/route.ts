import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/require-admin';
import { listSupportUsers } from '@/lib/support';

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const result = await listSupportUsers();
  return NextResponse.json(result);
}
