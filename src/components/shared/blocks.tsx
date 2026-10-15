import type { ReactNode } from 'react';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { SiteConfig } from '@/lib/types/template';

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-3 inline-flex rounded-full border border-[color:color-mix(in_srgb,var(--brand-primary)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--brand-primary)_10%,white)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[var(--brand-primary)]">
      {children}
    </span>
  );
}

export function ContactBlock({
  data,
  dict,
  className = '',
}: {
  data: SiteConfig;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <div className={className} id="contact">
      <h2 className="mb-4 text-2xl font-extrabold">{dict.contact.title}</h2>
      <p className="mb-4 text-lg font-semibold text-[var(--brand-primary)]">{data.branding.name}</p>
      <div className="space-y-2 text-sm opacity-80">
        <p>
          {dict.contact.owner}: {data.owner || dict.contact.ownerFallback}
        </p>
        <p>
          {dict.contact.phone}:{' '}
          <a href={`tel:${data.branding.phone}`} className="underline-offset-2 hover:underline">
            {data.branding.phone}
          </a>
        </p>
        <p>
          {dict.contact.email}:{' '}
          <a href={`mailto:${data.branding.email}`} className="underline-offset-2 hover:underline">
            {data.branding.email}
          </a>
        </p>
        <p>
          {dict.contact.address}: {data.branding.address}
        </p>
        {data.contact.mapUrl ? (
          <p>
            <a
              href={data.contact.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--brand-primary)]"
            >
              Google Maps
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function HoursBlock({
  data,
  dict,
  className = '',
}: {
  data: SiteConfig;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <div className={className} id="hours">
      <h2 className="mb-4 text-2xl font-extrabold">{dict.hours.title}</h2>
      <p className="text-xl font-bold text-[var(--brand-primary)]">{data.contact.workingHours}</p>
    </div>
  );
}

export function FaqList({ data, dict }: { data: SiteConfig; dict: Dictionary }) {
  if (!data.faq.length) return null;

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-16">
      <div className="mb-10 text-center">
        <SectionEyebrow>{dict.faq.eyebrow}</SectionEyebrow>
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{dict.faq.title}</h2>
      </div>
      <div className="space-y-3">
        {data.faq.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            className="rounded-2xl border border-black/10 bg-white px-5 py-2 open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm">
                +
              </span>
            </summary>
            {faq.answer ? <p className="pb-4 text-sm leading-relaxed opacity-70">{faq.answer}</p> : null}
          </details>
        ))}
      </div>
    </section>
  );
}

export function cssImage(url?: string) {
  if (!url) return undefined;
  return `url('${url.replace(/'/g, '%27')}')`;
}
