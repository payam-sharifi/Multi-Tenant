import type { SiteService, SiteServicesBlock } from '@/lib/types/template';

/**
 * Everything the handwerk-premium template reads from site_data.
 * A section missing from the JSON is not rendered.
 *
 * Hermes (Telegram/WhatsApp) writes these as `site_data.sections[{ type }]`
 * or as top-level keys with the same names. Live sites only show JSON
 * (`demo` must not be true). Preview/approve/reject is handled by the
 * agent API, not this parser.
 *
 * Writable section types:
 * hero, services, guarantees, projects, reviews (google_reviews),
 * quality, team, before_after, financing, process, faq, contact,
 * working_hours, materials, footer
 *
 * Also top-level: phone, email, address, logo, google_maps, working_hours
 */
export type HandwerkHeroContent = {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  bullets?: string[];
  stats?: { value?: string; label?: string }[];
  image?: string;
};

export type HandwerkServiceItem = {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  href?: string;
};

export type HandwerkServicesContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: HandwerkServiceItem[];
};

export type HandwerkGuaranteeItem = {
  title?: string;
  description?: string;
  icon?: string;
};

export type HandwerkGuaranteesContent = {
  eyebrow?: string;
  title?: string;
  items?: HandwerkGuaranteeItem[];
};

export type HandwerkProjectItem = {
  id?: string;
  title?: string;
  image?: string;
  area?: string;
  duration?: string;
  kind?: string;
  city?: string;
  description?: string;
};

export type HandwerkProjectsContent = {
  eyebrow?: string;
  title?: string;
  items?: HandwerkProjectItem[];
};

export type HandwerkReviewItem = {
  name?: string;
  text?: string;
  rating?: number;
  source?: string;
  city?: string;
  date?: string;
};

export type HandwerkReviewsContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  rating?: string;
  count?: string;
  location?: string;
  googleUrl?: string;
  items?: HandwerkReviewItem[];
};

export type HandwerkQualityContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: string;
};

export type HandwerkTeamMember = {
  id?: string;
  name?: string;
  role?: string;
  image?: string;
};

export type HandwerkTeamContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  mission?: string;
  note?: string;
  items?: HandwerkTeamMember[];
};

export type HandwerkBeforeAfterItem = {
  id?: string;
  title?: string;
  beforeImage?: string;
  afterImage?: string;
  area?: string;
  duration?: string;
  kind?: string;
  city?: string;
};

export type HandwerkBeforeAfterContent = {
  eyebrow?: string;
  title?: string;
  items?: HandwerkBeforeAfterItem[];
};

export type HandwerkFinancingContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  amountLabel?: string;
  yearsLabel?: string;
  rateLabel?: string;
  resultLabel?: string;
  defaultAmount?: number;
  defaultYears?: number;
  defaultRate?: number;
};

export type HandwerkProcessStep = {
  title?: string;
  description?: string;
};

export type HandwerkProcessContent = {
  eyebrow?: string;
  title?: string;
  items?: HandwerkProcessStep[];
};

export type HandwerkFaqContent = {
  eyebrow?: string;
  title?: string;
  items?: { question: string; answer: string }[];
};

export type HandwerkLocationItem = {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
};

export type HandwerkHoursRow = {
  days?: string;
  hours?: string;
};

export type HandwerkContactContent = {
  eyebrow?: string;
  title?: string;
  coverage?: string;
  hqLabel?: string;
  hqAddress?: string;
  formNote?: string;
  hours?: string;
  hoursRows?: HandwerkHoursRow[];
  mapQuery?: string;
  mapEmbed?: string;
  googleMapsUrl?: string;
  items?: HandwerkLocationItem[];
};

export type HandwerkMaterialItem = {
  title?: string;
  spec?: string;
  image?: string;
};

export type HandwerkMaterialsContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: HandwerkMaterialItem[];
};

export type HandwerkFooterContent = {
  about?: string;
  rights?: string;
  privacy?: string;
  imprint?: string;
  company?: string;
  represented?: string;
};

export type HandwerkPremiumContent = {
  sample: boolean;
  present: {
    hero: boolean;
    services: boolean;
    guarantees: boolean;
    projects: boolean;
    reviews: boolean;
    quality: boolean;
    team: boolean;
    beforeAfter: boolean;
    financing: boolean;
    process: boolean;
    faq: boolean;
    contact: boolean;
    materials: boolean;
  };
  logo?: string;
  contact?: { phone?: string; email?: string; address?: string; hours?: string };
  header?: { cta?: string; hours?: string };
  hero?: HandwerkHeroContent;
  serviceItems: SiteService[];
  servicesBlock?: SiteServicesBlock;
  services?: HandwerkServicesContent;
  guarantees?: HandwerkGuaranteesContent;
  projects?: HandwerkProjectsContent;
  reviews?: HandwerkReviewsContent;
  quality?: HandwerkQualityContent;
  team?: HandwerkTeamContent;
  beforeAfter?: HandwerkBeforeAfterContent;
  financing?: HandwerkFinancingContent;
  process?: HandwerkProcessContent;
  faq?: HandwerkFaqContent;
  contactBlock?: HandwerkContactContent;
  materials?: HandwerkMaterialsContent;
  footer?: HandwerkFooterContent;
};
