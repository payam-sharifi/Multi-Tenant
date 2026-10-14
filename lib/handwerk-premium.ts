import { safeImageUrl } from '@/lib/image-hosts';
import type {
  HandwerkBeforeAfterContent,
  HandwerkContactContent,
  HandwerkFaqContent,
  HandwerkFinancingContent,
  HandwerkFooterContent,
  HandwerkGuaranteesContent,
  HandwerkHeroContent,
  HandwerkHoursRow,
  HandwerkMaterialsContent,
  HandwerkPremiumContent,
  HandwerkProcessContent,
  HandwerkProjectsContent,
  HandwerkQualityContent,
  HandwerkReviewsContent,
  HandwerkServicesContent,
  HandwerkTeamContent,
} from '@/lib/types/handwerk-premium';
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
      ? value.split(/[\n,;]/).map((part) => part.trim()).filter(Boolean)
      : [];
  return list.length ? list : undefined;
}

function entries(value: unknown): Rec[] | undefined {
  const source = Array.isArray(value) ? value : rec(value)?.items;
  if (!Array.isArray(source)) return undefined;
  const list = source.map(rec).filter((item): item is Rec => Boolean(item) && item?.active !== false);
  return list.length ? list : undefined;
}

function sectionsOf(raw: Rec): Rec[] {
  return Array.isArray(raw.sections)
    ? raw.sections.map(rec).filter((item): item is Rec => Boolean(item))
    : [];
}

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
  // sections[] wins: that is where the Hermes agent writes Telegram/WhatsApp edits.
  if (fromList) base = { ...(base ?? {}), ...fromList, ...(rec(fromList.data) ?? {}) };

  if (!base || base.enabled === false || base.active === false) return null;
  return base;
}

function image(value: unknown): string | undefined {
  return safeImageUrl(first(value));
}

function parseHero(section: Rec): HandwerkHeroContent {
  return {
    badge: first(section.badge, section.eyebrow),
    title: first(section.title, section.titleA),
    subtitle: first(section.subtitle, section.description),
    ctaPrimary: first(section.ctaPrimary, section.ctaText, section.cta, section.cta_button),
    ctaSecondary: first(section.ctaSecondary),
    bullets: strings(section.bullets ?? section.highlights),
    stats: entries(section.stats)?.map((item) => ({
      value: first(item.value),
      label: first(item.label),
    })),
    image: image(section.image ?? section.bgImage ?? section.bg_image),
  };
}

function parseServices(section: Rec, fallback: SiteService[]): HandwerkServicesContent {
  const fromSection = entries(section.items ?? section.services);
  const source: Rec[] = fromSection ?? fallback.map((service) => ({
    title: service.title,
    description: service.description,
    image: service.image,
    id: service.id,
  }));
  const items = source.map((item) => ({
    id: first(item.id, item.slug),
    title: first(item.title, item.name),
    description: first(item.description, item.desc),
    image: image(item.image ?? item.photo),
    href: first(item.href, item.link),
  }));
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle),
    items: items.length ? items : undefined,
  };
}

function parseGuarantees(section: Rec): HandwerkGuaranteesContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    items: entries(section.items ?? section.values)?.map((item) => ({
      title: first(item.title, item.name),
      description: first(item.description, item.desc),
      icon: first(item.icon),
    })),
  };
}

function parseProjects(section: Rec): HandwerkProjectsContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    items: entries(section.items)?.map((item) => ({
      id: first(item.id, item.slug),
      title: first(item.title, item.name),
      image: image(item.image ?? item.photo),
      area: first(item.area, item.flaeche, item.size),
      duration: first(item.duration, item.ausfuehrungszeit, item.time),
      kind: first(item.kind, item.type, item.art),
      city: first(item.city, item.stadt),
      description: first(item.description, item.desc),
    })),
  };
}

function parseReviews(section: Rec): HandwerkReviewsContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle, section.description),
    rating: first(section.rating),
    count: first(section.count, section.reviewCount),
    location: first(section.location, section.city),
    googleUrl: first(section.googleUrl, section.google_url, section.url),
    items: entries(section.items)?.map((item) => ({
      name: first(item.name, item.author),
      text: first(item.text, item.review, item.quote),
      rating: num(item.rating),
      source: first(item.source),
      city: first(item.city, item.location, item.stadtteil),
      date: first(item.date, item.when),
    })),
  };
}

function parseQuality(section: Rec): HandwerkQualityContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle, section.description),
    image: image(section.image ?? section.photo),
  };
}

function parseTeam(section: Rec): HandwerkTeamContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle, section.description),
    mission: first(section.mission),
    note: first(section.note),
    items: entries(section.items ?? section.team)?.map((item) => ({
      id: first(item.id, item.slug),
      name: first(item.name, item.title),
      role: first(item.role, item.specialty, item.spec),
      image: image(item.image ?? item.photo),
    })),
  };
}

