'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { useHaustechnik } from '@/templates/haustechnik-base/context';

export function InquiryForm() {
  const { phoneDisplay, phoneHref, email, addressLines, emergencyHours, serviceOptions, datenschutzHref, content } =
    useHaustechnik();
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section id="kontakt" className="mh-section scroll-mt-28 bg-[var(--mh-bg)]">
      <div className="mh-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--mh-accent)] uppercase">{content.contactEyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--mh-navy)] sm:text-4xl">
            {content.contactTitle}
          </h2>
          <p className="mt-4 max-w-md text-[var(--mh-muted)]">{content.contactText}</p>

          <dl className="mt-8 space-y-4 text-sm">
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-[var(--mh-accent)]" aria-hidden />
              <div>
                <dt className="font-semibold text-[var(--mh-navy)]">Telefon</dt>
                <dd>
                  <a className="text-[var(--mh-muted)] hover:text-[var(--mh-navy)]" href={phoneHref}>
                    {phoneDisplay}
                  </a>
                  <p className="text-xs text-[var(--mh-muted)]">{emergencyHours}</p>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-[var(--mh-accent)]" aria-hidden />
              <div>
                <dt className="font-semibold text-[var(--mh-navy)]">E-Mail</dt>
                <dd>
                  <a className="text-[var(--mh-muted)] hover:text-[var(--mh-navy)]" href={`mailto:${email}`}>
                    {email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[var(--mh-accent)]" aria-hidden />
              <div>
                <dt className="font-semibold text-[var(--mh-navy)]">Adresse</dt>
                <dd className="text-[var(--mh-muted)]">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-[var(--mh-line)] bg-white p-6 shadow-[0_20px_50px_-28px_rgba(11,37,69,0.45)] sm:p-8">
          {sent ? (
            <div className="flex min-h-[320px] flex-col items-start justify-center" role="status">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden />
              <h3 className="mt-4 text-2xl font-bold text-[var(--mh-navy)]">Anfrage erhalten</h3>
              <p className="mt-2 max-w-md text-[var(--mh-muted)]">
                Vielen Dank. Wir haben Ihre Nachricht erhalten und melden uns in Kürze bei Ihnen. Bei einem akuten
                Schaden rufen Sie uns bitte direkt unter {phoneDisplay} an.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="grid gap-4">
                <Field id="name" label="Name" autoComplete="name" required />
                <Field id="email" label="E-Mail" type="email" autoComplete="email" required />
                <Field id="phone" label="Telefonnummer" type="tel" autoComplete="tel" required />
                <div>
                  <label htmlFor="service" className="mb-1.5 block text-sm font-semibold text-[var(--mh-navy)]">
                    Leistung auswählen
                  </label>
                  <select id="service" name="service" required defaultValue="" className="mh-input">
                    <option value="" disabled>
                      Bitte wählen
                    </option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-[var(--mh-navy)]">
                    Nachricht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mh-input resize-none"
                    placeholder="Wobei dürfen wir Sie unterstützen?"
                  />
                </div>
                <label className="flex items-start gap-3 text-sm text-[var(--mh-muted)]">
                  <input
                    type="checkbox"
                    name="privacy"
                    required
                    className="mt-1 h-4 w-4 rounded border-[var(--mh-line)] text-[var(--mh-accent)] focus:ring-[var(--mh-accent)]"
                  />
                  <span>
                    Ich habe die{' '}
                    <a
                      href={datenschutzHref}
                      className="font-semibold text-[var(--mh-navy)] underline underline-offset-2"
                    >
                      Datenschutzerklärung
                    </a>{' '}
                    gelesen und willige in die Verarbeitung meiner Angaben zur Bearbeitung der Anfrage ein.
                  </span>
                </label>
                <button type="submit" className="mh-btn mh-btn-accent mt-2 h-12 w-full text-base">
                  Anfrage absenden
                </button>
                <p className="text-xs text-[var(--mh-muted)]">
                  Pflichtfelder. Dies ist eine Demo-Seite – es wird keine Nachricht versendet.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type = 'text',
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[var(--mh-navy)]">
        {label}
      </label>
      <input id={id} name={id} type={type} autoComplete={autoComplete} required={required} className="mh-input" />
    </div>
  );
}
