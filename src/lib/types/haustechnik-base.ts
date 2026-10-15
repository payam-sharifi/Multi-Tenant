export type HaustechnikService = {
  id: string;
  title: string;
  description: string;
  points: string[];
  featured?: boolean;
};

export type HaustechnikBenefit = {
  title: string;
  description: string;
};

export type HaustechnikContent = {
  sample: boolean;
  tagline: string;
  legalName: string;
  emergencyHours: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  highlights: string[];
  servicesEyebrow: string;
  servicesTitle: string;
  servicesSubtitle: string;
  services: HaustechnikService[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  benefits: HaustechnikBenefit[];
  reviews: {
    rating: string;
    count: string;
    source: string;
  };
  contactEyebrow: string;
  contactTitle: string;
  contactText: string;
  footerAbout: string;
};