function parseBeforeAfter(section: Rec): HandwerkBeforeAfterContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    items: entries(section.items)?.map((item) => ({
      id: first(item.id, item.slug),
      title: first(item.title, item.name),
      beforeImage: image(item.beforeImage ?? item.before ?? item.vorher),
      afterImage: image(item.afterImage ?? item.after ?? item.nachher ?? item.image),
      area: first(item.area, item.flaeche),
      duration: first(item.duration, item.ausfuehrungszeit),
      kind: first(item.kind, item.art),
      city: first(item.city, item.stadt),
    })),
  };
}

function parseFinancing(section: Rec): HandwerkFinancingContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle, section.description),
    amountLabel: first(section.amountLabel),
    yearsLabel: first(section.yearsLabel),
    rateLabel: first(section.rateLabel),
    resultLabel: first(section.resultLabel),
    defaultAmount: num(section.defaultAmount ?? section.amount),
    defaultYears: num(section.defaultYears ?? section.years),
    defaultRate: num(section.defaultRate ?? section.rate),
  };
}

function parseProcess(section: Rec): HandwerkProcessContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    items: entries(section.items ?? section.steps)?.map((item) => ({
      title: first(item.title, item.name),
      description: first(item.description, item.desc),
    })),
  };
}

function parseFaq(section: Rec): HandwerkFaqContent {
  const items = entries(section.items ?? section.faq)
    ?.map((item) => ({
      question: first(item.question, item.q) ?? '',
      answer: first(item.answer, item.a) ?? '',
    }))
    .filter((item) => item.question && item.answer);
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    items: items?.length ? items : undefined,
  };
}

function hoursRowsFrom(value: unknown): HandwerkHoursRow[] | undefined {
  const fromItems = entries(value)?.map((item) => ({
    days: first(item.days, item.day, item.name),
    hours: first(
      item.hours,
      item.text,
      [first(item.open, item.from), first(item.close, item.to)].filter(Boolean).join(' – '),
    ),
  })).filter((row) => row.days || row.hours);
  if (fromItems?.length) return fromItems;

  const text = s(value);
  if (!text) return undefined;
  const rows = text.split(/\n|;/).map((line) => {
    const trimmed = line.trim();
    const split = trimmed.split(/:\s+/);
    if (split.length >= 2) return { days: split[0], hours: split.slice(1).join(': ') };
    return { days: undefined, hours: trimmed };
  }).filter((row) => row.days || row.hours);
  return rows.length ? rows : undefined;
}

function parseHours(raw: Rec): { text?: string; rows?: HandwerkHoursRow[] } {
  const section = findSection(raw, ['working_hours', 'hours', 'opening_hours', 'oeffnungszeiten', 'öffnungszeiten']);
  const fromRaw = typeof raw.working_hours === 'string' ? raw.working_hours : undefined;
  if (!section && !fromRaw) return {};

  const rows = hoursRowsFrom(section?.items ?? section?.hoursRows) ?? hoursRowsFrom(section?.text ?? fromRaw);
  const text = first(
    section?.text,
    section?.hours,
    [first(section?.days), first(section?.open, section?.from), first(section?.close, section?.to)]
      .filter(Boolean)
      .join(' '),
    fromRaw,
    rows?.map((row) => [row.days, row.hours].filter(Boolean).join(': ')).join(' · '),
  );
  return { text, rows };
}

function parseContact(section: Rec): HandwerkContactContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    coverage: first(section.coverage, section.einsatzgebiete),
    hqLabel: first(section.hqLabel),
    hqAddress: first(section.hqAddress, section.address),
    formNote: first(section.formNote, section.note),
    hours: first(section.hours),
    hoursRows: hoursRowsFrom(section.hoursRows ?? section.hours),
    mapQuery: first(section.mapQuery, section.map_query, section.map, section.google_address, section.address),
    mapEmbed: first(section.mapEmbed, section.map_embed),
    googleMapsUrl: first(
      section.googleMapsUrl,
      section.mapUrl,
      section.map_url,
      section.google_maps,
      section.googleMaps,
    ),
    items: entries(section.items ?? section.locations ?? section.branches)?.map((item) => ({
      id: first(item.id, item.slug),
      name: first(item.name, item.title),
      address: first(item.address),
      phone: first(item.phone),
    })),
  };
}

function parseMaterials(section: Rec): HandwerkMaterialsContent {
  return {
    eyebrow: first(section.eyebrow),
    title: first(section.title),
    subtitle: first(section.subtitle, section.description),
    items: entries(section.items)?.map((item) => ({
      title: first(item.title, item.name),
      spec: first(item.spec, item.description, item.detail),
      image: image(item.image ?? item.photo),
    })),
  };
}

function parseFooter(section: Rec): HandwerkFooterContent {
  return {
    about: first(section.about, section.text),
    rights: first(section.rights),
    privacy: first(section.privacy),
    imprint: first(section.imprint, section.impressum),
    company: first(section.company, section.name),
    represented: first(section.represented, section.vertreten, section.vertreten_durch),
  };
}

