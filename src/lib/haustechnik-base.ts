import type { HaustechnikBenefit, HaustechnikContent, HaustechnikService } from '@/lib/types/haustechnik-base';
import type { SiteService } from '@/lib/types/template';

type Rec = Record<string, unknown>;

function rec(value: unknown): Rec | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Rec) : null;
}

function s(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function first(...values: unknown[]): string {
  for (const value of values) {
    const next = s(value);
    if (next) return next;
  }
  return '';
}

function list(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const record = rec(value);
  if (record && Array.isArray(record.items)) return record.items;
  return [];
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(s).filter(Boolean);
  const text = s(value);
  return text ? text.split(',').map((part) => part.trim()).filter(Boolean) : [];
}

function sectionsOf(raw: Rec): Rec[] {
  return Array.isArray(raw.sections)
    ? raw.sections.filter((item): item is Rec => Boolean(rec(item)))
    : [];
}

function findSection(raw: Rec, types: string[]): Rec | null {
  const wanted = new Set(types.map((type) => type.toLowerCase()));
  return (
    sectionsOf(raw).find((section) => wanted.has(s(section.type).toLowerCase())) ?? null
  );
}

const DEFAULT_SERVICES: HaustechnikService[] = [
  {
    id: 'heizung',
    title: 'Heizung & Energiesparen',
    description:
      'Wärmepumpen, moderne Heizkessel und hydraulischer Abgleich – für spürbar niedrigere Energiekosten und zuverlässige Wärme im ganzen Haus.',
    points: ['Wärmepumpe & Brennwerttechnik', 'Wartung und Optimierung', 'Fördermittel-Beratung'],
  },
  {
    id: 'bad',
    title: 'Badmodernisierung',
    description:
      'Ihr Traumbad aus einer Hand: Planung, Sanitär, Fliesenabstimmung und Fertigstellung – ohne Koordinationsaufwand für Sie.',
    points: ['Komplettbad schlüsselfertig', 'Barrierefreie Lösungen', 'Feste Termine & Festpreis'],
  },
  {
    id: 'sanitaer',
    title: 'Sanitärinstallation & Reparatur',
    description:
      'Neuinstallation, Leckagen und alltägliche Reparaturen erledigen wir sauber, fachgerecht und mit klarer Kommunikation vor Ort.',
    points: ['Installation & Austausch', 'Undichtigkeiten', 'Wartungsverträge'],
  },
  {
    id: 'notdienst',
    title: '24/7 Notdienst',
    description:
      'Rohrbruch oder Heizungsausfall? Unser Notdienst ist rund um die Uhr erreichbar – schnell vor Ort, transparent im Preis.',
    points: ['Rohrbruch & Wasserschaden', 'Heizungsausfall', 'Kurze Anfahrtszeiten'],
    featured: true,
  },
];

const DEFAULT_BENEFITS: HaustechnikBenefit[] = [
  {
    title: 'Faire & transparente Preise',
    description:
      'Sie erhalten ein verständliches Angebot vor Arbeitsbeginn. Keine versteckten Positionen, keine Überraschungen auf der Rechnung.',
  },
  {
    title: 'Zertifizierter Meisterbetrieb',
    description:
      'Als eingetragener Meisterbetrieb arbeiten wir nach Handwerksordnung – geprüft, versichert und nachvollziehbar dokumentiert.',
  },
  {
    title: 'Pünktlich & Zuverlässig',
    description:
      'Vereinbarte Termine gelten. Unser Team erscheint vorbereitet, hält den Zeitplan ein und hinterlässt die Baustelle ordentlich.',
  },
];

function sameKey(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function overlayByKey<T extends object>(incoming: T[], fallback: T[], keyOf: (item: T) => string): T[] {
  if (!incoming.length) return fallback;
  if (!fallback.length) return incoming;
  const key = (item: T) => keyOf(item).trim().toLowerCase();
  const isPatch =
    incoming.length < fallback.length &&
    incoming.every((item) => {
      const itemKey = key(item);
      return Boolean(itemKey && fallback.some((row) => key(row) === itemKey));
    });
  if (!isPatch) return incoming;
  const result = fallback.map((row) => ({ ...row }));
  for (const item of incoming) {
    const itemKey = key(item);
    const index = result.findIndex((row) => key(row) === itemKey);
    if (index >= 0) result[index] = { ...result[index], ...item };
    else result.push({ ...item });
  }
  return result;
}

function mergeStringList(provided: string[], fallback: string[], limit = 6): string[] {
  const incoming = provided.map((item) => item.trim()).filter(Boolean);
  if (!incoming.length) return fallback;
  if (incoming.length >= fallback.length) return incoming.slice(0, limit);
  const result = [...fallback];
  for (const item of incoming) {
    if (!result.some((row) => sameKey(row, item))) result.push(item);
  }
  return result.slice(0, limit);
}

function mapServiceEntry(entry: unknown, index: number): HaustechnikService | null {
  const item = rec(entry) ?? {};
  if (item.active === false || item.enabled === false) return null;
  const title = first(item.title, item.name);
  if (!title) return null;
  const points = stringList(item.points ?? item.tags ?? item.highlights);
  const mapped: HaustechnikService = {
    id: first(item.id, item.slug) || `service-${index}`,
    title,
    description: first(item.description, item.desc, item.text),
    points,
  };
  if (item.featured === true) mapped.featured = true;
  return mapped;
}

function mapServices(raw: Rec, fallback: SiteService[]): HaustechnikService[] {
  const section = findSection(raw, ['services', 'service', 'leistungen']);
  const incoming = list(section)
    .map((entry, index) => mapServiceEntry(entry, index))
    .filter((item): item is HaustechnikService => Boolean(item));
  const fromFallback = fallback
    .map((entry, index) => mapServiceEntry(entry, index))
    .filter((item): item is HaustechnikService => Boolean(item));
  const base = fromFallback.length ? fromFallback : DEFAULT_SERVICES;
  if (!incoming.length) return base;
  return overlayByKey(incoming, base, (item) => item.title);
}

function mapBenefits(raw: Rec): HaustechnikBenefit[] {
  const section = findSection(raw, ['benefits', 'trust', 'why', 'guarantees']);
  const incoming = list(section)
    .map((entry) => {
      const item = rec(entry) ?? {};
      const title = first(item.title, item.name);
      const description = first(item.description, item.text);
      if (!title) return null;
      return { title, description } satisfies HaustechnikBenefit;
    })
    .filter((item): item is HaustechnikBenefit => Boolean(item));
  return overlayByKey(incoming, DEFAULT_BENEFITS, (item) => item.title);
}

export function buildHaustechnikContent(
  raw: unknown,
  services: SiteService[],
  brandName: string,
): HaustechnikContent {
  const data = rec(raw) ?? {};
  const hero = rec(findSection(data, ['hero', 'banner']) ?? data.hero) ?? {};
  const about = rec(findSection(data, ['about', 'ueber_uns', 'über uns']) ?? data.about) ?? {};
  const reviews = rec(findSection(data, ['reviews', 'google_reviews']) ?? data.reviews) ?? {};
  const footer = rec(findSection(data, ['footer']) ?? data.footer) ?? {};
  const contact = rec(data.contact) ?? {};
  const serviceItems = mapServices(data, services);
  const name = first(data.business_name, data.name, brandName) || 'Nordlicht Haustechnik';

  return {
    sample: Boolean(data.sample),
    tagline: first(data.tagline, contact.tagline) || 'Heizung · Sanitär · Notdienst',
    legalName: first(data.legal_name, data.legalName) || `${name}${name.includes('GmbH') ? '' : ' GmbH'}`,
    emergencyHours: first(data.emergency_hours, data.emergencyHours, contact.emergencyHours) || '24/7 Notdienst',
    heroEyebrow: first(hero.eyebrow, hero.badge) || 'Heizung & Sanitär · München',
    heroTitle: first(hero.title) || 'Ihr zuverlässiger Partner für Heizung & Sanitär',
    heroSubtitle:
      first(hero.subtitle, hero.description) ||
      'Von der Badmodernisierung bis zur Notfall-Reparatur – Schnell, transparent und regional in Ihrer Nähe.',
    highlights: mergeStringList(stringList(hero.highlights), [
      'Meisterbetrieb',
      'Festpreis vor Start',
      'Regional in München',
    ]),
    servicesEyebrow: first(findSection(data, ['services'])?.eyebrow) || 'Leistungen',
    servicesTitle: first(findSection(data, ['services'])?.title) || 'Unsere Leistungen',
    servicesSubtitle:
      first(findSection(data, ['services'])?.subtitle, findSection(data, ['services'])?.description) ||
      'Ob geplante Modernisierung oder akuter Schaden: Sie sprechen mit einem festen Ansprechpartner – und wir kümmern uns um den Rest.',
    services: serviceItems,
    aboutEyebrow: first(about.eyebrow) || 'Über uns',
    aboutTitle: first(about.title) || `Warum ${name}?`,
    aboutText:
      first(typeof data.about === 'string' ? data.about : '', about.text, about.description) ||
      `${name} ist ein inhabergeführter Meisterbetrieb. Wir betreuen Haushalte und Immobilien mit klaren Zusagen – von der Heizungswartung bis zum kompletten Traumbad.`,
    benefits: mapBenefits(data),
    reviews: {
      rating: first(reviews.rating, reviews.score) || '4,9',
      count: first(reviews.count, reviews.total) || '120+',
      source: first(reviews.source, reviews.title) || 'Google-Bewertungen',
    },
    contactEyebrow: first(contact.eyebrow) || 'Kontakt',
    contactTitle: first(contact.title) || 'Schnelle Anfrage',
    contactText:
      first(contact.text, contact.description) ||
      'Schildern Sie kurz Ihr Anliegen. Wir melden uns in der Regel noch am selben Werktag – bei Notfällen sofort über die Notdienst-Nummer.',
    footerAbout:
      first(footer.about, footer.text) ||
      `${name} – Ihr Meisterbetrieb für Heizung, Sanitär und 24/7-Notdienst.`,
  };
}
