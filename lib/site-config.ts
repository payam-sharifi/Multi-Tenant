import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import {
  BUSINESS_TYPES,
  type BusinessType,
  type FaqItem,
  type GalleryItem,
  type MenuCategory,
  type SiteConfig,
  type SiteService,
} from '@/lib/types/template';

export const DEFAULT_COLORS: Record<
  BusinessType,
  { primary: string; secondary: string }
> = {
  medical: { primary: '#1d4ed8', secondary: '#0f766e' },
  salon: { primary: '#d97706', secondary: '#1c1917' },
  restaurant: { primary: '#9f1239', secondary: '#b45309' },
  services: { primary: '#0f766e', secondary: '#134e4a' },
  general: { primary: '#4f46e5', secondary: '#312e81' },
};

const ALIASES: Record<string, BusinessType> = {
  medical: 'medical',
  clinic: 'medical',
  clinical: 'medical',
  doctor: 'medical',
  praxis: 'medical',
  arzt: 'medical',
  zahnarzt: 'medical',
  dentist: 'medical',
  hospital: 'medical',
  klinik: 'medical',
  salon: 'salon',
  luxury: 'salon',
  beauty: 'salon',
  hair: 'salon',
  barber: 'salon',
  barbery: 'salon',
  friseur: 'salon',
  kosmetik: 'salon',
  restaurant: 'restaurant',
  cafe: 'restaurant',
  café: 'restaurant',
  gastro: 'restaurant',
  bistro: 'restaurant',
  food: 'restaurant',
  küche: 'restaurant',
  kuche: 'restaurant',
  pizzeria: 'restaurant',
  bakery: 'restaurant',
  bäckerei: 'restaurant',
  services: 'services',
  service: 'services',
  zen: 'services',
  wellness: 'services',
  massage: 'services',
  handwerk: 'services',
  dienstleistung: 'services',
  dienstleistungen: 'services',
  plumbing: 'services',
  cleaning: 'services',
  construction: 'services',
  general: 'general',
  default: 'general',
  corporate: 'general',
  company: 'general',
  public: 'general',
  allgemein: 'general',
};

const MEDICAL_RE =
  /پزشک|درمان|کلینیک|دندان|دکتر|درمانگاه|clinic|doctor|medical|dentist|physio|therapy|hospital|klinik|arzt|zahnarzt|praxis|orthopäd/;
const SALON_RE =
  /آرایش|زیبایی|سالن|ناخن|کوآف|salon|beauty|hair|makeup|nail|barber|barbery|friseur|kosmetik|nägel|coiffeur/;
const RESTAURANT_RE =
  /رستوران|کافه|غذا|restaurant|gastro|café|cafe|bistro|speise|küche|kuche|food|imbiss|pizzeria|bakery|bäckerei/;
const SERVICES_RE =
  /ماساژ|اسپا|spa|massage|yoga|wellness|ریلکس|حجامت|handwerk|reparatur|reinigung|umzug|garten|dienstleistung|service|pflege|installation|plumbing|cleaning|construction/;

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

function unwrap(data: unknown): Record<string, unknown> {
  const record = asRecord(data) ?? {};
  const nested = asRecord(record.data);
  return nested ? { ...record, ...nested } : record;
}

function sectionsOf(raw: Record<string, unknown>): Record<string, unknown>[] {
  return Array.isArray(raw.sections)
    ? raw.sections.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)))
    : [];
}

function findSection(raw: Record<string, unknown>, types: string[]) {
  const wanted = new Set(types.map((type) => type.toLowerCase()));
  return sectionsOf(raw).find((section) =>
    wanted.has(str(section.type).toLowerCase()),
  );
}

function listOf(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  if (!record) return [];
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.data)) return record.data;
  const nested = asRecord(record.data);
  if (nested && Array.isArray(nested.items)) return nested.items;
  return [];
}

function aliasOf(value: unknown): BusinessType | null {
  const key = str(value).toLowerCase().replace(/[_-]+/g, ' ');
  if (!key) return null;
  if ((BUSINESS_TYPES as readonly string[]).includes(key)) return key as BusinessType;
  const compact = key.replace(/\s+/g, '');
  return ALIASES[key] || ALIASES[compact] || null;
}

export function resolveThemeConfigType(themeConfig: unknown): BusinessType | null {
  if (themeConfig == null || themeConfig === '') return null;
  if (typeof themeConfig === 'string') return aliasOf(themeConfig);

  const theme = unwrap(themeConfig);
  return (
    aliasOf(theme.theme) ||
    aliasOf(theme.template) ||
    aliasOf(theme.businessType) ||
    aliasOf(theme.business_type) ||
    aliasOf(theme.type) ||
    aliasOf(theme.name) ||
    aliasOf(theme.id)
  );
}

