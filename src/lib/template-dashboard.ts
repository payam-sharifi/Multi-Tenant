import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { buildSiteConfig } from '@/lib/site-config';
import {
  isActiveWebsite,
  listUsers,
  listWebsites,
  websitesForUser,
  type UserRow,
  type WebsiteRow,
} from '@/lib/tenant';
import { TEMPLATE_GALLERY, type GalleryCard } from '@/lib/template-gallery';
import { extractSiteFields, type SiteFields } from '@/lib/website-admin';
import { isTemplateId, resolveTemplateId, type TemplateId } from '@/templates/registry';

export type TemplateTenant = SiteFields & {
  id: string;
  name: string;
  owner?: string;
};

export type TemplateDashboard = {
  template: GalleryCard;
  fixture: unknown;
  tenants: TemplateTenant[];
};

const FIXTURE_FILES: Record<TemplateId, string> = {
  'clinic-base': 'clinic-base.json',
  'handwerk-base': 'handwerk-base.json',
  'haustechnik-base': 'haustechnik-base.json',
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

function fixturePath(templateId: TemplateId): string {
  return path.join(process.cwd(), 'src/fixtures', FIXTURE_FILES[templateId]);
}

export function getGalleryTemplate(templateId: string): GalleryCard | null {
  return TEMPLATE_GALLERY.find((item) => item.id === templateId) ?? null;
}

export async function readTemplateFixture(templateId: TemplateId): Promise<unknown> {
  const text = await readFile(fixturePath(templateId), 'utf8');
  return JSON.parse(text) as unknown;
}

export async function writeTemplateFixture(templateId: TemplateId, value: unknown): Promise<void> {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(fixturePath(templateId), text, 'utf8');
}

function heroTitle(raw: Record<string, unknown>): string {
  const sections = Array.isArray(raw.sections) ? raw.sections : [];
  const hero = sections.find((item) => str(asRecord(item)?.type).toLowerCase() === 'hero');
  const record = asRecord(hero);
  return firstString(record?.title, record?.heading);
}

function tenantFromRow(row: WebsiteRow, user?: UserRow): TemplateTenant {
  const raw = asRecord(row.site_data) ?? {};
  const branding = asRecord(raw.branding);
  const fields = extractSiteFields(row);
  const name = firstString(
    fields.businessName,
    raw.business_name,
    raw.name,
    branding?.name,
    raw.owner_name,
    raw.owner,
    heroTitle(raw),
    user?.full_name,
    user?.first_name,
    fields.subdomain,
  );
  const owner =
    firstString(user?.full_name, user?.first_name, raw.owner_name, raw.owner, raw.doctor_name) ||
    undefined;
  return { id: String(row.id || ''), ...fields, name, owner };
}

export async function listTemplateTenants(templateId: TemplateId): Promise<TemplateTenant[]> {
  const counts = await listActiveTenantsByTemplate();
  return counts[templateId] ?? [];
}

export async function listActiveTenantsByTemplate(): Promise<Record<TemplateId, TemplateTenant[]>> {
  const [users, websites] = await Promise.all([listUsers(), listWebsites()]);
  const seen = new Set<string>();
  const byTemplate = Object.fromEntries(
    TEMPLATE_GALLERY.map((item) => [item.id, [] as TemplateTenant[]]),
  ) as Record<TemplateId, TemplateTenant[]>;

  for (const user of users) {
    for (const row of websitesForUser(user.id, websites)) {
      const subdomain = firstString(row.slug, row.subdomain);
      if (!row.id || !subdomain || seen.has(subdomain) || !isActiveWebsite(row)) continue;

      const templateId = resolveTemplateId(
        buildSiteConfig(row.site_data, getDictionary('de'), 'de', row.theme_config),
      );
      if (!byTemplate[templateId]) continue;
      seen.add(subdomain);
      byTemplate[templateId].push(tenantFromRow(row, user));
    }
  }

  for (const templateId of Object.keys(byTemplate) as TemplateId[]) {
    byTemplate[templateId].sort((a, b) => a.name.localeCompare(b.name, 'fa'));
  }
  return byTemplate;
}

export async function loadTemplateDashboard(templateId: string): Promise<TemplateDashboard | null> {
  if (!isTemplateId(templateId)) return null;
  const template = getGalleryTemplate(templateId);
  if (!template) return null;

  const [fixture, tenants] = await Promise.all([
    readTemplateFixture(templateId),
    listTemplateTenants(templateId),
  ]);

  return { template, fixture, tenants };
}
