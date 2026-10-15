import { deliverTelegram, sendHermesWebhook, sendWhatsApp } from '@/lib/notify';
import { getSupabase } from '@/lib/supabase';
import { getWebsiteById, isActiveWebsite, listWebsites, type WebsiteRow } from '@/lib/tenant';

export const SUPPORT_CHANNELS = ['telegram', 'whatsapp'] as const;
export type SupportChannel = (typeof SUPPORT_CHANNELS)[number];
export type SupportSender = 'admin' | 'user';

export type SupportUser = {
  id: string;
  name: string;
  businessName: string;
  subdomain: string;
  telegramId: string | null;
  whatsappPhone: string | null;
  lastUserPlatform: SupportChannel | null;
  lastMessage: string;
  lastAt: string | null;
  lastSender: SupportSender | null;
};

export type SupportMessage = {
  id: string;
  sender: SupportSender;
  body: string;
  channels: SupportChannel[];
  platform: string | null;
  createdAt: string;
};

export type SiteUnread = {
  count: number;
  lastUserAt: string | null;
};

type UserRow = {
  id: string;
  full_name?: string | null;
  first_name?: string | null;
  language?: string | null;
  telegram_id?: string | null;
  whatsapp_phone?: string | null;
  phone_number?: string | null;
  active_website_id?: string | null;
};

type MessageRow = {
  id: string;
  user_id: string;
  website_id?: string | null;
  sender: string;
  body: string;
  channels?: string[] | null;
  platform?: string | null;
  created_at: string;
};

const MAX_BODY = 2000;

function asString(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'bigint') return value.toString();
  return '';
}

function asChatId(value: unknown): string {
  return asString(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function isSupportChannel(value: string): value is SupportChannel {
  return (SUPPORT_CHANNELS as readonly string[]).includes(value);
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    const next = asString(value);
    if (next) return next;
  }
  return '';
}

function websiteName(row: WebsiteRow): string {
  const site = asRecord(row.site_data) ?? {};
  return firstString(row.business_name, site.business_name, row.slug, row.subdomain);
}

function websiteSlug(row: WebsiteRow): string {
  return firstString(row.slug, row.subdomain);
}

function pickWebsite(user: UserRow, websites: WebsiteRow[]): WebsiteRow | undefined {
  const owned = websites.filter((row) => row.user_id === user.id);
  const active = owned.find((row) => row.id === user.active_website_id);
  if (active) return active;
  return owned.find((row) => isActiveWebsite(row)) ?? owned[0];
}

function telegramErrorMessage(code?: string): string {
  switch (code) {
    case 'telegram_token_missing':
      return 'توکن تلگرام روی سرور تنظیم نشده است.';
    case 'telegram_token_invalid':
      return 'توکن تلگرام نامعتبر است.';
    case 'telegram_blocked':
      return 'کاربر ربات را مسدود کرده یا هنوز استارت نزده است.';
    case 'telegram_chat_not_found':
      return 'ربات به این کاربر دسترسی ندارد. باید یک‌بار با همان ربات حرف زده باشد.';
    default:
      return 'ارسال تلگرام انجام نشد.';
  }
}

function formatAdminEnvelope(body: string, language: string): string {
  if (language.startsWith('de')) {
    return `Nachricht vom Support-Team easyWeb\n\n${body}\n\nAntworten Sie einfach hier.`;
  }
  if (language.startsWith('en')) {
    return `Message from the easyWeb support team\n\n${body}\n\nReply here to continue the conversation.`;
  }
  return `پیام از تیم پشتیبانی easyWeb\n\n${body}\n\nبرای جواب دادن، همین‌جا بنویسید.`;
}

function mapMessage(row: MessageRow): SupportMessage {
  const channels = (row.channels || []).filter(isSupportChannel);
  return {
    id: asString(row.id),
    sender: row.sender === 'admin' ? 'admin' : 'user',
    body: asString(row.body),
    channels,
    platform: asString(row.platform) || null,
    createdAt: asString(row.created_at),
  };
}

function asUserRow(value: unknown): UserRow | null {
  const row = asRecord(value);
  const id = asString(row?.id);
  if (!row || !id) return null;
  return {
    id,
    full_name: asString(row.full_name) || null,
    first_name: asString(row.first_name) || null,
    language: asString(row.language) || null,
    telegram_id: asChatId(row.telegram_id) || asChatId(row.telegramId) || null,
    whatsapp_phone: asChatId(row.whatsapp_phone) || asChatId(row.whatsappPhone) || null,
    phone_number: asString(row.phone_number) || null,
    active_website_id: asString(row.active_website_id) || null,
  };
}

async function fetchUserRows(userId?: string): Promise<UserRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const query = userId
    ? supabase.from('users').select('*').eq('id', userId)
    : supabase.from('users').select('*');
  const { data, error } = await query;
  if (error || !data) {
    if (error) console.error('[support] list users failed', error.message);
    return [];
  }
  return data.map(asUserRow).filter((row): row is UserRow => Boolean(row));
}

