import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/require-admin';
import { isSupportChannel, listSupportMessages, sendSupportMessage, type SupportChannel } from '@/lib/support';

function asChannels(value: unknown): SupportChannel[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item)).filter(isSupportChannel))];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { userId } = await params;
  const result = await listSupportMessages(userId);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json(result);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const denied = await requireAdminApi();
  if (denied) return denied;
  const { userId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'بدنهٔ درخواست نامعتبر است' }, { status: 400 });
  }

  const payload = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const text = typeof payload.body === 'string' ? payload.body : '';
  const result = await sendSupportMessage(userId, text, asChannels(payload.channels));
  if (result.error) {
    return NextResponse.json(result, { status: result.missingTable ? 503 : 400 });
  }
  return NextResponse.json(result);
}
