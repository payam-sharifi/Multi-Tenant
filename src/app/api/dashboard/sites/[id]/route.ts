import { NextResponse } from 'next/server';
import { deleteWebsite, getWebsiteById, listWebsites, updateWebsite } from '@/lib/tenant';
import { applySiteFields, sanitizeSubdomain, type SiteFields } from '@/lib/website-admin';

function asFields(body: unknown): SiteFields | null {
  if (!body || typeof body !== 'object') return null;
  const value = body as Record<string, unknown>;
  const text = (key: string) => (typeof value[key] === 'string' ? value[key] : '');
  return {
    subdomain: text('subdomain'),
    businessName: text('businessName'),
    businessType: text('businessType'),
    phone: text('phone'),
    email: text('email'),
    address: text('address'),
    hours: text('hours'),
    published: value.published !== false,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const current = await getWebsiteById(id);
  if (!current) {
    return NextResponse.json({ error: 'سایت پیدا نشد' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'بدنهٔ درخواست نامعتبر است' }, { status: 400 });
  }

  const fields = asFields(body);
  if (!fields) {
    return NextResponse.json({ error: 'داده‌ها نامعتبر است' }, { status: 400 });
  }

  const subdomain = sanitizeSubdomain(fields.subdomain);
  if (!subdomain) {
    return NextResponse.json({ error: 'زیردامنه را وارد کنید' }, { status: 400 });
  }

  const taken = (await listWebsites()).some(
    (row) => row.id !== id && sanitizeSubdomain(row.slug || row.subdomain) === subdomain,
  );
  if (taken) {
    return NextResponse.json({ error: 'این زیردامنه قبلاً گرفته شده' }, { status: 409 });
  }

  const updated = await updateWebsite(id, applySiteFields(current, { ...fields, subdomain }));
  if (!updated) {
    return NextResponse.json({ error: 'ذخیره نشد' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, site: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const current = await getWebsiteById(id);
  if (!current) {
    return NextResponse.json({ error: 'سایت پیدا نشد' }, { status: 404 });
  }

  const ok = await deleteWebsite(id);
  if (!ok) {
    return NextResponse.json({ error: 'حذف نشد' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
