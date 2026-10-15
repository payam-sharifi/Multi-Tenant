'use client';

import { Award, Clock3, Scale } from 'lucide-react';
import { useHaustechnik } from '@/templates/haustechnik-base/context';

const icons = [Scale, Award, Clock3];

export function Trust() {
  const { content } = useHaustechnik();
  return (
    <section id="ueber-uns" className="mh-section scroll-mt-28 bg-white">
      <div className="mh-container">
        <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--mh-accent)] uppercase">{content.aboutEyebrow}</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--mh-navy)] sm:text-4xl">
              {content.aboutTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--mh-muted)]">{content.aboutText}</p>
          </div>
          <GoogleReviewsBadge />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {content.benefits.map((benefit, index) => {
            const Icon = icons[index] ?? Award;
            return (
              <article
                key={benefit.title}
                className="rounded-3xl border border-[var(--mh-line)] bg-[var(--mh-bg)] p-6 sm:p-7"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[var(--mh-navy)] shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--mh-navy)]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--mh-muted)]">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GoogleReviewsBadge() {
  const { content } = useHaustechnik();
  const reviews = content.reviews;
  return (
    <aside
      className="rounded-3xl border border-[var(--mh-line)] bg-[var(--mh-navy)] p-6 text-white shadow-[0_20px_50px_-24px_rgba(11,37,69,0.55)]"
      aria-label={`${reviews.rating} von 5 Sternen aus ${reviews.count} Google-Bewertungen`}
    >
      <div className="flex items-center gap-3">
        <GoogleMark />
        <div>
          <p className="text-sm font-semibold">Google</p>
          <p className="text-xs text-white/70">{reviews.source}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <p className="text-4xl leading-none font-extrabold">{reviews.rating}</p>
        <Stars />
      </div>
      <p className="mt-2 text-sm text-white/80">aus {reviews.count} Bewertungen</p>
    </aside>
  );
}

function Stars() {
  return (
    <div className="mb-1 flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 20 20" className="h-5 w-5 fill-amber-400">
          <path d="M10 1.5 12.7 7l6 .5-4.6 4 1.4 5.8L10 14.8 4.5 17.3l1.4-5.8L1.3 7.5l6-.5L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <span className="grid h-11 w-11 place-items-center rounded-full bg-white" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.2 2.8-2.5 3.6v3h4c2.4-2.2 3.5-5.4 3.5-8.7Z" />
        <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-4-3c-1.1.8-2.5 1.2-3.9 1.2-3 0-5.6-2-6.5-4.8H1.4v3.1C3.4 21.4 7.4 24 12 24Z" />
        <path fill="#FBBC05" d="M5.5 14.5c-.2-.7-.4-1.4-.4-2.1s.1-1.5.4-2.1V7.2H1.4C.5 8.9 0 10.4 0 12.4s.5 3.5 1.4 5.2l4.1-3.1Z" />
        <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.4l4.1 3.1C6.4 6.7 9 4.8 12 4.8Z" />
      </svg>
    </span>
  );
}