async function listUserRows(): Promise<UserRow[]> {
  return fetchUserRows();
}

async function getUserRow(userId: string): Promise<UserRow | null> {
  return (await fetchUserRows(userId))[0] ?? null;
}

async function listMessageRows(): Promise<MessageRow[] | { missing: true }> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('support_messages')
    .select('id, user_id, website_id, sender, body, channels, platform, created_at')
    .order('created_at', { ascending: true });
  if (error) {
    if (error.message.includes('support_messages') || error.code === 'PGRST205' || error.code === '42P01') {
      return { missing: true };
    }
    console.error('[support] list messages failed', error.message);
    return [];
  }
  return (data || []) as MessageRow[];
}

function toSupportUser(
  user: UserRow,
  websites: WebsiteRow[],
  last?: MessageRow,
  lastUserPlatform?: SupportChannel | null,
): SupportUser {
  const website = pickWebsite(user, websites);
  return {
    id: user.id,
    name: firstString(user.full_name, user.first_name, websiteName(website || ({} as WebsiteRow)), user.id.slice(0, 8)),
    businessName: website ? websiteName(website) : '',
    subdomain: website ? websiteSlug(website) : '',
    telegramId: asChatId(user.telegram_id) || null,
    whatsappPhone: asChatId(user.whatsapp_phone) || null,
    lastUserPlatform: lastUserPlatform ?? null,
    lastMessage: last ? asString(last.body) : '',
    lastAt: last ? asString(last.created_at) : null,
    lastSender: last ? (last.sender === 'admin' ? 'admin' : 'user') : null,
  };
}

function lastUserChannel(rows: MessageRow[]): SupportChannel | null {
  const last = [...rows].reverse().find((row) => row.sender === 'user');
  const platform = asString(last?.platform);
  return platform === 'telegram' || platform === 'whatsapp' ? platform : null;
}

export async function listSupportUsers(): Promise<{ users: SupportUser[]; missingTable?: boolean }> {
  const [users, websites, messages] = await Promise.all([
    listUserRows(),
    listWebsites(),
    listMessageRows(),
  ]);
  const missingTable = !Array.isArray(messages);
  const rows = missingTable ? [] : messages;

  const lastByUser = new Map<string, MessageRow>();
  for (const row of rows) {
    lastByUser.set(row.user_id, row);
  }

  const result = users
    .map((user) => toSupportUser(user, websites, lastByUser.get(user.id)))
    .sort((a, b) => {
      if (a.lastAt && b.lastAt) return b.lastAt.localeCompare(a.lastAt);
      if (a.lastAt) return -1;
      if (b.lastAt) return 1;
      return a.name.localeCompare(b.name, 'fa');
    });

  return { users: result, missingTable: missingTable || undefined };
}

function messagesForSite(rows: MessageRow[], site: WebsiteRow): MessageRow[] {
  const siteId = asString(site.id);
  const ownerId = asString(site.user_id);
  return rows.filter((row) => {
    const websiteId = asString(row.website_id);
    if (websiteId) return websiteId === siteId;
    return ownerId && asString(row.user_id) === ownerId;
  });
}

