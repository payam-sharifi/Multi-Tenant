import { getSupabase } from '@/lib/supabase';

export type WebsiteRow = {
  site_data: unknown;
  theme_config: unknown;
  subdomain: string;
};

export async function getWebsiteData(subdomain: string): Promise<WebsiteRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('websites')
    .select('site_data, theme_config, subdomain')
    .eq('subdomain', subdomain)
    .single();

  if (error || !data) return null;
  return data as WebsiteRow;
}
