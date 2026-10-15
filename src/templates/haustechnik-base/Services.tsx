'use client';

import { ArrowRight, Bath, Droplets, Flame, Siren, Wrench } from 'lucide-react';
import { useHaustechnik } from '@/templates/haustechnik-base/context';

const icons: Record<string, typeof Flame> = {
  heizung: Flame,
  bad: Bath,
  sanitaer: Droplets,
  notdienst: Siren,
};

export function Services() {
  const { phoneHref, content } = useHaustechnik();
  return (
    <section id="leistungen" className="mh-section scroll-mt-28 bg-[var(--mh-bg)]">
      <div className="mh-container">
        <p className="text-xs font-bold tracking-[0.2em] text-[var(--mh-accent)] uppercase">{content.servicesEyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-[var(--mh-navy)] sm:text-4xl">
          {content.servicesTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--mh-muted)]">{content.servicesSubtitle}</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {content.services.map((service) => {
            const Icon = icons[service.id] ?? Wrench;
            const featured = Boolean(service.featured);
            return (
              <article
                key={service.id}
                id={featured ? 'notdienst' : undefined}
                className={`flex flex-col rounded-3xl border p-6 shadow-[0_16px_40px_-28px_rgba(11,37,69,0.45)] sm:p-8 ${
                  featured
                    ? 'scroll-mt-28 border-[var(--mh-accent)]/40 bg-[var(--mh-navy)] text-white'
                    : 'border-[var(--mh-line)] bg-white text-[var(--mh-navy)]'
                }`}
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${
                    featured ? 'bg-[var(--mh-accent)] text-white' : 'bg-orange-50 text-[var(--mh-accent)]'
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-2xl font-bold tracking-tight">{service.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${featured ? 'text-white/80' : 'text-[var(--mh-muted)]'}`}>
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span
                        className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${featured ? 'bg-orange-300' : 'bg-[var(--mh-accent)]'}`}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  href={featured ? phoneHref : '#kontakt'}
                  className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${
                    featured
                      ? 'text-orange-300 hover:text-white'
                      : 'text-[var(--mh-accent)] hover:text-[var(--mh-accent-hover)]'
                  }`}
                >
                  {featured ? 'Jetzt Notdienst anrufen' : 'Leistung anfragen'}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
