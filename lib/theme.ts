export type ThemeId = 'clinical' | 'luxury' | 'zen' | 'default';

export type ThemeTokens = {
  bg: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  accentText: string;
  badgeBg: string;
};

export const THEME_IDS: ThemeId[] = ['clinical', 'luxury', 'zen', 'default'];

export function surfaceClass(theme: ThemeTokens, extra = '') {
  return [
    'rounded-3xl border shadow-sm transition-all duration-300',
    'hover:-translate-y-0.5 hover:shadow-lg',
    theme.cardBg,
    theme.border,
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

export function iconClass(theme: ThemeTokens) {
  return `inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${theme.badgeBg}`;
}

const CLINICAL_RE =
  /پزشک|درمان|کلینیک|دندان|دکتر|درمانگاه|clinic|doctor|medical|dentist|physio|therapy|hospital/;
const LUXURY_RE =
  /آرایش|زیبایی|سالن|ناخن|کوآف|salon|beauty|hair|makeup|nail|barber|spa.?salon/;
const ZEN_RE = /ماساژ|اسپا|spa|massage|yoga|wellness|ریلکس|حجامت|meditation/;

function collectCorpus(siteData: any): string {
  const sectionBits = Array.isArray(siteData?.sections)
    ? siteData.sections.flatMap((section: any) => [
        section?.type,
        section?.title,
        ...(Array.isArray(section?.items) ? section.items.map((item: any) => item?.name) : []),
      ])
    : [];

  return [
    siteData?.theme,
    siteData?.business_name,
    siteData?.category,
    siteData?.industry,
    siteData?.activity,
    siteData?.business_type,
    ...sectionBits,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function resolveThemeId(siteData: any): ThemeId {
  const explicit = String(siteData?.theme || '').toLowerCase().trim() as ThemeId;
  if (THEME_IDS.includes(explicit)) return explicit;

  const corpus = collectCorpus(siteData);
  if (CLINICAL_RE.test(corpus)) return 'clinical';
  if (LUXURY_RE.test(corpus)) return 'luxury';
  if (ZEN_RE.test(corpus)) return 'zen';
  return 'default';
}
