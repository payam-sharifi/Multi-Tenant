"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import type {
  ClinicBaseContent,
  ClinicBranchContent,
  ClinicDoctorContent,
  ClinicPlanContent,
} from "@/lib/types/clinic-base";
import { BookingProvider } from "@/templates/clinic-base/booking";
import { dictionaries, tenantTexts, type Dict } from "@/templates/clinic-base/content";
import {
  defaultBranches,
  defaultCheckupMeta,
  defaultDoctors,
  defaultPlanIcons,
  defaultServiceVisuals,
  defaultValueIcons,
  PHONE,
} from "@/templates/clinic-base/data";

/* ------------------------------------------------------------------ */
/* View models: what the components render                             */
/* ------------------------------------------------------------------ */

export type ClinicServiceView = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  price: string;
  icon?: string;
  image?: string;
  bookable: boolean;
};

export type ClinicPlanView = {
  id: string;
  name: string;
  desc: string;
  price?: number;
  oldPrice?: number;
  featured: boolean;
  icon: string;
  features: string[];
  serviceIndex?: number;
};

export type ClinicDoctorView = {
  id: string;
  name: string;
  spec: string;
  rating?: number;
  years?: number;
  /** empty string = no photo, render an initials avatar */
  image: string;
  serviceIndex?: number;
};

export type ClinicBranchView = {
  id: string;
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
  x: number;
  y: number;
  services: number[];
  image: string;
};

type B = Dict;

export type ClinicDict = Omit<B, "services" | "hero" | "checkup" | "about" | "doctors" | "locations" | "faq"> & {
  /** true when the sample (Lumera) fallbacks are active */
  sample: boolean;
  /** Which sections to render: present in the JSON AND complete enough to look right. */
  sections: ClinicBaseContent["present"];
  /** Customer logo URL, "" when none */
  logo: string;
  contact: { phone: string; phoneHref: string; email: string; address?: string; hours?: string };
  hero: B["hero"] & {
    ratingScore: string;
    chiefImage: string;
    heroImage: string;
    chiefDoctorId?: string;
    avatars: { src: string; name: string }[];
  };
  faq: B["faq"] & { items: { question: string; answer: string }[] };
  services: Omit<B["services"], "items" | "express"> & {
    items: ClinicServiceView[];
    express: B["services"]["express"] & { enabled: boolean; serviceId?: string };
  };
  checkup: Omit<B["checkup"], "plans"> & { currency: string; plans: ClinicPlanView[] };
  about: Omit<B["about"], "values"> & {
    image: string;
    values: { title: string; desc: string; icon: string }[];
  };
  doctors: Omit<B["doctors"], "specs"> & { items: ClinicDoctorView[] };
  locations: B["locations"] & { items: ClinicBranchView[] };
};

/* ------------------------------------------------------------------ */
/* Merge helpers: JSON value wins, otherwise the template default      */
/* ------------------------------------------------------------------ */

function pick<T>(value: T | undefined, fallback: T): T {
  return value === undefined ? fallback : value;
}

