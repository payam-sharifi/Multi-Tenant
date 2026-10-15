import { createHmac } from 'crypto';
import { getSupabase } from '@/lib/supabase';

export const LEAD_KINDS = [
  'contact',
  'quote',
  'inquiry',
  'booking',
  'appointment',
  'reservation',
] as const;

export type LeadKind = (typeof LEAD_KINDS)[number];
export type LeadFields = Record<string, string>;

export type LeadPayload = {
  subdomain: string;
  kind: LeadKind;
  fields: LeadFields;
  locale?: string;
};

type Owner = {
  userId: string;
  websiteId: string;
  subdomain: string;
  businessName: string;
  telegramId: string | null;
  whatsappPhone: string | null;
};

const MAX_FIELDS = 20;
const MAX_KEY = 40;
const MAX_VALUE = 500;
const MAX_MESSAGE = 2000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 8;
const hits = new Map<string, number[]>();

const KIND_LABELS: Record<LeadKind, { de: string; en: string }> = {
  contact: { de: 'Kontaktformular', en: 'Contact form' },
  quote: { de: 'Angebotsanfrage', en: 'Quote request' },
  inquiry: { de: 'Anfrage', en: 'Inquiry' },
  booking: { de: 'Terminanfrage', en: 'Appointment request' },
  appointment: { de: 'Terminanfrage', en: 'Appointment request' },
  reservation: { de: 'Reservierung', en: 'Reservation' },
};

const FIELD_LABELS: Record<string, { de: string; en: string }> = {
  firstName: { de: 'Vorname', en: 'First name' },
  lastName: { de: 'Nachname', en: 'Last name' },
  name: { de: 'Name', en: 'Name' },
  email: { de: 'E-Mail', en: 'Email' },
  phone: { de: 'Telefon', en: 'Phone' },
  message: { de: 'Nachricht', en: 'Message' },
  note: { de: 'Nachricht', en: 'Message' },
  service: { de: 'Leistung', en: 'Service' },
  spec: { de: 'Fachrichtung', en: 'Specialization' },
  doctor: { de: 'Arzt', en: 'Doctor' },
  date: { de: 'Datum', en: 'Date' },
  time: { de: 'Uhrzeit', en: 'Time' },
  guests: { de: 'Gäste', en: 'Guests' },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

export function isLeadKind(value: string): value is LeadKind {
  return (LEAD_KINDS as readonly string[]).includes(value);
}

export function parseLeadPayload(body: unknown): { payload?: LeadPayload; error?: string } {
  if (!isRecord(body)) return { error: 'invalid' };

  const subdomain = asString(body.subdomain)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 80);
  if (!subdomain) return { error: 'subdomain' };

  const kindRaw = asString(body.kind) || 'contact';
  if (!isLeadKind(kindRaw)) return { error: 'kind' };

  if (asString(body.website)) {
    return { payload: { subdomain, kind: kindRaw, fields: {}, locale: asString(body.locale) } };
  }

  const rawFields = isRecord(body.fields) ? body.fields : {};
  const fields: LeadFields = {};
  for (const [key, value] of Object.entries(rawFields)) {
    if (Object.keys(fields).length >= MAX_FIELDS) break;
    const safeKey = key.replace(/[^\w.-]/g, '').slice(0, MAX_KEY);
    if (!safeKey || safeKey === 'website' || safeKey === 'privacy') continue;
    const text = asString(value);
    if (!text) continue;
    const limit = safeKey === 'message' || safeKey === 'note' ? MAX_MESSAGE : MAX_VALUE;
    fields[safeKey] = text.slice(0, limit);
  }

  if (!Object.keys(fields).length) return { error: 'fields' };

  return {
    payload: {
      subdomain,
      kind: kindRaw,
      fields,
      locale: asString(body.locale),
    },
  };
}

export function tooManyLeads(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function ownerFromJoin(row: Record<string, unknown>): Owner {
  const nested = row.users;
  const user = Array.isArray(nested)
    ? (nested[0] as Record<string, unknown> | undefined)
    : isRecord(nested)
      ? nested
      : null;
  return {
    userId: asString(user?.id) || asString(row.user_id),
    websiteId: asString(row.id),
    subdomain: asString(row.subdomain) || asString(row.slug),
    businessName: asString(row.business_name),
    telegramId: asString(user?.telegram_id) || null,
    whatsappPhone: asString(user?.whatsapp_phone) || asString(user?.phone_number) || null,
  };
}

export async function findWebsiteOwner(subdomain: string): Promise<Owner | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('websites')
    .select('id, subdomain, slug, business_name, user_id, users(id, telegram_id, whatsapp_phone, phone_number)')
    .or(`subdomain.eq.${subdomain},slug.eq.${subdomain}`)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return ownerFromJoin(data as Record<string, unknown>);
}

function siteUrl(subdomain: string): string {
  const domain = process.env.NEXT_PUBLIC_PUBLIC_DOMAIN || 'easywebbuilder.de';
  return `https://${subdomain}.${domain}`;
}

