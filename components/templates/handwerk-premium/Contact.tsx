"use client";

import { FormEvent, useState } from "react";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { sectionIds } from "@/components/templates/handwerk-premium/data";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";

export function Contact() {
  const { t } = useHandwerk();
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section id={sectionIds.contact} className="hw-section scroll-mt-24 bg-[var(--hw-sand)]">
      <div className="hw-container grid gap-10 lg:grid-cols-2">
        <div>
          <p className="hw-eyebrow">{t.contact.eyebrow}</p>
          <h2 className="hw-heading mt-4">{t.contact.title}</h2>
          <dl className="mt-8 space-y-5 text-sm">
            {t.contact.phone && (
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[var(--hw-clay)]" />
                <div>
                  <dt className="uppercase tracking-[0.16em] text-[var(--hw-stone)]">{t.contact.phoneLabel}</dt>
                  <dd className="mt-1">
                    <a href={t.contact.phoneHref} className="text-[var(--hw-forest)]">
                      {t.contact.phone}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            {t.contact.email && (
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[var(--hw-clay)]" />
                <div>
                  <dt className="uppercase tracking-[0.16em] text-[var(--hw-stone)]">{t.contact.emailLabel}</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${t.contact.email}`} className="text-[var(--hw-forest)]">
                      {t.contact.email}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            {t.contact.coverage && (
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--hw-clay)]" />
                <div>
                  <dt className="uppercase tracking-[0.16em] text-[var(--hw-stone)]">{t.contact.coverageLabel}</dt>
                  <dd className="mt-1 text-[var(--hw-forest)]">{t.contact.coverage}</dd>
                </div>
              </div>
            )}
            {t.contact.hqAddress && (
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--hw-clay)]" />
                <div>
                  <dt className="uppercase tracking-[0.16em] text-[var(--hw-stone)]">{t.contact.hqLabel}</dt>
                  <dd className="mt-1 text-[var(--hw-forest)]">{t.contact.hqAddress}</dd>
                  {t.contact.googleMapsUrl && (
                    <a
                      href={t.contact.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--hw-clay-dark)]"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      {t.contact.directions}
                    </a>
                  )}
                </div>
              </div>
            )}
            {(t.contact.hoursRows.length > 0 || t.contact.hours) && (
              <div id={sectionIds.hours} className="flex gap-3 scroll-mt-24">
                <Clock className="mt-0.5 h-4 w-4 text-[var(--hw-clay)]" />
                <div>
                  <dt className="uppercase tracking-[0.16em] text-[var(--hw-stone)]">{t.contact.hoursLabel}</dt>
                  <dd className="mt-2 space-y-1 text-[var(--hw-forest)]">
                    {t.contact.hoursRows.length > 0
                      ? t.contact.hoursRows.map((row) => (
                          <p key={`${row.days}-${row.hours}`} className="flex justify-between gap-6">
                            <span>{row.days}</span>
                            <span className="tabular-nums">{row.hours}</span>
                          </p>
                        ))
                      : t.contact.hours}
                  </dd>
                </div>
              </div>
            )}
          </dl>
          {t.contact.locations.length > 0 && (
            <ul className="mt-8 space-y-3 text-sm text-[var(--hw-forest)]">
              {t.contact.locations.map((location) => (
                <li key={location.name}>
                  <strong>{location.name}</strong>
                  <br />
                  {location.address}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-5">
          {t.contact.mapEmbed && (
            <div className="overflow-hidden rounded-2xl border border-[var(--hw-forest)]/10 bg-white shadow-[0_18px_40px_-24px_rgba(21,36,28,0.4)]">
              <p className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--hw-stone)]">
                {t.contact.mapLabel}
              </p>
              <iframe
                title={t.contact.mapLabel}
                src={t.contact.mapEmbed}
                className="h-64 w-full border-0 lg:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          <form onSubmit={onSubmit} className="rounded-2xl bg-[var(--hw-cream)] p-6 shadow-[0_18px_40px_-24px_rgba(21,36,28,0.4)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="firstName" placeholder={t.contact.firstName} className="hw-input" />
              <input required name="lastName" placeholder={t.contact.lastName} className="hw-input" />
            </div>
            <input required type="email" name="email" placeholder={t.contact.emailPlaceholder} className="hw-input mt-4" />
            <input required name="phone" placeholder={t.contact.phonePlaceholder} className="hw-input mt-4" />
            <textarea name="message" rows={4} placeholder={t.contact.message} className="hw-input mt-4 resize-none" />
            <p className="mt-3 text-xs text-[var(--hw-stone)]">{t.contact.formNote}</p>
            <button type="submit" className="hw-btn hw-btn-clay mt-5 h-12 w-full">
              {t.contact.submit}
            </button>
            {sent && <p className="mt-3 text-sm text-[var(--hw-forest)]">{t.contact.success}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
