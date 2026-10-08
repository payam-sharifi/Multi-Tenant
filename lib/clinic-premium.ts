import { safeImageUrl } from '@/lib/image-hosts';
import type {
  ClinicAboutContent,
  ClinicBranchContent,
  ClinicCheckupContent,
  ClinicDoctorContent,
  ClinicDoctorsContent,
  ClinicFaqContent,
  ClinicFooterContent,
  ClinicHeroContent,
  ClinicLocationsContent,
  ClinicPlanContent,
  ClinicPremiumContent,
} from '@/lib/types/clinic-premium';
import type { SiteService, SiteServicesBlock } from '@/lib/types/template';

type Rec = Record<string, unknown>;

function rec(value: unknown): Rec | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Rec) : null;
}

function s(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
}

function first(...values: unknown[]): string | undefined {
  for (const value of values) {
    const next = s(value);
    if (next) return next;
  }
  return undefined;
}

function num(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.').trim());
    if (value.trim() && Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function strings(value: unknown): string[] | undefined {
  const list = Array.isArray(value)
    ? value.map(s).filter((item): item is string => Boolean(item))
    : typeof value === 'string'
      ? value.split(',').map((part) => part.trim()).filter(Boolean)
      : [];
  return list.length ? list : undefined;
}

function entries(value: unknown): Rec[] | undefined {
  const source = Array.isArray(value) ? value : (rec(value)?.items as unknown);
  if (!Array.isArray(source)) return undefined;
  const list = source.map(rec).filter((item): item is Rec => Boolean(item) && item?.active !== false);
  return list.length ? list : undefined;
}

function sectionsOf(raw: Rec): Rec[] {
  return Array.isArray(raw.sections)
    ? raw.sections.map(rec).filter((item): item is Rec => Boolean(item))
    : [];
}

/**
 * Finds a section either as a top-level key (`doctors: {...}` / `doctors: [...]`)
 * or inside `sections: [{ type: "doctors", ... }]`. Returns null when it is absent or disabled.
 */
function findSection(raw: Rec, keys: string[]): Rec | null {
  const wanted = new Set(keys);
  const fromList = sectionsOf(raw).find((item) => wanted.has(String(item.type ?? '').toLowerCase()));
  let direct: unknown;
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) {
      direct = raw[key];
      break;
    }
  }

  let base: Rec | null = null;
  if (Array.isArray(direct)) base = { items: direct };
  else if (rec(direct)) base = { ...rec(direct) };
  // Entries in sections[] win: that is where the Hermes agent writes its edits.
  if (fromList) base = { ...(base ?? {}), ...fromList, ...(rec(fromList.data) ?? {}) };

  if (!base || base.enabled === false || base.active === false) return null;
  return base;
}

function image(value: unknown): string | undefined {
  return safeImageUrl(first(value));
}

function parseHero(section: Rec): ClinicHeroContent {
  const hasSplitTitle = Boolean(first(section.titleA, section.titleB, section.titleC));
  const plainTitle = first(section.title);
  const chief = rec(section.chief) ?? {};
  const rating = rec(section.rating) ?? {};
  const pill = rec(section.pill) ?? {};
  const promise = rec(section.promise) ?? {};

  const stats = entries(section.stats)?.map((item) => ({
    value: first(item.value),
    label: first(item.label),
  }));

  return {
    badge: first(section.badge, section.eyebrow),
    ...(hasSplitTitle
      ? { titleA: first(section.titleA), titleB: first(section.titleB), titleC: first(section.titleC) }
      : plainTitle
        ? { titleA: plainTitle, titleB: '', titleC: '' }
        : {}),
    subtitle: first(section.subtitle, section.description),
    ctaPrimary: first(section.ctaPrimary, section.ctaText, section.cta, section.cta_button),
    ctaSecondary: first(section.ctaSecondary),
    stats,
    pillValue: first(section.pillValue, pill.value),
    pillText: first(section.pillText, pill.text),
    ratingScore: first(section.ratingScore, rating.score),
    reviews: first(section.reviews, rating.reviews, rating.label),
    promiseTitle: first(section.promiseTitle, promise.title),
    promiseText: first(section.promiseText, promise.text),
    chiefRole: first(section.chiefRole, chief.role),
    chiefName: first(section.chiefName, chief.name),
    chiefMeta: first(section.chiefMeta, chief.meta),
    chiefImage: image(section.chiefImage ?? chief.image),
    image: image(section.image ?? section.bgImage ?? section.bg_image),
    available: first(section.available, chief.available),
    avatars: (() => {
      const list = (Array.isArray(section.avatars) ? section.avatars : [])
        .map(image)
        .filter((item): item is string => Boolean(item));
      return list.length ? list : undefined;
    })(),
  };
}

function parseCheckup(section: Rec): ClinicCheckupContent {
  const plans: ClinicPlanContent[] | undefined = entries(section.plans ?? section.items)?.map((item) => ({
    id: first(item.id, item.slug),
    name: first(item.name, item.title),
    desc: first(item.desc, item.description),
    price: num(item.price),
    oldPrice: num(item.oldPrice ?? item.old_price),
    featured: typeof item.featured === 'boolean' ? item.featured : undefined,
    icon: first(item.icon),
    features: strings(item.features),
    serviceId: first(item.serviceId, item.service_id),
  }));

  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle),
    from: first(section.from, section.fromLabel),
    featuredLabel: first(section.featuredLabel, section.featured),
    discount: first(section.discount),
    book: first(section.book, section.bookLabel),
    note: first(section.note),
    currency: first(section.currency),
    plans,
  };
}

