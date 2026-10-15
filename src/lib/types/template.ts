import type { ClinicBaseContent } from '@/lib/types/clinic-base';
import type { HandwerkBaseContent } from '@/lib/types/handwerk-base';
import type { HaustechnikContent } from '@/lib/types/haustechnik-base';

export const BUSINESS_TYPES = [
  'medical',
  'salon',
  'restaurant',
  'services',
  'general',
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export type SiteBranding = {
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  address: string;
  email: string;
};

export type SiteHero = {
  title: string;
  subtitle: string;
  ctaText: string;
  bgImage?: string;
};

export type SiteService = {
  id?: string;
  title: string;
  description: string;
  price?: string;
  duration?: string;
  icon?: string;
  /** Only https URLs from allowed hosts survive parsing (see lib/image-hosts.ts). */
  image?: string;
  tags?: string[];
  /** false hides the "Book" button for this service. */
  bookable?: boolean;
};

/** Optional "express analyses" style banner shown under the services (clinic-base). */
export type SiteServicesExpress = {
  enabled: boolean;
  /** id of the service pre-selected in the booking form. */
  serviceId?: string;
  badge?: string;
  title?: string;
  desc?: string;
  tags?: string[];
  highlights?: string[];
  cta?: string;
  resultTitle?: string;
  resultRows?: string[];
  resultNorm?: string;
  resultTime?: string;
};

/** Texts around the services list (section header, labels, banner). */
export type SiteServicesBlock = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  bookLabel?: string;
  fromLabel?: string;
  express?: SiteServicesExpress;
};

export type MenuItem = {
  name: string;
  description: string;
  price: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export type BookingConfig = {
  enabled: boolean;
  title: string;
  fields: string[];
};

export type GalleryItem = {
  title: string;
  image?: string;
  description?: string;
};

export type SiteContact = {
  mapUrl?: string;
  workingHours: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteConfig = {
  /** Industry bucket used for defaults (colors, copy, fallback template). */
  businessType: BusinessType;
  /**
   * Same value as `businessType`. The template registry reads this first
   * after an explicit `templateId` so JSON can send `businessCategory`.
   */
  businessCategory: BusinessType;
  branding: SiteBranding;
  hero: SiteHero;
  services: SiteService[];
  servicesBlock?: SiteServicesBlock;
  /** Optional design variant of the business type, from theme_config.template. */
  templateId?: string;
  /** Public path prefix on localhost (`/demo`). Empty on real subdomain hosts. */
  basePath?: string;
  /** Dev-only query (`?fixture=...`) preserved on legal links. */
  previewQuery?: string;
  /** Parsed content for the clinic-base template (only set for that template). */
  clinic?: ClinicBaseContent;
  /** Parsed content for the handwerk-base renovation template. */
  handwerk?: HandwerkBaseContent;
  /** Parsed content for the haustechnik-base template. */
  haustechnik?: HaustechnikContent;
  menu: MenuCategory[];
  booking: BookingConfig;
  gallery: GalleryItem[];
  projects: GalleryItem[];
  contact: SiteContact;
  faq: FaqItem[];
  about: string;
  owner?: string;
};