function collectCorpus(raw: Record<string, unknown>): string {
  const sectionBits = sectionsOf(raw).flatMap((section) => [
    section.type,
    section.title,
    section.subtitle,
    ...listOf(section).map((item) => asRecord(item)?.name ?? asRecord(item)?.title),
  ]);

  return [
    raw.template,
    raw.theme,
    raw.businessType,
    raw.business_type,
    raw.category,
    raw.industry,
    raw.activity,
    raw.vertical,
    raw.business_name,
    ...sectionBits,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function resolveBusinessType(siteData: unknown, themeConfig?: unknown): BusinessType {
  const raw = asRecord(siteData) ?? {};
  const fromThemeConfig =
    resolveThemeConfigType(themeConfig) ||
    resolveThemeConfigType(raw.theme_config);

  if (fromThemeConfig) return fromThemeConfig;

  const explicit =
    aliasOf(raw.businessType) ||
    aliasOf(raw.business_type) ||
    aliasOf(raw.template) ||
    aliasOf(raw.theme) ||
    aliasOf(raw.category) ||
    aliasOf(raw.industry) ||
    aliasOf(raw.activity);

  if (explicit) return explicit;

  const corpus = collectCorpus(raw);
  if (MEDICAL_RE.test(corpus)) return 'medical';
  if (SALON_RE.test(corpus)) return 'salon';
  if (RESTAURANT_RE.test(corpus)) return 'restaurant';
  if (SERVICES_RE.test(corpus)) return 'services';
  return 'general';
}

function defaultServices(type: BusinessType, dict: Dictionary): SiteService[] {
  const fallback = dict.defaults.services;
  const byType = dict.defaults.servicesByType[type] ?? fallback;
  return byType.map((item) => ({ ...item }));
}

function defaultMenu(dict: Dictionary): MenuCategory[] {
  return dict.defaults.menu.map((category) => ({
    category: category.category,
    items: category.items.map((item) => ({ ...item })),
  }));
}

function mapServices(raw: Record<string, unknown>, dict: Dictionary): SiteService[] {
  const section = findSection(raw, ['services', 'service']);
  const fromSection = listOf(section);
  const source = fromSection.length ? fromSection : listOf(raw.services);
  const items: SiteService[] = [];
  for (const entry of source) {
    const item = unwrap(entry);
    const title = firstString(item.title, item.name, item.label);
    const price = firstString(item.price, item.cost);
    if (!title && !price) continue;
    items.push({
      title,
      description: firstString(item.description, item.subtitle, item.text),
      price: price || dict.templates.priceOnRequest,
      duration: firstString(item.duration, item.time, item.dauer) || undefined,
      icon: firstString(item.icon) || undefined,
    });
  }

  return items;
}

function mapMenu(raw: Record<string, unknown>, services: SiteService[], dict: Dictionary): MenuCategory[] {
  const section = findSection(raw, ['menu', 'speisekarte', 'food']);
  const fromSection = listOf(section);
  const source = fromSection.length ? fromSection : listOf(raw.menu);

  const categories = source
    .map((entry) => {
      const item = unwrap(entry);
      const nestedItems = listOf(item);
      if (nestedItems.length) {
        return {
          category: firstString(item.category, item.title, item.name) || dict.templates.menu,
          items: nestedItems.map((nested) => {
            const food = unwrap(nested);
            return {
              name: firstString(food.name, food.title),
              description: firstString(food.description),
              price: firstString(food.price) || dict.templates.priceOnRequest,
            };
          }),
        } satisfies MenuCategory;
      }

      const name = firstString(item.name, item.title);
      if (!name) return null;
      return {
        category: firstString(item.category) || dict.templates.menu,
        items: [
          {
            name,
            description: firstString(item.description),
            price: firstString(item.price) || dict.templates.priceOnRequest,
          },
        ],
      } satisfies MenuCategory;
    })
    .filter((item): item is MenuCategory => Boolean(item));

  if (categories.length) {
    const grouped = new Map<string, MenuCategory>();
    for (const category of categories) {
      const existing = grouped.get(category.category);
      if (existing) existing.items.push(...category.items);
      else grouped.set(category.category, { ...category, items: [...category.items] });
    }
    return [...grouped.values()];
  }

  if (services.length) {
    return [
      {
        category: dict.templates.highlights,
        items: services.map((service) => ({
          name: service.title,
          description: service.description,
          price: service.price || dict.templates.priceOnRequest,
        })),
      },
    ];
  }

  return [];
}

function mapGallery(raw: Record<string, unknown>, keys: string[]): GalleryItem[] {
  const section = findSection(raw, keys);
  const buckets = [
    listOf(section),
    listOf(raw.gallery),
    listOf(raw.projects),
    listOf(raw.images),
    listOf(raw.portfolio),
  ];

  const seen = new Set<unknown>();
  const items: GalleryItem[] = [];

  for (const bucket of buckets) {
    for (const entry of bucket) {
      if (seen.has(entry)) continue;
      seen.add(entry);
      const item = unwrap(entry);
      const image = firstString(
        item.image,
        item.image_url,
        item.src,
        item.url,
        item.photo,
      );
      const title = firstString(item.title, item.name, item.alt);
      if (!image && !title) continue;
      items.push({
        title: title || '',
        image: image || undefined,
        description: firstString(item.description, item.caption) || undefined,
      });
    }
  }

  return items;
}

function mapFaq(raw: Record<string, unknown>): FaqItem[] {
  const section = findSection(raw, ['faq', 'faqs', 'questions']);
  return listOf(section)
    .map((entry) => {
      const item = unwrap(entry);
      const question = firstString(item.question, item.title);
      const answer = firstString(item.answer, item.text, item.description);
      if (!question && !answer) return null;
      return { question, answer } satisfies FaqItem;
    })
    .filter((item): item is FaqItem => Boolean(item));
}

function mapWorkingHours(raw: Record<string, unknown>, dict: Dictionary): string {
  const section = unwrap(findSection(raw, ['working_hours', 'hours', 'opening_hours']) ?? raw.working_hours);
  const text = firstString(section.text, section.hours, typeof raw.working_hours === 'string' ? raw.working_hours : '');
  if (text) return text;

  const open = firstString(section.open, section.from);
  const close = firstString(section.close, section.to);
  const days = firstString(section.days, section.day);
  if (open || close) {
    const span = [open, close].filter(Boolean).join(` ${dict.hours.separator} `);
    return days ? `${days}, ${span}` : span;
  }

  const entries = listOf(section);
  if (entries.length) {
    return entries
      .map((entry) => {
        const item = unwrap(entry);
        const label = firstString(item.day, item.days, item.name);
        const value = firstString(
          item.hours,
          item.text,
          [firstString(item.open), firstString(item.close)].filter(Boolean).join(' – '),
        );
        return [label, value].filter(Boolean).join(': ');
      })
      .filter(Boolean)
      .join(' · ');
  }

  return dict.defaults.hours;
}

function isHexColor(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
}

function asColor(value: unknown, fallback: string): string {
  const next = str(value);
  if (isHexColor(next)) return next;
  if (/^rgb(a)?\(/i.test(next) || /^hsl(a)?\(/i.test(next)) return next;
  return fallback;
}

const DEFAULT_BOOKING_FIELDS = ['name', 'phone', 'email', 'date', 'time', 'message'];
const DEFAULT_QUOTE_FIELDS = ['name', 'phone', 'email', 'message'];

export function buildSiteConfig(
  siteData: unknown,
  dict: Dictionary,
  _locale: Locale,
  themeConfig?: unknown,
): SiteConfig {
  const raw = asRecord(siteData) ?? {};
  const theme = unwrap(themeConfig ?? raw.theme_config);
  const themeBranding = unwrap(theme.branding);
  const themeColors = unwrap(theme.colors);
  const brandingRaw = unwrap(raw.branding);
  const heroSection = unwrap(findSection(raw, ['hero', 'banner']) ?? raw.hero);
  const bookingSection = findSection(raw, [
    'booking',
    'appointment',
    'appointments',
    'reservation',
    'reservations',
    'quote',
    'quote_request',
  ]);
  const bookingRaw = unwrap(
    bookingSection ??
      raw.booking ??
      raw.appointment ??
      raw.reservation ??
      raw.quote,
  );
  const hasBookingData = Boolean(
    bookingSection || raw.booking || raw.appointment || raw.reservation || raw.quote,
  );
  const contactRaw = unwrap(raw.contact);
  const businessType = resolveBusinessType(raw, themeConfig ?? raw.theme_config);
  const colors = DEFAULT_COLORS[businessType];

  const name = firstString(
    brandingRaw.name,
    raw.business_name,
    raw.name,
    heroSection.title,
    dict.hero.officialSite,
  );

  const services = mapServices(raw, dict);
  const resolvedServices = services.length ? services : defaultServices(businessType, dict);
  const menu = mapMenu(raw, services, dict);
  const resolvedMenu = menu.length ? menu : businessType === 'restaurant' ? defaultMenu(dict) : menu;
  const gallery = mapGallery(raw, ['gallery', 'photos', 'images']);
  const projects = mapGallery(raw, ['projects', 'portfolio', 'arbeiten']);
  const resolvedGallery =
    gallery.length > 0
      ? gallery
      : resolvedServices.slice(0, 6).map((service) => ({
          title: service.title,
          description: service.description || undefined,
        }));
  const resolvedProjects = projects.length ? projects : resolvedGallery;

  const bookingEnabled =
    hasBookingData && bookingRaw.enabled !== false;

  const bookingTitle = firstString(
    bookingRaw.title,
    businessType === 'restaurant'
      ? dict.templates.reservationTitle
      : businessType === 'services'
        ? dict.templates.quoteTitle
        : dict.templates.bookingTitle,
  );

  const fields = listOf(bookingRaw.fields)
    .map((field) => str(field).toLowerCase())
    .filter(Boolean);

  return {
    businessType,
    branding: {
      name,
      logo: firstString(theme.logo, themeBranding.logo, brandingRaw.logo, raw.logo, raw.logo_url) || undefined,
      primaryColor: asColor(
        firstString(
          theme.primaryColor,
          theme.primary_color,
          theme.primary,
          themeColors.primary,
          themeBranding.primaryColor,
          brandingRaw.primaryColor,
          brandingRaw.primary_color,
          raw.primaryColor,
          raw.primary_color,
          raw.brand_color,
        ),
        colors.primary,
      ),
      secondaryColor: asColor(
        firstString(
          theme.secondaryColor,
          theme.secondary_color,
          theme.secondary,
          themeColors.secondary,
          themeBranding.secondaryColor,
          brandingRaw.secondaryColor,
          brandingRaw.secondary_color,
          raw.secondaryColor,
          raw.secondary_color,
        ),
        colors.secondary,
      ),
      phone: firstString(
        brandingRaw.phone,
        contactRaw.phone,
        raw.phone,
        raw.contact_phone,
        dict.defaults.phone,
      ),
      email: firstString(
        brandingRaw.email,
        contactRaw.email,
        raw.email,
        raw.contact_email,
        dict.defaults.email,
      ),
      address: firstString(
        brandingRaw.address,
        contactRaw.address,
        raw.address,
        dict.defaults.address,
      ),
    },
    hero: {
      title: firstString(heroSection.title, raw.business_name, dict.hero.welcome),
      subtitle: firstString(
        heroSection.subtitle,
        heroSection.description,
        raw.description,
        raw.site_description,
        dict.defaults.subtitle,
      ),
      ctaText: firstString(
        heroSection.ctaText,
        heroSection.cta,
        heroSection.cta_button,
        heroSection.button,
        bookingEnabled
          ? businessType === 'restaurant'
            ? dict.templates.reserve
            : businessType === 'services'
              ? dict.templates.quote
              : businessType === 'medical' || businessType === 'salon'
                ? dict.templates.book
                : dict.hero.contactUs
          : dict.hero.contactUs,
      ),
      bgImage:
        firstString(
          heroSection.bgImage,
          heroSection.image_url,
          heroSection.image,
          heroSection.cover,
          raw.cover_image,
          raw.image_url,
        ) || undefined,
    },
    services: resolvedServices,
    menu: resolvedMenu,
    booking: {
      enabled: bookingEnabled,
      title: bookingTitle,
      fields: bookingEnabled
        ? fields.length
          ? fields
          : businessType === 'services'
            ? DEFAULT_QUOTE_FIELDS
            : DEFAULT_BOOKING_FIELDS
        : [],
    },
    gallery: resolvedGallery,
    projects: resolvedProjects,
    contact: {
      mapUrl:
        firstString(
          contactRaw.mapUrl,
          contactRaw.map_url,
          raw.mapUrl,
          raw.map_url,
          raw.google_maps,
        ) || undefined,
      workingHours: mapWorkingHours(raw, dict),
    },
    faq: mapFaq(raw),
    about: firstString(
      raw.about,
      raw.bio,
      brandingRaw.about,
      raw.description,
      raw.site_description,
      heroSection.subtitle,
      dict.defaults.about,
    ),
    owner: firstString(raw.owner_name, raw.owner, raw.doctor_name, brandingRaw.owner) || undefined,
  };
}

export function isBusinessType(value: string): value is BusinessType {
  return (BUSINESS_TYPES as readonly string[]).includes(value);
}
