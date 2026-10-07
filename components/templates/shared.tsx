import type { CSSProperties, ReactNode } from 'react';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import type { SiteConfig } from '@/lib/types/template';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export type TemplateProps = {
  data: SiteConfig;
  dict: Dictionary;
  locale: Locale;
};

export type NavLink = { href: string; label: string };

export function BrandScope({
  data,
  className,
  children,
}: {
  data: SiteConfig;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-template={data.businessType}
      className={className}
      style={
        {
          '--brand-primary': data.branding.primaryColor,
          '--brand-secondary': data.branding.secondaryColor,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function SiteHeader({
  data,
  dict,
  locale,
  links,
  cta,
  inverted = false,
}: {
  data: SiteConfig;
  dict: Dictionary;
  locale: Locale;
  links: NavLink[];
  cta: NavLink;
  inverted?: boolean;
}) {
  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        inverted
          ? 'border-white/10 bg-black/70 text-white'
          : 'border-black/10 bg-white/85 text-neutral-900'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          {data.branding.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.branding.logo}
              alt=""
              className="h-8 w-auto max-w-[140px] object-contain"
            />
          ) : null}
          <span className="truncate text-lg font-black tracking-tight sm:text-xl">
            {data.branding.name}
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:opacity-70">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} dict={dict} inverted={inverted} />
          <a
            href={cta.href}
            className="shrink-0 rounded-full bg-[var(--brand-primary)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 sm:px-4 sm:text-sm"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({
  data,
  dict,
  inverted = false,
}: {
  data: SiteConfig;
  dict: Dictionary;
  inverted?: boolean;
}) {
  return (
    <footer
      className={`border-t px-6 py-8 text-sm ${
        inverted ? 'border-white/10 text-white/60' : 'border-black/10 text-neutral-500'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} {data.branding.name}
        </p>
        <p>{dict.footer.tagline}</p>
      </div>
    </footer>
  );
}

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
