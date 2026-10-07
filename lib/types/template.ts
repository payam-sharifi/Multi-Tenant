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
  title: string;
  description: string;
  price?: string;
  duration?: string;
  icon?: string;
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
  businessType: BusinessType;
  branding: SiteBranding;
  hero: SiteHero;
  services: SiteService[];
  menu: MenuCategory[];
  booking: BookingConfig;
  gallery: GalleryItem[];
  projects: GalleryItem[];
  contact: SiteContact;
  faq: FaqItem[];
  about: string;
  owner?: string;
};
