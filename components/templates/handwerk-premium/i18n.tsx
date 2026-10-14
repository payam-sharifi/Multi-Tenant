"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { HandwerkPremiumContent } from "@/lib/types/handwerk-premium";
import { dictionaries, type Dict } from "@/components/templates/handwerk-premium/content";
import { EMAIL, IMAGES, PHONE } from "@/components/templates/handwerk-premium/data";
import { QuoteProvider } from "@/components/templates/handwerk-premium/quote";
import { googleMapsEmbed, googleMapsSearch, telHref } from "@/components/templates/handwerk-premium/utils";

function pick<T>(value: T | undefined, fallback: T): T {
  return value === undefined ? fallback : value;
}

function firstNonEmpty(...values: (string | undefined)[]): string {
  for (const value of values) {
    if (value?.trim()) return value.trim();
  }
  return "";
}

export type HandwerkDict = Omit<
  Dict,
  "contact" | "hero" | "services" | "team" | "projects" | "beforeAfter" | "reviews" | "quality" | "materials"
> & {
  sample: boolean;
  sections: HandwerkPremiumContent["present"];
  logo: string;
  hero: Omit<Dict["hero"], "stats"> & {
    image: string;
    stats: { value: string; label: string }[];
  };
  quality: Dict["quality"] & { image: string };
  services: Omit<Dict["services"], "items"> & {
    items: { id: string; title: string; description: string; image: string }[];
  };
  team: Omit<Dict["team"], "items"> & { items: { id: string; name: string; role: string; image: string }[] };
  projects: Omit<Dict["projects"], "items"> & {
    items: { title: string; image: string; area: string; duration: string; kind: string; city: string }[];
  };
  beforeAfter: Omit<Dict["beforeAfter"], "items"> & {
    items: {
      title: string;
      beforeImage: string;
      afterImage: string;
      area: string;
      duration: string;
      kind: string;
      city: string;
    }[];
  };
  reviews: Omit<Dict["reviews"], "items"> & {
    items: { name: string; text: string; rating: number; source: string; city: string; date: string }[];
  };
  contact: Omit<Dict["contact"], "locations" | "hoursRows"> & {
    phone: string;
    phoneHref: string;
    email: string;
    address?: string;
    coverage: string;
    hqAddress: string;
    hours: string;
    hoursRows: { days: string; hours: string }[];
    mapEmbed: string;
    googleMapsUrl: string;
    locations: { name: string; address: string; phone?: string }[];
  };
  materials: Omit<Dict["materials"], "items"> & {
    items: { title: string; spec: string; image: string }[];
  };
};

