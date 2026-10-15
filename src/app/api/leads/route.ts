import { NextResponse } from 'next/server';
import { deliverLead, leadErrorMessage, parseLeadPayload, tooManyLeads } from '@/lib/leads';

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const parsed = parseLeadPayload(body);
  if (!parsed.payload) {
    return NextResponse.json({ error: parsed.error || 'invalid' }, { status: 400 });
  }

  const ip = clientIp(request);
  if (tooManyLeads(ip)) {
    return NextResponse.json(
      { error: leadErrorMessage('send_failed', parsed.payload.locale) },
      { status: 429 },
    );
  }

  const result = await deliverLead(parsed.payload);
  if (!result.delivered) {
    return NextResponse.json(
      { error: leadErrorMessage(result.reason, parsed.payload.locale) },
      { status: result.reason === 'no_owner' ? 404 : 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    delivered: result.channels.length > 0,
    saved: result.saved,
    leadId: result.leadId,
    channels: result.channels,
  });
}