export async function listUnreadBySite(): Promise<{ unread: Record<string, SiteUnread>; missingTable?: boolean }> {
  const [rows, websites, users] = await Promise.all([listMessageRows(), listWebsites(), listUserRows()]);
  if (!Array.isArray(rows)) return { unread: {}, missingTable: true };

  const bySite = new Map<string, MessageRow[]>();
  for (const row of rows) {
    let siteId = asString(row.website_id);
    if (!siteId) {
      const user = users.find((item) => item.id === row.user_id);
      siteId = asString(user ? pickWebsite(user, websites)?.id : '');
    }
    if (!siteId) continue;
    const list = bySite.get(siteId) || [];
    list.push(row);
    bySite.set(siteId, list);
  }

  const unread: Record<string, SiteUnread> = {};
  for (const [siteId, list] of bySite) {
    const lastUser = [...list].reverse().find((row) => row.sender === 'user');
    const last = list.at(-1);
    const count = last?.sender === 'user' ? 1 : 0;
    if (count && lastUser) {
      unread[siteId] = { count, lastUserAt: asString(lastUser.created_at) };
    }
  }
  return { unread };
}

export async function listSupportMessagesBySite(
  siteId: string,
): Promise<{ user?: SupportUser; siteId?: string; messages: SupportMessage[]; missingTable?: boolean; error?: string }> {
  const site = await getWebsiteById(siteId);
  if (!site?.id) return { messages: [], error: 'سایت پیدا نشد' };
  const ownerId = asString(site.user_id);
  if (!ownerId) return { messages: [], error: 'مالک این سایت پیدا نشد' };

  const [user, websites, rows] = await Promise.all([
    getUserRow(ownerId),
    listWebsites(),
    listMessageRows(),
  ]);
  if (!user) return { messages: [], error: 'کاربر پیدا نشد' };
  if (!Array.isArray(rows)) {
    return { user: toSupportUser(user, [site], undefined), siteId: site.id, messages: [], missingTable: true };
  }

  const scoped = messagesForSite(rows, site);
  return {
    user: toSupportUser(user, [site, ...websites], scoped.at(-1), lastUserChannel(scoped)),
    siteId: site.id,
    messages: scoped.map(mapMessage),
  };
}

export async function listSupportMessages(
  userId: string,
): Promise<{ user?: SupportUser; messages: SupportMessage[]; missingTable?: boolean; error?: string }> {
  const [user, websites, rows] = await Promise.all([
    getUserRow(userId),
    listWebsites(),
    listMessageRows(),
  ]);
  if (!user) return { messages: [], error: 'کاربر پیدا نشد' };
  if (!Array.isArray(rows)) return { user: toSupportUser(user, websites), messages: [], missingTable: true };

  const scoped = rows.filter((row) => row.user_id === userId);
  return {
    user: toSupportUser(user, websites, scoped.at(-1), lastUserChannel(scoped)),
    messages: scoped.map(mapMessage),
  };
}

