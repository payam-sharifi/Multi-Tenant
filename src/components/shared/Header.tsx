import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import type { SiteConfig } from '@/lib/types/template';
import LanguageSwitcher from '@/shared/LanguageSwitcher';
import type { NavLink } from '@/shared/types';

export function Header({
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

/** @deprecated Use `Header` — kept so existing templates keep compiling during the move. */
export const SiteHeader = Header;
