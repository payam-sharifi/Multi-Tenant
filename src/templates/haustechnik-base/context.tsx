'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/paths';
import type { HaustechnikContent } from '@/lib/types/haustechnik-base';
import type { SiteConfig } from '@/lib/types/template';

export type HaustechnikView = {
  name: string;
  legalName: string;
  tagline: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  addressLines: string[];
  hours: string;
  emergencyHours: string;
  nav: { href: string; label: string }[];
  serviceOptions: string[];
  impressumHref: string;
  datenschutzHref: string;
  homeHref: string;
  content: HaustechnikContent;
};

const HaustechnikContext = createContext<HaustechnikView | null>(null);

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '#kontakt';
}

function addressLines(address: string) {
  return address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function HaustechnikProvider({
  data,
  locale,
  content,
  children,
}: {
  data: SiteConfig;
  locale: Locale;
  content: HaustechnikContent;
  children: ReactNode;
}) {
  const query = data.previewQuery || '';
  const base = data.basePath || '';
  const value: HaustechnikView = {
    name: data.branding.name,
    legalName: content.legalName,
    tagline: content.tagline,
    phoneDisplay: data.branding.phone,
    phoneHref: phoneHref(data.branding.phone),
    email: data.branding.email,
    addressLines: addressLines(data.branding.address),
    hours: data.contact.workingHours,
    emergencyHours: content.emergencyHours,
    nav: [
      { href: '#leistungen', label: 'Leistungen' },
      { href: '#ueber-uns', label: 'Über uns' },
      { href: '#notdienst', label: 'Notdienst' },
      { href: '#kontakt', label: 'Kontakt' },
    ],
    serviceOptions: [
      ...content.services.map((item) => item.title),
      'Wartung / Inspektion',
      'Sonstiges',
    ],
    impressumHref: `${localizedPath(`${base}/impressum`, locale)}${query}`,
    datenschutzHref: `${localizedPath(`${base}/datenschutz`, locale)}${query}`,
    homeHref: `${localizedPath(base || '/', locale)}${query}`,
    content,
  };

  return <HaustechnikContext.Provider value={value}>{children}</HaustechnikContext.Provider>;
}

export function useHaustechnik() {
  const value = useContext(HaustechnikContext);
  if (!value) throw new Error('useHaustechnik must be used inside HaustechnikProvider');
  return value;
}
