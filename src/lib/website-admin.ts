import type { WebsiteRow } from '@/lib/tenant';

export type SiteFields = {
  subdomain: string;
  businessName: string;
  businessType: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  published: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function str(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    const next = str(value);
    if (next) return next;
  }
  return '';
}

export function sanitizeSubdomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function heroTitleFromSite(site: Record<string, unknown>): string {
  const sections = Array.isArray(site.sections) ? site.sections : [];
  const hero = sections.find((item) => str(asRecord(item)?.type).toLowerCase() === 'hero');
  return firstString(asRecord(hero)?.title, asRecord(hero)?.heading);
}

export function extractSiteFields(row: WebsiteRow): SiteFields {
  const site = asRecord(row.site_data) ?? {};
  const content = asRecord(row.content_json) ?? {};
  const contact = asRecord(content.contact) ?? asRecord(site.contact) ?? {};
  return {
    subdomain: firstString(row.slug, row.subdomain),
    businessName: firstString(row.business_name, site.business_name, heroTitleFromSite(site)),
    businessType: firstString(row.business_type, site.business_type),
    phone: firstString(site.phone, contact.phone, site.contact_phone),
    email: firstString(site.email, contact.email, site.contact_email),
    address: firstString(site.address, contact.address),
    hours: firstString(site.working_hours, contact.opening_hours, contact.hours),
    published: row.is_published === true || row.status === 'published',
  };
}

function upsertHeroTitle(siteData: Record<string, unknown>, title: string): void {
  if (!title) return;
  const sections = Array.isArray(siteData.sections) ? [...siteData.sections] : [];
  const index = sections.findIndex((item) => str(asRecord(item)?.type).toLowerCase() === 'hero');
  if (index >= 0) {
    const hero = { ...(asRecord(sections[index]) ?? {}), type: 'hero', title };
    sections[index] = hero;
  }
  siteData.sections = sections;
}

export function applySiteFields(row: WebsiteRow, fields: SiteFields): Record<string, unknown> {
  const subdomain = sanitizeSubdomain(fields.subdomain);
  const siteData = { ...(asRecord(row.site_data) ?? {}) };
  const content = { ...(asRecord(row.content_json) ?? {}) };
  const contact = { ...(asRecord(content.contact) ?? {}) };
  const hero = { ...(asRecord(content.hero) ?? {}) };

  if (fields.businessName) siteData.business_name = fields.businessName;
  siteData.phone = fields.phone;
  siteData.email = fields.email;
  siteData.address = fields.address;
  siteData.working_hours = fields.hours;
  if (fields.businessName) upsertHeroTitle(siteData, fields.businessName);

  contact.phone = fields.phone;
  contact.email = fields.email;
  contact.address = fields.address;
  contact.opening_hours = fields.hours;
  hero.title = fields.businessName || str(hero.title);
  content.contact = contact;
  content.hero = hero;

  return {
    subdomain,
    slug: subdomain,
    business_name: fields.businessName || null,
    business_type: fields.businessType || null,
    status: fields.published ? 'published' : 'draft',
    is_published: fields.published,
    site_data: siteData,
    content_json: content,
  };
}
