"use client";

import { Clock, Mail, MapPin, Phone, Siren } from "lucide-react";
import { sectionIds } from "@/components/templates/clinic-premium/data";
import { useI18n } from "@/components/templates/clinic-premium/i18n";
import { Logo } from "./ui/Logo";
import { Reveal } from "./ui/Reveal";

export function Footer() {
  const { t, brandName } = useI18n();
  const f = t.footer;
  const branches = t.locations.items;
  const links = [
    { id: sectionIds.services, label: t.nav.services, on: t.sections.services },
    { id: sectionIds.checkup, label: t.nav.checkup, on: t.sections.checkup },
    { id: sectionIds.about, label: t.nav.about, on: t.sections.about },
    { id: sectionIds.doctors, label: t.nav.doctors, on: t.sections.doctors },
    { id: sectionIds.locations, label: t.nav.locations, on: t.sections.locations },
    { id: sectionIds.faq, label: t.nav.faq, on: t.sections.faq },
  ].filter((l) => l.on);
  const showAddresses = branches.length > 0 || Boolean(t.contact.address);
  const showContacts = Boolean(t.contact.phone || t.contact.email || f.hoursRows.length > 0);
  const columns = [true, links.length > 0, showContacts, showAddresses].filter(Boolean).length;
  const gridCols = ["", "", "lg:grid-cols-2", "lg:grid-cols-[1.3fr_0.7fr_1fr]", "lg:grid-cols-[1.3fr_0.7fr_1fr_1.8fr]"][columns];

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-mint/10 blur-[100px]" />
      <div className="container-x relative pb-8 pt-16 sm:pt-20">
        <Reveal className={`grid gap-12 sm:grid-cols-2 ${gridCols}`}>
          <div>
            <Logo light />
            {f.about && <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">{f.about}</p>}
            {f.emergency && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-mint">
                <Siren className="h-3.5 w-3.5" />
                {f.emergency}
              </p>
            )}
          </div>

          {links.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">{f.links}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-white/60 transition-colors hover:text-mint">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          )}

          {showContacts && (
          <div>
            {(t.contact.phone || t.contact.email) && (
              <>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">{f.contacts}</h3>
                <ul className="mt-5 space-y-3 text-sm text-white/60">
                  {t.contact.phone && (
                    <li>
                      <a href={t.contact.phoneHref} className="flex items-center gap-3 transition-colors hover:text-mint">
                        <Phone className="h-4 w-4 text-mint" />
                        {t.contact.phone}
                      </a>
                    </li>
                  )}
                  {t.contact.email && (
                    <li>
                      <a href={`mailto:${t.contact.email}`} className="flex items-center gap-3 transition-colors hover:text-mint">
                        <Mail className="h-4 w-4 text-mint" />
                        {t.contact.email}
                      </a>
                    </li>
                  )}
                </ul>
              </>
            )}

            {f.hoursRows.length > 0 && (
              <>
                <h3 className={`${t.contact.phone || t.contact.email ? "mt-8" : ""} text-sm font-bold uppercase tracking-wider text-white`}>
                  {f.hours}
                </h3>
                <ul className="mt-5 space-y-2 text-sm text-white/60">
                  {f.hoursRows.map((r) => (
                    <li key={r} className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-mint" />
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          )}

          {showAddresses && (
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">{f.addresses}</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {branches.length === 0 && t.contact.address && (
                <li className="flex items-start gap-3 text-white/60">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                  <span>{t.contact.address}</span>
                </li>
              )}
              {branches.map((b) => (
                <li key={b.id}>
                  <a
                    href={`#${sectionIds.locations}`}
                    className="group flex items-start gap-3 text-white/60 transition-colors hover:text-white"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                    <span>
                      <span className="block font-semibold text-white/90 group-hover:text-mint">{b.name}</span>
                      {b.address && <span className="block text-xs">{b.address.split(",")[0]}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          )}
        </Reveal>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-white/40">{f.legal}</p>
          <div className="mt-6 flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {brandName}. {f.rights}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href="#" className="transition-colors hover:text-mint">{f.privacy}</a>
              <a href="#" className="transition-colors hover:text-mint">{f.terms}</a>
              <a href="#" className="transition-colors hover:text-mint">{f.cookies}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
