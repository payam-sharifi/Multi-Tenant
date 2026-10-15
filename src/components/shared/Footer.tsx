import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/paths';
import type { SiteConfig } from '@/lib/types/template';

export function Footer({
  data,
  dict,
  locale,
  inverted = false,
}: {
  data: SiteConfig;
  dict: Dictionary;
  locale: Locale;
  inverted?: boolean;
}) {
  const query = data.previewQuery || '';
  const legalLinks = [
    { href: `${localizedPath(`${data.basePath || ''}/impressum`, locale)}${query}`, label: dict.legal.impressum },
    { href: `${localizedPath(`${data.basePath || ''}/datenschutz`, locale)}${query}`, label: dict.legal.datenschutz },
  ];

  return (
    <footer
      className={`border-t px-6 py-8 text-sm ${
        inverted ? 'border-white/10 text-white/60' : 'border-black/10 text-neutral-500'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {data.branding.name}
        </p>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {legalLinks.map((link) => (
            <a key={link.href} href={link.href} className="underline-offset-2 hover:underline">
              {link.label}
            </a>
          ))}
        </nav>
        <p>{dict.footer.tagline}</p>
      </div>
    </footer>
  );
}

/** @deprecated Use `Footer`. */
export const SiteFooter = Footer;
