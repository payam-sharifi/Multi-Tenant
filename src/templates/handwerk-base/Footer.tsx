"use client";

import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";
import { Logo } from "@/templates/handwerk-base/Logo";

export function Footer() {
  const { t } = useHandwerk();
  return (
    <footer className="bg-[var(--hw-forest-deep)] py-16 text-[var(--hw-cream)]">
      <div className="hw-container grid gap-10 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo light />
          {t.footer.about && <p className="mt-5 max-w-md text-sm text-[var(--hw-cream)]/70">{t.footer.about}</p>}
          {t.contact.phone && (
            <p className="mt-4 text-sm">
              <a href={t.contact.phoneHref}>{t.contact.phone}</a>
            </p>
          )}
          {t.contact.email && (
            <p className="text-sm">
              <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
            </p>
          )}
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hw-clay)]">{t.footer.quick}</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--hw-cream)]/80">
            {t.sections.services && <li><a href={`#${sectionIds.services}`}>{t.nav.services}</a></li>}
            {t.sections.projects && <li><a href={`#${sectionIds.projects}`}>{t.nav.projects}</a></li>}
            {t.sections.team && <li><a href={`#${sectionIds.team}`}>{t.nav.team}</a></li>}
            {t.sections.contact && <li><a href={`#${sectionIds.contact}`}>{t.nav.contact}</a></li>}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hw-clay)]">{t.footer.legal}</h2>
          <p className="mt-4 text-sm text-[var(--hw-cream)]/80">{t.footer.company}</p>
          {t.footer.represented && <p className="mt-2 text-sm text-[var(--hw-cream)]/60">{t.footer.represented}</p>}
          {t.contact.hoursRows.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--hw-clay)]">{t.footer.hours}</p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--hw-cream)]/70">
                {t.contact.hoursRows.map((row) => (
                  <li key={`${row.days}-${row.hours}`}>
                    {[row.days, row.hours].filter(Boolean).join(" — ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <p className="hw-container mt-12 border-t border-white/10 pt-6 text-xs text-[var(--hw-cream)]/50">{t.footer.rights}</p>
    </footer>
  );
}