function sameKey(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function overlayByKey<T extends object>(
  incoming: T[],
  fallback: T[],
  keyOf: (item: T) => string,
): T[] {
  if (!incoming.length) return fallback;
  if (!fallback.length) return incoming;
  const key = (item: T) => keyOf(item).trim().toLowerCase();
  const matchesFallback = (item: T) => {
    const itemKey = key(item);
    return Boolean(itemKey && fallback.some((row) => key(row) === itemKey));
  };
  const allNew = incoming.every((item) => !matchesFallback(item));
  if (allNew && incoming.length >= fallback.length) return incoming;

  const merged = new Map<string, T>();
  for (const row of fallback) {
    const itemKey = key(row);
    if (itemKey) merged.set(itemKey, { ...row });
  }
  for (const item of incoming) {
    const itemKey = key(item);
    if (!itemKey) continue;
    const next = { ...(merged.get(itemKey) ?? ({} as T)) } as T;
    for (const [field, value] of Object.entries(item)) {
      if (value !== "" && value !== undefined && value !== null) {
        (next as Record<string, unknown>)[field] = value;
      }
    }
    merged.set(itemKey, next);
  }

  const used = new Set<string>();
  const result: T[] = [];
  for (const item of incoming) {
    const itemKey = key(item);
    if (!itemKey || used.has(itemKey)) continue;
    const row = merged.get(itemKey);
    if (row) {
      result.push(row);
      used.add(itemKey);
    }
  }
  for (const row of fallback) {
    const itemKey = key(row);
    if (!itemKey || used.has(itemKey)) continue;
    const value = merged.get(itemKey);
    if (value) {
      result.push(value);
      used.add(itemKey);
    }
  }
  return result;
}

function mergeStringList(provided: string[] | undefined, fallback: string[], limit = 8): string[] {
  const incoming = (provided ?? []).map((item) => item.trim()).filter(Boolean);
  if (!incoming.length) return fallback;
  if (!fallback.length || incoming.length >= fallback.length) return incoming.slice(0, limit);
  const result = [...fallback];
  for (const item of incoming) {
    if (!result.some((row) => sameKey(row, item))) result.push(item);
  }
  return result.slice(0, limit);
}

function mergeHeroStats(
  provided: { value?: string; label?: string }[] | undefined,
  fallback: { value: string; label: string }[],
): { value: string; label: string }[] {
  const incoming = (provided ?? [])
    .map((item) => ({ value: item.value?.trim() ?? "", label: item.label?.trim() ?? "" }))
    .filter((item) => item.value || item.label);
  const complete = incoming.filter((item): item is { value: string; label: string } =>
    Boolean(item.value && item.label),
  );
  if (!incoming.length) return fallback;
  if (!fallback.length) return complete;
  const matchesFallback = (item: { value: string; label: string }) =>
    fallback.some(
      (stat) =>
        (item.label && sameKey(stat.label, item.label)) ||
        (item.value && sameKey(stat.value, item.value)),
    );
  const isPatch =
    incoming.length < fallback.length ||
    incoming.some((item) => !item.value || !item.label) ||
    incoming.every(matchesFallback);
  if (!isPatch) return complete;
  const result = fallback.map((item) => ({ ...item }));
  for (const item of incoming) {
    const index = result.findIndex(
      (stat) =>
        (item.label && sameKey(stat.label, item.label)) ||
        (item.value && sameKey(stat.value, item.value)),
    );
    if (index >= 0) {
      result[index] = {
        value: item.value || result[index].value,
        label: item.label || result[index].label,
      };
    } else if (item.value && item.label) {
      result.push(item);
    }
  }
  return result.filter((item) => item.value && item.label).slice(0, 4);
}

function mergeAboutStats(
  provided: { value?: number; suffix?: string; label?: string }[] | undefined,
  fallback: readonly { value: number; suffix: string; label: string }[],
): { value: number; suffix: string; label: string }[] {
  const incoming = (provided ?? []).filter((item) => item.value !== undefined || item.label);
  if (!incoming.length) return fallback.map((item) => ({ ...item }));
  const complete = incoming
    .filter((item): item is { value: number; suffix?: string; label: string } =>
      Boolean(item.value !== undefined && item.label),
    )
    .map((item) => ({ value: item.value, suffix: item.suffix ?? "", label: item.label }));
  if (!fallback.length) return complete;
  const isPatch =
    incoming.length < fallback.length ||
    incoming.some((item) => item.value === undefined || !item.label) ||
    incoming.every((item) =>
      fallback.some(
        (stat) =>
          (item.label && sameKey(stat.label, item.label)) ||
          (item.value !== undefined && stat.value === item.value),
      ),
    );
  if (!isPatch) return complete;
  const result = fallback.map((item) => ({ ...item }));
  for (const item of incoming) {
    const index = result.findIndex(
      (stat) =>
        (item.label && sameKey(stat.label, item.label)) ||
        (item.value !== undefined && stat.value === item.value),
    );
    if (index >= 0) {
      result[index] = {
        value: item.value ?? result[index].value,
        suffix: item.suffix ?? result[index].suffix,
        label: item.label || result[index].label,
      };
    } else if (item.value !== undefined && item.label) {
      result.push({ value: item.value, suffix: item.suffix ?? "", label: item.label });
    }
  }
  return result.slice(0, 4);
}

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Fallback pin positions (in %) for branches that do not provide x/y. */
function autoPin(index: number): { x: number; y: number } {
  const preset = defaultBranches[index];
  if (preset) return { x: preset.x, y: preset.y };
  return { x: 18 + ((index * 23) % 64), y: 16 + ((index * 31) % 68) };
}

/**
 * Rules:
 * - a section missing from the JSON is not rendered (see `sections`);
 * - a missing text/label inside a present section falls back to the template default;
 * - when the JSON provides a list (services, plans, doctors, branches, ...), the list is used as-is.
 *   Items never inherit facts (price, address, phone, rating) from the built-in sample items,
 *   only visual placeholders (icons, photos, map pins).
 *
 * Merge the built-in (static) clinic texts with the content that came from the backend JSON.
 * Missing fields fall back to the template defaults; missing sections stay disabled.
 */
export function buildClinicDict(rawBase: Dict, content: ClinicBaseContent, locale: Locale, brandName: string): ClinicDict {
  const sample = content.sample;
  const tenant = tenantTexts[locale] ?? tenantTexts.de;
  const base: Dict = sample
    ? rawBase
    : {
        ...rawBase,
        hero: { ...rawBase.hero, ctaSecondary: tenant.ctaSecondary },
        services: { ...rawBase.services, ...tenant.services },
        checkup: { ...rawBase.checkup, ...tenant.checkup },
        about: { ...rawBase.about, ...tenant.about },
        doctors: { ...rawBase.doctors, ...tenant.doctors },
        locations: { ...rawBase.locations, ...tenant.locations },
      };
  const present = content.present;
  /** Template defaults (sample facts) are only used by demo sites. */
  const defs = <T,>(list: readonly T[]): readonly T[] => (sample ? list : []);

  /* services */
  const block = content.servicesBlock;
  const defaultServices: ClinicServiceView[] = base.services.items.map((item, index) => ({
    id: defaultServiceVisuals[index]?.id ?? `service-${index + 1}`,
    title: item.title,
    desc: item.desc,
    tags: [...item.tags],
    price: item.price,
    icon: defaultServiceVisuals[index]?.icon,
    image: defaultServiceVisuals[index]?.image,
    bookable: true,
  }));
  const jsonServices: ClinicServiceView[] = content.serviceItems.map((service, index) => ({
    id: service.id ?? `service-${index + 1}`,
    title: service.title,
    desc: service.description,
    tags: service.tags ?? [],
    price: service.price ?? "",
    icon: service.icon,
    image: service.image,
    bookable: service.bookable !== false,
  }));
  const serviceItems = !present.services
    ? []
    : overlayByKey(
        jsonServices,
        (defs(defaultServices) as ClinicServiceView[]).slice(),
        (item) => item.title,
      );
  const serviceIndexOf = (id?: string) => {
    if (!id) return undefined;
    const index = serviceItems.findIndex((item) => item.id === id);
    return index >= 0 ? index : undefined;
  };
  const safeIndex = (index?: number) => (index !== undefined && serviceItems[index] ? index : undefined);

  const ex = block?.express;
  const baseEx = base.services.express;

  /* doctors */
  const dj = content.doctors;
  const mapDoctor = (p: ClinicDoctorContent | undefined, d: (typeof defaultDoctors)[number] | undefined, i: number): ClinicDoctorView | null => {
    const name = p?.name ?? (p ? undefined : d?.name);
    if (!name) return null;
    return {
      id: p?.id ?? d?.id ?? `doctor-${i + 1}`,
      name,
      spec: p?.specialty ?? (d ? base.doctors.specs[d.specIndex] : ""),
      rating: p?.rating ?? d?.rating,
      years: p?.years ?? d?.years,
      image: p?.image ?? d?.image ?? (sample ? defaultDoctors[i % defaultDoctors.length].image : ""),
      serviceIndex: p ? serviceIndexOf(p.serviceId) : safeIndex(d?.serviceIndex),
    };
  };
  const doctorItems: ClinicDoctorView[] = !present.doctors
    ? []
    : overlayByKey(
        (dj?.items ?? []).map((item, i) => mapDoctor(item, undefined, i)).filter((item): item is ClinicDoctorView => Boolean(item)),
        defs(defaultDoctors)
          .map((item, i) => mapDoctor(undefined, item, i))
          .filter((item): item is ClinicDoctorView => Boolean(item)),
        (item) => item.name,
      );

  /* hero */
  const hj = content.hero;
  const lead = present.doctors && !hj?.chiefName ? doctorItems[0] : undefined;
  const heroStats = mergeHeroStats(hj?.stats, [...defs(base.hero.stats)]);
  const avatars: { src: string; name: string }[] = hj?.avatars
    ? hj.avatars.map((src) => ({ src, name: "" }))
    : present.doctors
      ? doctorItems.slice(0, 4).map((d) => ({ src: d.image, name: d.name }))
      : sample
        ? defaultDoctors.slice(0, 4).map((d) => ({ src: d.image, name: d.name }))
        : [];
  const fallback = <T,>(value: T | undefined, sampleValue: T, tenantValue: T): T =>
    value !== undefined ? value : sample ? sampleValue : tenantValue;

  /* checkup */
  const cj = content.checkup;
  const mapPlan = (p: ClinicPlanContent | undefined, d: Dict["checkup"]["plans"][number] | undefined, i: number): ClinicPlanView | null => {
    const name = p?.name ?? (p ? undefined : d?.name);
    if (!name) return null;
    const meta = defaultCheckupMeta[i];
    return {
      id: p?.id ?? `plan-${i + 1}`,
      name,
      desc: p?.desc ?? d?.desc ?? "",
      price: p ? p.price : meta?.price,
      oldPrice: p ? p.oldPrice : (meta?.old ?? undefined),
      featured: p ? (p.featured ?? false) : (meta?.featured ?? false),
      icon: p?.icon ?? defaultPlanIcons[i] ?? "shieldcheck",
      features: p ? (p.features ?? []) : d ? [...d.features] : [],
      serviceIndex: p ? serviceIndexOf(p.serviceId) : safeIndex([0, 4, 2][i]),
    };
  };
  const plans: ClinicPlanView[] = overlayByKey(
    (cj?.plans ?? []).map((item, i) => mapPlan(item, undefined, i)).filter((item): item is ClinicPlanView => Boolean(item)),
    defs(base.checkup.plans)
      .map((item, i) => mapPlan(undefined, item, i))
      .filter((item): item is ClinicPlanView => Boolean(item)),
    (item) => item.name,
  );

  /* about */
  const aj = content.about;
  const mapValue = (
    p: { title?: string; desc?: string; icon?: string } | undefined,
    d: Dict["about"]["values"][number] | undefined,
    i: number,
  ) => {
    const title = p?.title ?? d?.title;
    if (!title) return null;
    return { title, desc: p?.desc ?? d?.desc ?? "", icon: p?.icon ?? defaultValueIcons[i] ?? "award" };
  };
  const values = overlayByKey(
    (aj?.values ?? []).map((item, i) => mapValue(item, undefined, i)).filter((item): item is NonNullable<typeof item> => Boolean(item)),
    defs(base.about.values)
      .map((item, i) => mapValue(undefined, item, i))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    (item) => item.title,
  );
  const aboutStats = mergeAboutStats(aj?.stats, defs(base.about.stats));

  /* locations */
  const lj = content.locations;
  const allServiceIndexes = serviceItems.map((_, index) => index);
  const branchPhone = content.contact?.phone ?? (sample ? PHONE : "");
  const mapBranch = (p: ClinicBranchContent | undefined, d: (typeof defaultBranches)[number] | undefined, i: number): ClinicBranchView | null => {
    const name = p?.name ?? (p ? undefined : d?.name);
    if (!name) return null;
    const phone = p?.phone ?? d?.phone ?? branchPhone;
    const pin = autoPin(i);
    const fromIds = p?.serviceIds
      ?.map((id) => serviceIndexOf(id))
      .filter((index): index is number => index !== undefined);
    return {
      id: p?.id ?? d?.id ?? `branch-${i + 1}`,
      name,
      address: p?.address ?? d?.address ?? "",
      phone,
      phoneHref: phone ? telHref(phone) : "",
      hours: p?.hours ?? lj?.hours ?? content.contact?.hours ?? (sample ? base.locations.hours : ""),
      image: p?.image ?? "",
      x: p?.x ?? pin.x,
      y: p?.y ?? pin.y,
      services: fromIds?.length
        ? fromIds
        : p
          ? allServiceIndexes
          : (d?.services ?? []).filter((index) => serviceItems[index]),
    };
  };
  const branchItems: ClinicBranchView[] = !present.locations
    ? []
    : overlayByKey(
        (lj?.items ?? []).map((item, i) => mapBranch(item, undefined, i)).filter((item): item is ClinicBranchView => Boolean(item)),
        defs(defaultBranches)
          .map((item, i) => mapBranch(undefined, item, i))
          .filter((item): item is ClinicBranchView => Boolean(item)),
        (item) => item.name,
      );

  /* faq */
  const faqItems = present.faq ? (content.faq?.items ?? []) : [];

  /* contact + footer */
  const phone = content.contact?.phone ?? (sample ? PHONE : "");
  const email = content.contact?.email ?? (sample ? base.footer.email : "");
  const fj = content.footer;

  const sections: ClinicBaseContent["present"] = {
    hero: present.hero,
    services: present.services && serviceItems.length > 0,
    checkup: present.checkup && plans.length > 0,
    about: present.about && (values.length > 0 || aboutStats.length > 0),
    doctors: present.doctors && doctorItems.length > 0,
    locations: present.locations && branchItems.length > 0,
    faq: present.faq && faqItems.length > 0,
  };

  return {
    ...base,
    sample,
    sections,
    logo: content.logo ?? "",
    contact: { phone, phoneHref: phone ? telHref(phone) : "", email, address: content.contact?.address, hours: content.contact?.hours },
    header: {
      ...base.header,
      hours: pick(content.header?.hours, sample ? base.header.hours : ""),
      book: pick(content.header?.book, base.header.book),
    },
    hero: {
      ...base.hero,
      badge: fallback(hj?.badge, base.hero.badge, ""),
      titleA: fallback(hj?.titleA, base.hero.titleA, brandName),
      titleB: fallback(hj?.titleB, base.hero.titleB, ""),
      titleC: fallback(hj?.titleC, base.hero.titleC, ""),
      subtitle: fallback(hj?.subtitle, base.hero.subtitle, ""),
      ctaPrimary: pick(hj?.ctaPrimary, base.hero.ctaPrimary),
      ctaSecondary: pick(hj?.ctaSecondary, base.hero.ctaSecondary),
      stats: heroStats,
      pillValue: fallback(hj?.pillValue, base.hero.pillValue, ""),
      pillText: fallback(hj?.pillText, base.hero.pillText, ""),
      reviews: fallback(hj?.reviews, base.hero.reviews, ""),
      ratingScore: fallback(hj?.ratingScore, "4.9", ""),
      promiseTitle: fallback(hj?.promiseTitle, base.hero.promiseTitle, ""),
      promiseText: fallback(hj?.promiseText, base.hero.promiseText, ""),
      chiefRole: fallback(hj?.chiefRole, base.hero.chiefRole, ""),
      chiefName: fallback(hj?.chiefName, lead?.name ?? base.hero.chiefName, lead?.name ?? ""),
      chiefMeta: fallback(hj?.chiefMeta, lead ? lead.spec : base.hero.chiefMeta, lead ? lead.spec : ""),
      // An explicit hero picture beats the lead doctor's portrait.
      chiefImage:
        hj?.image && !hj.chiefImage
          ? ""
          : fallback(hj?.chiefImage, lead?.image || defaultDoctors[0].image, lead?.image ?? ""),
      heroImage: hj?.image ?? "",
      chiefDoctorId: lead?.id,
      available: fallback(hj?.available, base.hero.available, ""),
      avatars,
    },
    services: {
      ...base.services,
      eyebrow: pick(block?.eyebrow, base.services.eyebrow),
      title: pick(block?.title, base.services.title),
      subtitle: pick(block?.subtitle, base.services.subtitle),
      book: pick(block?.bookLabel, base.services.book),
      from: pick(block?.fromLabel, base.services.from),
      items: serviceItems,
      express: {
        ...baseEx,
        enabled: ex ? ex.enabled && (sample || Boolean(ex.title)) : sample,
        serviceId: ex?.serviceId,
        badge: pick(ex?.badge, baseEx.badge),
        title: pick(ex?.title, baseEx.title),
        desc: pick(ex?.desc, baseEx.desc),
        tags: mergeStringList(ex?.tags, sample ? baseEx.tags : []),
        highlights: mergeStringList(ex?.highlights, sample ? baseEx.highlights : []),
        cta: pick(ex?.cta, baseEx.cta),
        resultTitle: pick(ex?.resultTitle, baseEx.resultTitle),
        resultRows: mergeStringList(ex?.resultRows, sample ? baseEx.resultRows : []),
        resultNorm: pick(ex?.resultNorm, baseEx.resultNorm),
        resultTime: pick(ex?.resultTime, baseEx.resultTime),
      },
    },
    checkup: {
      ...base.checkup,
      eyebrow: pick(cj?.eyebrow, base.checkup.eyebrow),
      title: pick(cj?.title, base.checkup.title),
      subtitle: pick(cj?.subtitle, base.checkup.subtitle),
      from: pick(cj?.from, base.checkup.from),
      featured: pick(cj?.featuredLabel, base.checkup.featured),
      discount: pick(cj?.discount, base.checkup.discount),
      book: pick(cj?.book, base.checkup.book),
      note: pick(cj?.note, base.checkup.note),
      currency: pick(cj?.currency, "€"),
      plans,
    },
    about: {
      ...base.about,
      eyebrow: pick(aj?.eyebrow, base.about.eyebrow),
      title: aj?.title || (sample ? base.about.title : brandName),
      subtitle: pick(aj?.subtitle, base.about.subtitle),
      image: aj?.image ?? "",
      values,
      stats: aboutStats,
    },
    doctors: {
      ...base.doctors,
      eyebrow: pick(dj?.eyebrow, base.doctors.eyebrow),
      title: pick(dj?.title, base.doctors.title),
      subtitle: pick(dj?.subtitle, base.doctors.subtitle),
      book: pick(dj?.book, base.doctors.book),
      experience: pick(dj?.experience, base.doctors.experience),
      items: doctorItems,
    },
    locations: {
      ...base.locations,
      eyebrow: pick(lj?.eyebrow, base.locations.eyebrow),
      title: pick(lj?.title, base.locations.title),
      subtitle: pick(lj?.subtitle, base.locations.subtitle),
      open: pick(lj?.open, base.locations.open),
      hours: pick(lj?.hours, base.locations.hours),
      directions: pick(lj?.directions, base.locations.directions),
      book: pick(lj?.book, base.locations.book),
      // The built-in note ("+ 5 more branches") only makes sense for the built-in branches.
      more: lj?.items ? pick(lj?.more, "") : pick(lj?.more, base.locations.more),
      offers: pick(lj?.offers, base.locations.offers),
      items: branchItems,
    },
    faq: {
      ...base.faq,
      eyebrow: pick(content.faq?.eyebrow, base.faq.eyebrow),
      title: pick(content.faq?.title, base.faq.title),
      subtitle: pick(content.faq?.subtitle, base.faq.subtitle),
      items: faqItems,
    },
    footer: {
      ...base.footer,
      about: fallback(fj?.about, base.footer.about, hj?.subtitle ?? ""),
      legal: pick(fj?.legal, base.footer.legal),
      emergency: fallback(fj?.emergency, base.footer.emergency, ""),
      hoursRows: fj?.hoursRows ?? (sample ? base.footer.hoursRows : []),
      rights: pick(fj?.rights, base.footer.rights),
      privacy: pick(fj?.privacy, base.footer.privacy),
      terms: pick(fj?.terms, base.footer.terms),
      cookies: pick(fj?.cookies, base.footer.cookies),
      email,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type Ctx = { lang: Locale; t: ClinicDict; brandName: string };

const I18nContext = createContext<Ctx | null>(null);

export function ClinicProvider({
  locale,
  brandName,
  content,
  children,
}: {
  locale: Locale;
  brandName: string;
  content: ClinicBaseContent;
  children: React.ReactNode;
}) {
  const value = useMemo<Ctx>(
    () => ({
      lang: locale,
      brandName,
      t: buildClinicDict(dictionaries[locale] ?? dictionaries.de, content, locale, brandName),
    }),
    [locale, brandName, content],
  );

  return (
    <I18nContext.Provider value={value}>
      <BookingProvider>{children}</BookingProvider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <ClinicProvider>");
  return ctx;
}
