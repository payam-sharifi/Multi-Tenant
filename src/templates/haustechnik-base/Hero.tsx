'use client';

import { CalendarCheck, CheckCircle2, Phone } from 'lucide-react';
import { useHaustechnik } from '@/templates/haustechnik-base/context';

export function Hero() {
  const { phoneHref, phoneDisplay, content } = useHaustechnik();
  return (
    <section className="relative overflow-hidden bg-[var(--mh-navy)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-[var(--mh-navy-mid)] blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[var(--mh-accent)]/20 blur-3xl" />
      </div>

      <div className="mh-container relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            {content.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{content.heroSubtitle}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {content.highlights.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/90"
              >
                <CheckCircle2 className="h-4 w-4 text-orange-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#kontakt" className="mh-btn mh-btn-accent h-12 px-6 text-base">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Jetzt Termin anfragen
            </a>
            <a href={phoneHref} className="mh-btn mh-btn-ghost h-12 px-6 text-base">
              <Phone className="h-4 w-4" aria-hidden />
              Notdienst kontaktieren
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--mh-navy-mid)] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--mh-accent)]/80" />
              <span className="ml-3 text-xs font-medium tracking-wide text-white/50">Einsatz vor Ort</span>
            </div>
            <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-600 via-[var(--mh-navy-mid)] to-[var(--mh-navy-deep)]">
              <svg viewBox="0 0 640 480" className="h-full w-full" aria-hidden>
                <rect width="640" height="480" fill="#163a66" />
                <rect x="40" y="70" width="260" height="340" rx="18" fill="#0b2545" opacity="0.55" />
                <rect x="340" y="110" width="260" height="260" rx="130" fill="#ea580c" opacity="0.18" />
                <g stroke="#f8fafc" strokeWidth="8" fill="none" strokeLinecap="round">
                  <path d="M90 360c40-90 90-140 150-160" opacity="0.35" />
                  <path d="M380 180h90v90" opacity="0.4" />
                  <circle cx="470" cy="270" r="38" opacity="0.45" />
                </g>
                <g fill="#e2e8f0" opacity="0.9">
                  <circle cx="220" cy="168" r="28" />
                  <rect x="188" y="204" width="64" height="110" rx="32" />
                  <rect x="168" y="314" width="104" height="18" rx="9" />
                </g>
                <rect x="86" y="248" width="78" height="12" rx="6" fill="#F97316" />
                <rect x="86" y="272" width="118" height="10" rx="5" fill="#94a3b8" />
                <rect x="86" y="292" width="96" height="10" rx="5" fill="#94a3b8" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--mh-navy)]/70 via-transparent to-transparent" />
              <p className="absolute right-5 bottom-5 left-5 text-sm font-medium text-white/90">
                Fachgerechte Installation, Wartung und Störungsbehebung – aus einer Hand.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 left-4 rounded-2xl border border-[var(--mh-line)] bg-white px-4 py-3 text-[var(--mh-navy)] shadow-xl sm:left-6">
            <p className="text-xs font-semibold tracking-wider text-[var(--mh-muted)] uppercase">Reaktionszeit</p>
            <p className="text-lg font-extrabold">oft unter 60 Min.</p>
          </div>
          <div className="absolute -right-2 top-16 hidden rounded-2xl border border-white/10 bg-[var(--mh-navy-deep)] px-4 py-3 text-white shadow-xl sm:block">
            <p className="text-xs font-semibold tracking-wider text-orange-300 uppercase">Notdienst</p>
            <p className="font-bold">{phoneDisplay}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