function parseAbout(section: Rec): ClinicAboutContent {
  const values = entries(section.values ?? section.items)?.map((item) => ({
    title: first(item.title, item.name),
    desc: first(item.desc, item.description),
    icon: first(item.icon),
  }));
  const stats = entries(section.stats)?.map((item) => ({
    value: num(item.value),
    suffix: typeof item.suffix === 'string' ? item.suffix : undefined,
    label: first(item.label),
  }));

  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle),
    image: image(section.image ?? section.photo),
    values,
    stats,
  };
}

function parseDoctors(section: Rec): ClinicDoctorsContent {
  const items: ClinicDoctorContent[] | undefined = entries(section.items ?? section.team)?.map((item) => ({
    id: first(item.id, item.slug),
    name: first(item.name, item.title),
    specialty: first(item.specialty, item.spec, item.role),
    rating: num(item.rating),
    years: num(item.years),
    image: image(item.image ?? item.photo),
    serviceId: first(item.serviceId, item.service_id),
  }));

  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle),
    book: first(section.book, section.bookLabel),
    experience: first(section.experience, section.experienceLabel),
    items,
  };
}

function parseLocations(section: Rec): ClinicLocationsContent {
  const items: ClinicBranchContent[] | undefined = entries(section.items ?? section.branches)?.map((item) => ({
    id: first(item.id, item.slug),
    name: first(item.name, item.title),
    address: first(item.address),
    phone: first(item.phone),
    hours: first(item.hours),
    x: num(item.x),
    y: num(item.y),
    serviceIds: strings(item.serviceIds ?? item.service_ids),
    image: image(item.image ?? item.photo),
  }));

  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle),
    open: first(section.open, section.openLabel),
    hours: first(section.hours),
    directions: first(section.directions),
    book: first(section.book, section.bookLabel),
    more: first(section.more),
    offers: first(section.offers),
    items,
  };
}

function parseFaq(section: Rec): ClinicFaqContent {
  const items = entries(section.items ?? section.faq)
    ?.map((item) => ({ question: first(item.question, item.q) ?? '', answer: first(item.answer, item.a) ?? '' }))
    .filter((item) => item.question && item.answer);
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle),
    items: items?.length ? items : undefined,
  };
}

function parseFooter(section: Rec): ClinicFooterContent {
  return {
    about: first(section.about, section.text),
    legal: first(section.legal),
    emergency: first(section.emergency),
    hoursRows: strings(section.hours ?? section.hoursRows),
    rights: first(section.rights),
    privacy: first(section.privacy),
    terms: first(section.terms),
    cookies: first(section.cookies),
  };
}

export function buildClinicPremiumContent(
  raw: Rec,
  services: SiteService[],
  servicesBlock: SiteServicesBlock | undefined,
): ClinicPremiumContent {
  const hero = findSection(raw, ['hero', 'banner']);
  const servicesSection = findSection(raw, ['services', 'service']);
  const checkup = findSection(raw, ['checkup', 'check_up', 'checkups', 'packages']);
  const about = findSection(raw, ['about', 'why_us', 'whyus', 'about_us']);
  const doctors = findSection(raw, ['doctors', 'team']);
  const locations = findSection(raw, ['locations', 'branches']);
  const faq = findSection(raw, ['faq', 'faqs']);
  const footer = findSection(raw, ['footer']);
  const header = rec(raw.header);
  const contactRaw = rec(raw.contact) ?? {};
  const brandingRaw = rec(raw.branding) ?? {};

  // The Hermes agent stores opening hours as sections[type=working_hours] (text or days/open/close).
  const hoursSection = findSection(raw, ['working_hours', 'hours', 'opening_hours']);
  const hoursText = first(
    hoursSection?.text,
    hoursSection?.hours,
    [hoursSection?.days, hoursSection?.open, hoursSection?.close].map(s).filter(Boolean).join(' '),
    typeof raw.working_hours === 'string' ? raw.working_hours : undefined,
  );
  const hoursRows = hoursText
    ? hoursText.split(/\n|;/).map((row) => row.trim()).filter(Boolean)
    : undefined;
  const parsedFooter = footer ? parseFooter(footer) : hoursRows ? ({} as ClinicFooterContent) : undefined;
  if (parsedFooter && !parsedFooter.hoursRows && hoursRows) parsedFooter.hoursRows = hoursRows;

  return {
    present: {
      hero: Boolean(hero),
      services: Boolean(servicesSection),
      checkup: Boolean(checkup),
      about: Boolean(about),
      doctors: Boolean(doctors),
      locations: Boolean(locations),
      faq: Boolean(faq),
    },
    sample: raw.demo === true,
    header: header ? { hours: first(header.hours), book: first(header.book) } : undefined,
    logo: image(first(raw.logo, raw.logo_url, brandingRaw.logo, rec(raw.theme)?.logo)),
    contact: {
      phone: first(footer?.phone, contactRaw.phone, raw.phone, raw.contact_phone, brandingRaw.phone),
      email: first(footer?.email, contactRaw.email, raw.email, raw.contact_email, brandingRaw.email),
      address: first(footer?.address, contactRaw.address, raw.address, brandingRaw.address),
      hours: hoursText,
    },
    hero: hero ? parseHero(hero) : undefined,
    serviceItems: services,
    servicesBlock,
    checkup: checkup ? parseCheckup(checkup) : undefined,
    about: about ? parseAbout(about) : undefined,
    doctors: doctors ? parseDoctors(doctors) : undefined,
    locations: locations ? parseLocations(locations) : undefined,
    faq: faq ? parseFaq(faq) : undefined,
    footer: parsedFooter,
  };
}