function buildDict(base: Dict, content: HandwerkPremiumContent, brandName: string): HandwerkDict {
  const sample = content.sample;
  const p = content.present;
  const defs = <T,>(list: T[]) => (sample ? list : []);

  const serviceImages = [IMAGES.sanierung, IMAGES.renovierung, IMAGES.visual, IMAGES.foerderung];
  const jsonServices = (content.services?.items ?? []).filter((item) => item.title);
  const fallbackServices = content.serviceItems.map((service, i) => ({
    id: service.id ?? `service-${i + 1}`,
    title: service.title,
    description: service.description,
    image: service.image ?? serviceImages[i % serviceImages.length],
  }));
  const serviceItems = jsonServices.length
    ? jsonServices.map((item, i) => ({
        id: item.id ?? `service-${i + 1}`,
        title: item.title ?? "",
        description: item.description ?? "",
        image: item.image ?? serviceImages[i % serviceImages.length],
      }))
    : sample
      ? base.services.items.map((item, i) => ({
          id: `service-${i + 1}`,
          ...item,
          image: serviceImages[i],
        }))
      : fallbackServices;

  const guaranteeItems = content.guarantees?.items?.length
    ? content.guarantees.items.filter((item) => item.title).map((item) => ({
        title: item.title ?? "",
        description: item.description ?? "",
      }))
    : defs(base.guarantees.items);

  const projectImages = [IMAGES.project1, IMAGES.project2, IMAGES.project3];
  const projectItems = content.projects?.items?.length
    ? content.projects.items.filter((item) => item.title).map((item, i) => ({
        title: item.title ?? "",
        image: item.image ?? projectImages[i % projectImages.length],
        area: item.area ?? "",
        duration: item.duration ?? "",
        kind: item.kind ?? "",
        city: item.city ?? "",
      }))
    : defs(base.projects.items).map((item, i) => ({ ...item, image: projectImages[i] }));

  const reviewItems = content.reviews?.items?.length
    ? content.reviews.items.filter((item) => item.text).map((item) => ({
        name: item.name ?? "",
        text: item.text ?? "",
        rating: item.rating ?? 5,
        source: item.source ?? base.reviews.source,
        city: item.city ?? "",
        date: item.date ?? "",
      }))
    : defs(base.reviews.items).map((item) => ({ ...item, source: base.reviews.source }));

  const teamPhotos = [IMAGES.team1, IMAGES.team2, IMAGES.team3, IMAGES.team4, IMAGES.team5, IMAGES.team6, IMAGES.team7, IMAGES.team8];
  const teamItems = content.team?.items?.length
    ? content.team.items.filter((item) => item.name).map((item, i) => ({
        id: item.id ?? `member-${i + 1}`,
        name: item.name ?? "",
        role: item.role ?? "",
        image: item.image ?? "",
      }))
    : defs(base.team.items).map((item, i) => ({
        id: `member-${i + 1}`,
        ...item,
        image: teamPhotos[i],
      }));

  const baImages = [IMAGES.living, IMAGES.kitchen, IMAGES.guest];
  const beforeAfterItems = content.beforeAfter?.items?.length
    ? content.beforeAfter.items.filter((item) => item.title).map((item, i) => ({
        title: item.title ?? "",
        beforeImage: item.beforeImage ?? baImages[i % baImages.length],
        afterImage: item.afterImage ?? baImages[i % baImages.length],
        area: item.area ?? "",
        duration: item.duration ?? "",
        kind: item.kind ?? "",
        city: item.city ?? "",
      }))
    : defs(base.beforeAfter.items).map((item, i) => ({
        ...item,
        beforeImage: baImages[i],
        afterImage: projectImages[i],
      }));

  const processItems = content.process?.items?.length
    ? content.process.items.filter((item) => item.title).map((item) => ({
        title: item.title ?? "",
        description: item.description ?? "",
      }))
    : defs(base.process.items);

  const faqItems = content.faq?.items?.length ? content.faq.items : defs(base.faq.items);

  const locationItems = content.contactBlock?.items?.length
    ? content.contactBlock.items.filter((item) => item.name).map((item) => ({
        name: item.name ?? "",
        address: item.address ?? "",
        phone: item.phone,
      }))
    : defs(base.contact.locations);

  const hoursRows = content.contactBlock?.hoursRows?.length
    ? content.contactBlock.hoursRows
        .filter((row) => row.days || row.hours)
        .map((row) => ({ days: row.days ?? "", hours: row.hours ?? "" }))
    : content.contact?.hours
      ? [{ days: "", hours: content.contact.hours }]
      : defs(base.contact.hoursRows);

  const materialImages = [
    IMAGES.material1,
    IMAGES.material2,
    IMAGES.material3,
    IMAGES.material4,
    IMAGES.material5,
    IMAGES.material6,
    IMAGES.material7,
    IMAGES.material8,
  ];
  const materialItems = content.materials?.items?.length
    ? content.materials.items.filter((item) => item.title).map((item, i) => ({
        title: item.title ?? "",
        spec: item.spec ?? "",
        image: item.image ?? materialImages[i % materialImages.length],
      }))
    : defs(base.materials.items).map((item, i) => ({ ...item, image: materialImages[i] }));

  const phone = content.contact?.phone ?? (sample ? PHONE : "");
  const email = content.contact?.email ?? (sample ? EMAIL : "");
  const hqAddress = pick(content.contactBlock?.hqAddress, sample ? base.contact.hqAddress : content.contact?.address ?? "");
  const mapQuery = firstNonEmpty(content.contactBlock?.mapQuery, hqAddress, content.contact?.address);
  const mapEmbed = firstNonEmpty(
    content.contactBlock?.mapEmbed,
    mapQuery ? googleMapsEmbed(mapQuery) : "",
  );
  const googleMapsUrl = firstNonEmpty(
    content.contactBlock?.googleMapsUrl,
    mapQuery ? googleMapsSearch(mapQuery) : "",
  );
  const hoursSummary = firstNonEmpty(
    content.header?.hours,
    sample ? base.header.hours : "",
    hoursRows[0] ? [hoursRows[0].days, hoursRows[0].hours].filter(Boolean).join(" ") : "",
  );
  const hours = firstNonEmpty(
    content.contactBlock?.hours,
    hoursSummary,
    content.contact?.hours,
    sample ? base.contact.hours : "",
  );
  const hj = content.hero;

  const sections: HandwerkPremiumContent["present"] = {
    hero: p.hero,
    services: p.services && serviceItems.length > 0,
    guarantees: p.guarantees && guaranteeItems.length > 0,
    projects: p.projects && projectItems.length > 0,
    reviews: p.reviews && reviewItems.length > 0,
    quality: p.quality,
    team: p.team && teamItems.length > 0,
    beforeAfter: p.beforeAfter && beforeAfterItems.length > 0,
    financing: p.financing,
    process: p.process && processItems.length > 0,
    faq: p.faq && faqItems.length > 0,
    contact: p.contact,
    materials: p.materials && materialItems.length > 0,
  };

  return {
    ...base,
    sample,
    sections,
    logo: content.logo ?? "",
    contact: {
      ...base.contact,
      title: pick(content.contactBlock?.title, base.contact.title),
      eyebrow: pick(content.contactBlock?.eyebrow, base.contact.eyebrow),
      phone,
      phoneHref: phone ? telHref(phone) : "",
      email,
      address: content.contact?.address,
      coverage: pick(content.contactBlock?.coverage, sample ? base.contact.coverage : ""),
      hqAddress,
      hours,
      hoursRows,
      mapEmbed,
      googleMapsUrl,
      locations: locationItems,
    },
    header: {
      ...base.header,
      cta: pick(content.header?.cta, base.header.cta),
      hours: hoursSummary,
    },
    hero: {
      ...base.hero,
      badge: pick(hj?.badge, sample ? base.hero.badge : ""),
      title: pick(hj?.title, sample ? base.hero.title : brandName),
      subtitle: pick(hj?.subtitle, sample ? base.hero.subtitle : ""),
      ctaPrimary: pick(hj?.ctaPrimary, base.hero.ctaPrimary),
      ctaSecondary: pick(hj?.ctaSecondary, base.hero.ctaSecondary),
      bullets: hj?.bullets?.length ? hj.bullets : sample ? base.hero.bullets : [],
      stats: hj?.stats?.length
        ? hj.stats.filter((item) => item.value && item.label).map((item) => ({ value: item.value ?? "", label: item.label ?? "" }))
        : sample
          ? base.hero.stats
          : [],
      image: hj?.image ?? (sample ? IMAGES.hero : ""),
    },
    services: {
      ...base.services,
      eyebrow: pick(content.services?.eyebrow ?? content.servicesBlock?.eyebrow, base.services.eyebrow),
      title: pick(content.services?.title ?? content.servicesBlock?.title, sample ? base.services.title : base.nav.services),
      subtitle: pick(content.services?.subtitle ?? content.servicesBlock?.subtitle, sample ? base.services.subtitle : ""),
      items: serviceItems,
    },
    guarantees: {
      ...base.guarantees,
      eyebrow: pick(content.guarantees?.eyebrow, base.guarantees.eyebrow),
      title: pick(content.guarantees?.title, sample ? base.guarantees.title : base.nav.guarantees),
      items: guaranteeItems,
    },
    projects: {
      ...base.projects,
      eyebrow: pick(content.projects?.eyebrow, base.projects.eyebrow),
      title: pick(content.projects?.title, sample ? base.projects.title : base.nav.projects),
      items: projectItems,
    },
    reviews: {
      ...base.reviews,
      eyebrow: pick(content.reviews?.eyebrow, base.reviews.eyebrow),
      title: pick(content.reviews?.title, sample ? base.reviews.title : ""),
      subtitle: pick(content.reviews?.subtitle, sample ? base.reviews.subtitle : ""),
      rating: pick(content.reviews?.rating, sample ? base.reviews.rating : ""),
      count: pick(content.reviews?.count, sample ? base.reviews.count : ""),
      location: pick(content.reviews?.location, sample ? base.reviews.location : ""),
      items: reviewItems,
    },
    quality: {
      ...base.quality,
      eyebrow: pick(content.quality?.eyebrow, base.quality.eyebrow),
      title: pick(content.quality?.title, sample ? base.quality.title : ""),
      subtitle: pick(content.quality?.subtitle, sample ? base.quality.subtitle : ""),
      image: content.quality?.image ?? (sample ? IMAGES.quality : ""),
    },
    team: {
      ...base.team,
      eyebrow: pick(content.team?.eyebrow, base.team.eyebrow),
      title: pick(content.team?.title, sample ? base.team.title : base.nav.team),
      subtitle: pick(content.team?.subtitle, sample ? base.team.subtitle : ""),
      mission: pick(content.team?.mission, sample ? base.team.mission : ""),
      note: pick(content.team?.note, sample ? base.team.note : ""),
      items: teamItems,
    },
    beforeAfter: {
      ...base.beforeAfter,
      eyebrow: pick(content.beforeAfter?.eyebrow, base.beforeAfter.eyebrow),
      title: pick(content.beforeAfter?.title, sample ? base.beforeAfter.title : base.nav.beforeAfter),
      items: beforeAfterItems,
    },
    financing: {
      ...base.financing,
      eyebrow: pick(content.financing?.eyebrow, base.financing.eyebrow),
      title: pick(content.financing?.title, sample ? base.financing.title : base.nav.financing),
      subtitle: pick(content.financing?.subtitle, sample ? base.financing.subtitle : ""),
    },
    process: {
      ...base.process,
      eyebrow: pick(content.process?.eyebrow, base.process.eyebrow),
      title: pick(content.process?.title, sample ? base.process.title : ""),
      items: processItems,
    },
    faq: {
      ...base.faq,
      eyebrow: pick(content.faq?.eyebrow, base.faq.eyebrow),
      title: pick(content.faq?.title, sample ? base.faq.title : base.nav.faq),
      items: faqItems,
    },
    materials: {
      ...base.materials,
      eyebrow: pick(content.materials?.eyebrow, base.materials.eyebrow),
      title: pick(content.materials?.title, sample ? base.materials.title : ""),
      subtitle: pick(content.materials?.subtitle, sample ? base.materials.subtitle : ""),
      items: materialItems,
    },
    footer: {
      ...base.footer,
      about: pick(content.footer?.about, sample ? base.footer.about : hj?.subtitle ?? ""),
      company: pick(content.footer?.company, sample ? base.footer.company : brandName),
      represented: pick(content.footer?.represented, sample ? base.footer.represented : ""),
      rights: pick(content.footer?.rights, sample ? base.footer.rights : `© ${new Date().getFullYear()} ${brandName}`),
      privacy: pick(content.footer?.privacy, base.footer.privacy),
      imprint: pick(content.footer?.imprint, base.footer.imprint),
    },
  };
}

type Ctx = { lang: Locale; t: HandwerkDict; brandName: string };

const I18nContext = createContext<Ctx | null>(null);

export function HandwerkProvider({
  locale,
  brandName,
  content,
  children,
}: {
  locale: Locale;
  brandName: string;
  content: HandwerkPremiumContent;
  children: React.ReactNode;
}) {
  const value = useMemo<Ctx>(
    () => ({
      lang: locale,
      brandName,
      t: buildDict(dictionaries[locale] ?? dictionaries.de, content, brandName),
    }),
    [locale, brandName, content],
  );

  return (
    <I18nContext.Provider value={value}>
      <QuoteProvider>{children}</QuoteProvider>
    </I18nContext.Provider>
  );
}

export function useHandwerk() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useHandwerk must be used inside <HandwerkProvider>");
  return ctx;
}
