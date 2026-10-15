import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import type { SiteConfig } from '@/lib/types/template';

export type TemplateProps = {
  data: SiteConfig;
  dict: Dictionary;
  locale: Locale;
};

export type NavLink = { href: string; label: string };
