import type { SiteService, SiteServicesBlock } from '@/lib/types/template';

/**
 * Everything the clinic-premium template reads from site_data.
 * All fields are optional: a missing field falls back to the template default,
 * and a section that is missing from the JSON is not rendered at all.
 */
export type ClinicHeroContent = {
  badge?: string;
  titleA?: string;
  titleB?: string;
  titleC?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  stats?: { value?: string; label?: string }[];
  pillValue?: string;
  pillText?: string;
  ratingScore?: string;
  reviews?: string;
  promiseTitle?: string;
  promiseText?: string;
  chiefRole?: string;
  chiefName?: string;
  chiefMeta?: string;
  chiefImage?: string;
  image?: string;
  available?: string;
  avatars?: string[];
};

export type ClinicPlanContent = {
  id?: string;
  name?: string;
  desc?: string;
  price?: number;
  oldPrice?: number;
  featured?: boolean;
  icon?: string;
  features?: string[];
  serviceId?: string;
};

export type ClinicCheckupContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  from?: string;
  featuredLabel?: string;
  discount?: string;
  book?: string;
  note?: string;
  currency?: string;
  plans?: ClinicPlanContent[];
};

export type ClinicAboutContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  values?: { title?: string; desc?: string; icon?: string }[];
  stats?: { value?: number; suffix?: string; label?: string }[];
};

export type ClinicDoctorContent = {
  id?: string;
  name?: string;
  specialty?: string;
  rating?: number;
  years?: number;
  image?: string;
  serviceId?: string;
};

export type ClinicDoctorsContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  book?: string;
  experience?: string;
  items?: ClinicDoctorContent[];
};

export type ClinicBranchContent = {
  id?: string;
  name?: string;
  address?: string;
  phone?: string;
  hours?: string;
  x?: number;
  y?: number;
  serviceIds?: string[];
};

export type ClinicLocationsContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  open?: string;
  hours?: string;
  directions?: string;
  book?: string;
  more?: string;
  offers?: string;
  items?: ClinicBranchContent[];
};

export type ClinicFooterContent = {
  about?: string;
  legal?: string;
  emergency?: string;
  hoursRows?: string[];
  rights?: string;
  privacy?: string;
  terms?: string;
  cookies?: string;
};

export type ClinicFaqContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: { question: string; answer: string }[];
};

export type ClinicPremiumContent = {
  /**
   * true  = demo site: every missing field falls back to the Lumera sample content.
   * false = real tenant: sample facts (numbers, prices, names, hours) are never shown; only what the JSON contains.
   */
  sample: boolean;
  /** Which sections exist in the JSON. Missing sections are not rendered. */
  present: {
    hero: boolean;
    services: boolean;
    checkup: boolean;
    about: boolean;
    doctors: boolean;
    locations: boolean;
    faq: boolean;
  };
  header?: { hours?: string; book?: string };
  contact?: { phone?: string; email?: string; address?: string; hours?: string };
  hero?: ClinicHeroContent;
  /** Services parsed from the JSON (empty when the section has no usable items). */
  serviceItems: SiteService[];
  servicesBlock?: SiteServicesBlock;
  checkup?: ClinicCheckupContent;
  about?: ClinicAboutContent;
  doctors?: ClinicDoctorsContent;
  locations?: ClinicLocationsContent;
  faq?: ClinicFaqContent;
  footer?: ClinicFooterContent;
};
