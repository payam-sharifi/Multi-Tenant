import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';

const OPTIONS: { locale: Locale; href: string; label: string }[] = [
  { locale: 'de', href: '/', label: 'DE' },
  { locale: 'en', href: '/en', label: 'EN' },
];

export default function LanguageSwitcher({
  locale,
  dict,
  inverted = false,
}: {
  locale: Locale;
  dict: Dictionary;
  inverted?: boolean;
}) {
  return (
    <nav
      aria-label={dict.language.label}
      className={`inline-flex rounded-full border p-0.5 text-xs font-bold ${
        inverted ? 'border-white/20' : 'border-[color:color-mix(in_srgb,var(--brand-primary)_22%,transparent)]'
      }`}
    >
      {OPTIONS.map((option) => {
        const active = option.locale === locale;
        return (
          <a
            key={option.locale}
            href={option.href}
            hrefLang={option.locale}
            className={`rounded-full px-2.5 py-1 transition ${
              active
                ? 'bg-[var(--brand-primary)] text-white'
                : inverted
                  ? 'text-white/70 hover:text-white'
                  : 'text-current/60 hover:text-current'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            {option.label}
          </a>
        );
      })}
    </nav>
  );
}