export async function sendSupportMessage(
  userId: string,
  body: string,
  channels: SupportChannel[],
  websiteId?: string,
): Promise<{
  message?: SupportMessage;
  channels: SupportChannel[];
  error?: string;
  warning?: string;
  missingTable?: boolean;
}> {
  const text = body.trim();
  if (!text) return { channels: [], error: 'متن پیام خالی است' };
  if (text.length > MAX_BODY) return { channels: [], error: `پیام حداکثر ${MAX_BODY} کاراکتر باشد` };

  const supabase = getSupabase();
  if (!supabase) return { channels: [], error: 'اتصال دیتابیس برقرار نیست' };

  const user = await getUserRow(userId);
  if (!user) return { channels: [], error: 'کاربر پیدا نشد' };

  const websites = await listWebsites();
  const website = websiteId
    ? websites.find((row) => asString(row.id) === websiteId) || (await getWebsiteById(websiteId))
    : pickWebsite(user, websites);
  if (websiteId && website && asString(website.user_id) && asString(website.user_id).toLowerCase() !== user.id.toLowerCase()) {
    return { channels: [], error: 'این سایت برای این کاربر نیست' };
  }

  const telegramId = asChatId(user.telegram_id);
  const whatsappPhone = asChatId(user.whatsapp_phone);
  const selected = channels.filter(isSupportChannel);
  const targets: SupportChannel[] = selected.length
    ? selected
    : telegramId
      ? ['telegram']
      : whatsappPhone
        ? ['whatsapp']
        : [];
  if (!targets.length) {
    return { channels: [], error: 'این کاربر تلگرام یا واتساپ ندارد' };
  }

  const envelope = formatAdminEnvelope(text, asString(user.language) || 'fa');
  const delivered: SupportChannel[] = [];
  let lastError = '';

  if (targets.includes('telegram')) {
    if (!telegramId) lastError = 'این کاربر تلگرام ندارد';
    else {
      const sent = await deliverTelegram(telegramId, envelope);
      if (sent.ok) delivered.push('telegram');
      else lastError = telegramErrorMessage(sent.error);
    }
  }
  if (targets.includes('whatsapp')) {
    if (!whatsappPhone) lastError = lastError || 'این کاربر واتساپ ندارد';
    else {
      const sent =
        (await sendWhatsApp(whatsappPhone, envelope)) ||
        (await sendHermesWebhook('website-lead-whatsapp', whatsappPhone, envelope));
      if (sent) delivered.push('whatsapp');
      else lastError = lastError || 'ارسال واتساپ انجام نشد. توکن واتساپ روی سرور تنظیم نشده.';
    }
  }

  const { data, error } = await supabase
    .from('support_messages')
    .insert({
      user_id: user.id,
      website_id: website?.id || null,
      sender: 'admin',
      body: text,
      channels: delivered,
      platform: delivered[0] || targets[0] || null,
    })
    .select('id, user_id, website_id, sender, body, channels, platform, created_at')
    .maybeSingle();

  if (error) {
    if (error.message.includes('support_messages') || error.code === 'PGRST205' || error.code === '42P01') {
      return { channels: delivered, missingTable: true, error: 'جدول پیام‌ها در دیتابیس ساخته نشده' };
    }
    console.error('[support] save failed', error.message);
    if (delivered.length) return { channels: delivered, error: 'پیام ارسال شد ولی در پنل ذخیره نشد' };
    return { channels: [], error: lastError || 'جواب ذخیره نشد' };
  }

  const message = data ? mapMessage(data as MessageRow) : undefined;
  if (!delivered.length) {
    return {
      message,
      channels: [],
      warning: lastError || 'جواب در پنل ثبت شد. ارسال به تلگرام/واتساپ انجام نشد.',
    };
  }

  return { message, channels: delivered };
}

export async function sendSupportMessageToSite(
  siteId: string,
  body: string,
  channels: SupportChannel[],
): Promise<{
  message?: SupportMessage;
  channels: SupportChannel[];
  error?: string;
  warning?: string;
  missingTable?: boolean;
}> {
  const site = await getWebsiteById(siteId);
  const ownerId = asString(site?.user_id);
  if (!site || !ownerId) return { channels: [], error: 'سایت پیدا نشد' };
  return sendSupportMessage(ownerId, body, channels, asString(site.id));
}

export async function recordUserSupportMessage(input: {
  userId: string;
  body: string;
  platform: SupportChannel;
  websiteId?: string | null;
}): Promise<{ id?: string; error?: string }> {
  const text = input.body.trim();
  if (!text) return { error: 'empty' };
  const supabase = getSupabase();
  if (!supabase) return { error: 'no_db' };

  const { data, error } = await supabase
    .from('support_messages')
    .insert({
      user_id: input.userId,
      website_id: input.websiteId || null,
      sender: 'user',
      body: text.slice(0, MAX_BODY),
      channels: [input.platform],
      platform: input.platform,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[support] record user message failed', error.message);
    return { error: error.message };
  }
  return { id: asString(data?.id) || undefined };
}