export function formatLeadMessage(owner: Owner, payload: LeadPayload): string {
  const lang = payload.locale === 'en' ? 'en' : 'de';
  const kind = KIND_LABELS[payload.kind][lang];
  const lines: string[] = [
    lang === 'de' ? '📩 Neue Anfrage von Ihrer Website' : '📩 New enquiry from your website',
    '',
    `🏢 ${owner.businessName || owner.subdomain}`,
    `🌐 ${siteUrl(owner.subdomain || payload.subdomain)}`,
    `📋 ${kind}`,
    '',
  ];

  const name = [payload.fields.firstName, payload.fields.lastName].filter(Boolean).join(' ');
  const ordered = new Map<string, string>();
  if (name) ordered.set('name', name);
  for (const key of Object.keys(FIELD_LABELS)) {
    if (key === 'firstName' || key === 'lastName') continue;
    const value = payload.fields[key];
    if (value) ordered.set(key, value);
  }
  for (const [key, value] of Object.entries(payload.fields)) {
    if (key === 'firstName' || key === 'lastName' || ordered.has(key)) continue;
    ordered.set(key, value);
  }

  for (const [key, value] of ordered) {
    const label = FIELD_LABELS[key]?.[lang] ?? key;
    if (key === 'message' || key === 'note') {
      lines.push(`${label}:`, value, '');
    } else {
      lines.push(`${label}: ${value}`);
    }
  }

  lines.push(
    lang === 'de'
      ? 'Antworten Sie direkt hier — oder rufen Sie die Person an.'
      : 'Reply here, or call the person back.',
  );
  return lines.filter((line, index, all) => line !== '' || all[index - 1] !== '').join('\n');
}

async function sendTelegram(chatId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('[leads] TELEGRAM_BOT_TOKEN missing; cannot notify owner');
    return false;
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[leads] telegram send failed', response.status, detail.slice(0, 240));
    return false;
  }
  return true;
}

async function sendWhatsApp(phone: string, text: string): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return false;

  const to = phone.replace(/\D/g, '');
  if (!to) return false;

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text, preview_url: false },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[leads] whatsapp send failed', response.status, detail.slice(0, 240));
    return false;
  }
  return true;
}

async function sendHermesWebhook(route: 'website-lead-telegram' | 'website-lead-whatsapp', chatId: string, text: string): Promise<boolean> {
  const base = (process.env.HERMES_WEBHOOK_URL || '').replace(/\/$/, '');
  const secret = process.env.HERMES_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || '';
  if (!base || !chatId) return false;

  const body = JSON.stringify({ chat_id: chatId, message: text });
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) {
    headers['X-Hub-Signature-256'] = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
  }

  try {
    const response = await fetch(`${base}/webhooks/${route}`, {
      method: 'POST',
      headers,
      body,
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[leads] hermes webhook failed', route, response.status, detail.slice(0, 240));
      return false;
    }
    return true;
  } catch (error) {
    console.error('[leads] hermes webhook error', route, error);
    return false;
  }
}

export type LeadDelivery = {
  delivered: boolean;
  saved: boolean;
  leadId?: string;
  channels: Array<'telegram' | 'whatsapp'>;
  reason?: 'no_owner' | 'no_channel' | 'send_failed' | 'honeypot' | 'skipped';
};

async function saveLead(
  owner: Owner,
  payload: LeadPayload,
  message: string,
  channels: Array<'telegram' | 'whatsapp'>,
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase || !owner.userId) return null;

  const { data, error } = await supabase
    .from('leads')
    .insert({
      user_id: owner.userId,
      website_id: owner.websiteId || null,
      kind: payload.kind,
      fields: payload.fields,
      message,
      channels,
      locale: payload.locale || 'de',
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[leads] save failed', error.message);
    return null;
  }
  return asString(data?.id) || null;
}

export async function deliverLead(payload: LeadPayload): Promise<LeadDelivery> {
  if (!Object.keys(payload.fields).length) {
    return { delivered: true, saved: false, channels: [], reason: 'honeypot' };
  }

  const owner = await findWebsiteOwner(payload.subdomain);
  if (!owner) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[leads] no website for subdomain, skipping send', payload.subdomain);
      return { delivered: true, saved: false, channels: [], reason: 'skipped' };
    }
    return { delivered: false, saved: false, channels: [], reason: 'no_owner' };
  }

  const text = formatLeadMessage(owner, payload);
  const channels: Array<'telegram' | 'whatsapp'> = [];

  if (owner.telegramId) {
    const sent =
      (await sendTelegram(owner.telegramId, text)) ||
      (await sendHermesWebhook('website-lead-telegram', owner.telegramId, text));
    if (sent) channels.push('telegram');
  }
  if (owner.whatsappPhone) {
    const sent =
      (await sendWhatsApp(owner.whatsappPhone, text)) ||
      (await sendHermesWebhook('website-lead-whatsapp', owner.whatsappPhone, text));
    if (sent) channels.push('whatsapp');
  }

  if (owner.telegramId && !channels.includes('telegram')) {
    console.error('[leads] telegram notify failed for', owner.subdomain);
  }
  if (owner.whatsappPhone && !channels.includes('whatsapp')) {
    console.error('[leads] whatsapp notify failed for', owner.subdomain);
  }

  const leadId = await saveLead(owner, payload, text, channels);
  const saved = Boolean(leadId);

  if (!saved && !channels.length) {
    if (!owner.telegramId && !owner.whatsappPhone) {
      return { delivered: false, saved: false, channels: [], reason: 'no_channel' };
    }
    return { delivered: false, saved: false, channels: [], reason: 'send_failed' };
  }

  return { delivered: true, saved, leadId: leadId || undefined, channels };
}

export function leadErrorMessage(reason: LeadDelivery['reason'], locale?: string): string {
  const en = locale === 'en';
  switch (reason) {
    case 'no_owner':
      return en ? 'This website could not be found.' : 'Diese Website wurde nicht gefunden.';
    case 'no_channel':
    case 'send_failed':
      return en
        ? 'The message could not be delivered. Please call us or try again.'
        : 'Die Nachricht konnte nicht zugestellt werden. Bitte rufen Sie uns an oder versuchen Sie es erneut.';
    default:
      return en ? 'The message could not be sent.' : 'Die Nachricht konnte nicht gesendet werden.';
  }
}
