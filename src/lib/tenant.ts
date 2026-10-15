import { getSupabase } from '@/lib/supabase';

export type UserRow = {
  id: string;
  full_name?: string | null;
  first_name?: string | null;
};

export type WebsiteRow = {
  id?: string;
  user_id?: string | null;
  site_data: unknown;
  theme_config: unknown;
  content_json?: unknown;
  subdomain: string;
  slug?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  status?: string | null;
  is_published?: boolean | null;
};

const WEBSITE_COLUMNS =
  'id, user_id, site_data, theme_config, content_json, subdomain, slug, business_name, business_type, status, is_published';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

export async function getWebsiteData(subdomain: string): Promise<WebsiteRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('websites')
    .select(WEBSITE_COLUMNS)
    .eq('subdomain', subdomain)
    .single();

  if (error || !data) return null;
  return data as WebsiteRow;
}

export async function listUsers(): Promise<UserRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase.from('users').select('id, full_name, first_name');
  if (error || !data) return [];
  return data as UserRow[];
}

export async function getWebsiteById(id: string): Promise<WebsiteRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.from('websites').select(WEBSITE_COLUMNS).eq('id', id).single();
  if (error || !data) return null;
  return data as WebsiteRow;
}

export async function listWebsites(): Promise<WebsiteRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase.from('websites').select(WEBSITE_COLUMNS);
  if (error || !data) return [];
  return data as WebsiteRow[];
}

export async function updateWebsite(id: string, patch: Record<string, unknown>): Promise<WebsiteRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('websites')
    .update(patch)
    .eq('id', id)
    .select(WEBSITE_COLUMNS)
    .single();
  if (error || !data) return null;
  return data as WebsiteRow;
}

export async function deleteWebsite(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from('websites').delete().eq('id', id);
  return !error;
}

export function isActiveWebsite(row: WebsiteRow): boolean {
  if (row.is_published === true || row.status === 'published') return true;
  const theme = asRecord(row.theme_config);
  return theme?.active === true;
}

export function websitesForUser(userId: string, websites: WebsiteRow[]): WebsiteRow[] {
  return websites.filter((row) => row.user_id === userId);
}