export function buildHandwerkPremiumContent(
  raw: Rec,
  services: SiteService[],
  servicesBlock: SiteServicesBlock | undefined,
): HandwerkPremiumContent {
  const hero = findSection(raw, ['hero', 'banner']);
  const servicesSection = findSection(raw, ['services', 'service', 'leistungen']);
  const guarantees = findSection(raw, ['guarantees', 'promises', 'vorteile', 'garantien']);
  const projects = findSection(raw, ['projects', 'portfolio', 'arbeiten']);
  const reviews = findSection(raw, ['reviews', 'testimonials', 'bewertungen', 'google_reviews', 'google_bewertungen']);
  const quality = findSection(raw, ['quality', 'behind_scenes', 'kulissen']);
  const team = findSection(raw, ['team', 'doctors']);
  const beforeAfter = findSection(raw, ['beforeafter', 'before_after', 'vorher_nachher', 'vorhernachher']);
  const financing = findSection(raw, ['financing', 'finanzierung', 'calculator', 'rechner']);
  const process = findSection(raw, ['process', 'schritte', 'weg']);
  const faq = findSection(raw, ['faq', 'faqs']);
  const contact = findSection(raw, ['contact', 'locations', 'kontakt', 'standorte', 'standort']);
  const materials = findSection(raw, ['materials', 'material', 'ausstattung', 'katalog', 'materialien']);
  const footer = findSection(raw, ['footer']);
  const header = rec(raw.header);
  const contactRaw = rec(raw.contact) ?? {};
  const brandingRaw = rec(raw.branding) ?? {};
  const hours = parseHours(raw);
  const parsedContact = contact ? parseContact(contact) : undefined;
  const mapFromRaw = first(contactRaw.mapUrl, contactRaw.map_url, raw.mapUrl, raw.map_url, raw.google_maps, raw.googleMaps);
  if (parsedContact && !parsedContact.hoursRows?.length && hours.rows?.length) parsedContact.hoursRows = hours.rows;
  if (parsedContact && !parsedContact.hours && hours.text) parsedContact.hours = hours.text;
  if (parsedContact && !parsedContact.googleMapsUrl && mapFromRaw) parsedContact.googleMapsUrl = mapFromRaw;
  if (parsedContact && !parsedContact.mapQuery) {
    parsedContact.mapQuery = first(parsedContact.hqAddress, contactRaw.address, raw.address);
  }
  const contactBlock =
    parsedContact ??
    (hours.text || hours.rows?.length || first(raw.address, contactRaw.address)
      ? {
          hqAddress: first(contactRaw.address, raw.address),
          hours: hours.text,
          hoursRows: hours.rows,
          mapQuery: first(contactRaw.address, raw.address),
          googleMapsUrl: mapFromRaw,
        }
      : undefined);

  return {
    present: {
      hero: Boolean(hero),
      services: Boolean(servicesSection) || services.length > 0,
      guarantees: Boolean(guarantees),
      projects: Boolean(projects),
      reviews: Boolean(reviews),
      quality: Boolean(quality),
      team: Boolean(team),
      beforeAfter: Boolean(beforeAfter),
      financing: Boolean(financing),
      process: Boolean(process),
      faq: Boolean(faq),
      contact: Boolean(contact) || Boolean(contactBlock),
      materials: Boolean(materials),
    },
    sample: raw.demo === true,
    logo: image(first(raw.logo, raw.logo_url, brandingRaw.logo, rec(raw.theme)?.logo)),
    contact: {
      phone: first(s(contact?.phone), footer?.phone, contactRaw.phone, raw.phone, raw.contact_phone, brandingRaw.phone),
      email: first(s(contact?.email), footer?.email, contactRaw.email, raw.email, raw.contact_email, brandingRaw.email),
      address: first(parsedContact?.hqAddress, footer?.address, contactRaw.address, raw.address, brandingRaw.address),
      hours: first(hours.text, parsedContact?.hours, header?.hours),
    },
    header: header ? { cta: first(header.cta, header.book), hours: first(header.hours) } : undefined,
    hero: hero ? parseHero(hero) : undefined,
    serviceItems: services,
    servicesBlock,
    services: servicesSection ? parseServices(servicesSection, services) : undefined,
    guarantees: guarantees ? parseGuarantees(guarantees) : undefined,
    projects: projects ? parseProjects(projects) : undefined,
    reviews: reviews ? parseReviews(reviews) : undefined,
    quality: quality ? parseQuality(quality) : undefined,
    team: team ? parseTeam(team) : undefined,
    beforeAfter: beforeAfter ? parseBeforeAfter(beforeAfter) : undefined,
    financing: financing ? parseFinancing(financing) : undefined,
    process: process ? parseProcess(process) : undefined,
    faq: faq ? parseFaq(faq) : undefined,
    contactBlock,
    materials: materials ? parseMaterials(materials) : undefined,
    footer: footer ? parseFooter(footer) : undefined,
  };
}
