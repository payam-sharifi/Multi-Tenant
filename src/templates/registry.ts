import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { TemplateProps } from '@/shared';
import type { SiteConfig } from '@/lib/types/template';
import { TemplateFallback } from '@/templates/TemplateFallback';

/**
 * Registered template folders under `src/templates/<id>/`.
 * To add a new template:
 *  1. Create `src/templates/<id>/index.tsx` with a default export that accepts `TemplateProps`.
 *  2. Add `<id>` to `TEMPLATE_IDS` and `TEMPLATE_LOADERS` below.
 *  3. Optionally map JSON aliases in `TEMPLATE_ALIASES`.
 */
export const TEMPLATE_IDS = [
  'clinic-base',
  'handwerk-base',
  'haustechnik-base',
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const DEFAULT_TEMPLATE_ID: TemplateId = 'handwerk-base';

const TEMPLATE_ALIASES: Record<string, TemplateId> = {
  'clinic-base': 'clinic-base',
  clinic_base: 'clinic-base',
  clinicbase: 'clinic-base',
  'clinic-premium': 'clinic-base',
  clinic_premium: 'clinic-base',
  clinicpremium: 'clinic-base',
  lumera: 'clinic-base',
  praxis: 'clinic-base',
  'praxis-base': 'clinic-base',
  'praxis-premium': 'clinic-base',
  praxisbase: 'clinic-base',
  medical: 'clinic-base',
  'handwerk-base': 'handwerk-base',
  handwerk_base: 'handwerk-base',
  handwerkbase: 'handwerk-base',
  'handwerk-premium': 'handwerk-base',
  handwerk_premium: 'handwerk-base',
  handwerkpremium: 'handwerk-base',
  'renovation-base': 'handwerk-base',
  'renovation-premium': 'handwerk-base',
  renovationbase: 'handwerk-base',
  'sanierung-base': 'handwerk-base',
  'sanierung-premium': 'handwerk-base',
  velora: 'handwerk-base',
  handwerker: 'handwerk-base',
  'handwerker-base': 'handwerk-base',
  'handwerker-premium': 'handwerk-base',
  services: 'handwerk-base',
  'haustechnik-base': 'haustechnik-base',
  haustechnik_base: 'haustechnik-base',
  haustechnikbase: 'haustechnik-base',
  'haustechnik-premium': 'haustechnik-base',
  haustechnik_premium: 'haustechnik-base',
  haustechnikpremium: 'haustechnik-base',
  haustechnik: 'haustechnik-base',
  'mueller-haustechnik': 'haustechnik-base',
  mueller: 'haustechnik-base',
  müller: 'haustechnik-base',
  klempner: 'haustechnik-base',
  heizung: 'haustechnik-base',
  sanitär: 'haustechnik-base',
  sanitaer: 'haustechnik-base',
};

function normalizeKey(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/[_]+/g, '-').replace(/\s+/g, '');
}

export function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value);
}

/**
 * Pick a registered template from site JSON.
 * Order: explicit `templateId` → `businessCategory` → `businessType` → default.
 */
export function matchTemplateId(
  data: Pick<SiteConfig, 'templateId' | 'businessCategory' | 'businessType'>,
): TemplateId | null {
  for (const candidate of [data.templateId, data.businessCategory, data.businessType]) {
    const mapped = TEMPLATE_ALIASES[normalizeKey(candidate)];
    if (mapped) return mapped;
  }
  return null;
}

export function resolveTemplateId(
  data: Pick<SiteConfig, 'templateId' | 'businessCategory' | 'businessType'>,
): TemplateId {
  return matchTemplateId(data) ?? DEFAULT_TEMPLATE_ID;
}

const TEMPLATE_LOADERS: Record<TemplateId, () => Promise<{ default: ComponentType<TemplateProps> }>> = {
  'clinic-base': () => import('@/templates/clinic-base'),
  'handwerk-base': () => import('@/templates/handwerk-base'),
  'haustechnik-base': () => import('@/templates/haustechnik-base'),
};

export const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<TemplateProps>> = {
  'clinic-base': dynamic(TEMPLATE_LOADERS['clinic-base'], { ssr: true, loading: TemplateFallback }),
  'handwerk-base': dynamic(TEMPLATE_LOADERS['handwerk-base'], { ssr: true, loading: TemplateFallback }),
  'haustechnik-base': dynamic(TEMPLATE_LOADERS['haustechnik-base'], {
    ssr: true,
    loading: TemplateFallback,
  }),
};
