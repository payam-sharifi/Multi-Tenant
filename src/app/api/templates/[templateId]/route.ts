import { NextResponse } from 'next/server';
import { isTemplateId } from '@/templates/registry';
import { readTemplateFixture, writeTemplateFixture } from '@/lib/template-dashboard';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await params;
  if (!isTemplateId(templateId)) {
    return NextResponse.json({ error: 'قالب پیدا نشد' }, { status: 404 });
  }

  const fixture = await readTemplateFixture(templateId);
  return NextResponse.json({ templateId, fixture });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> },
) {
  const { templateId } = await params;
  if (!isTemplateId(templateId)) {
    return NextResponse.json({ error: 'قالب پیدا نشد' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'بدنهٔ درخواست نامعتبر است' }, { status: 400 });
  }

  const fixture = body && typeof body === 'object' && 'fixture' in body
    ? (body as { fixture: unknown }).fixture
    : body;

  if (!fixture || typeof fixture !== 'object') {
    return NextResponse.json({ error: 'جیسون باید یک آبجکت باشد' }, { status: 400 });
  }

  await writeTemplateFixture(templateId, fixture);
  return NextResponse.json({ ok: true, templateId, fixture });
}
