"use client";

import { Star } from "lucide-react";
import { sectionIds } from "@/components/templates/handwerk-premium/data";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Reviews() {
  const { t } = useHandwerk();
  const rating = Number.parseFloat(t.reviews.rating.replace(",", ".")) || 5;

  return (
    <section id={sectionIds.reviews} className="hw-section scroll-mt-24 bg-[var(--hw-cream)]">
      <div className="hw-container">
        <p className="hw-eyebrow">{t.reviews.eyebrow}</p>
        <h2 className="hw-heading mt-4">{t.reviews.title}</h2>
        {t.reviews.subtitle && <p className="mt-4 max-w-2xl text-[var(--hw-stone)]">{t.reviews.subtitle}</p>}

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--hw-forest)]/10 bg-white px-5 py-4">
          <GoogleMark className="h-8 w-8" />
          <div>
            <p className="font-display text-3xl text-[var(--hw-forest)]">{t.reviews.rating}</p>
            <div className="mt-1 flex gap-0.5 text-[#F4B400]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className={`h-4 w-4 ${index < Math.round(rating) ? "fill-current" : "opacity-30"}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-[var(--hw-stone)]">
            {[t.reviews.count, t.reviews.location].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.reviews.items.map((item) => (
            <figure key={`${item.name}-${item.date}`} className="rounded-2xl border border-[var(--hw-forest)]/10 bg-white p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--hw-sand)] text-xs font-semibold text-[var(--hw-forest)]">
                  {initials(item.name)}
                </span>
                <div className="min-w-0">
                  <figcaption className="text-sm font-semibold text-[var(--hw-forest)]">{item.name}</figcaption>
                  <p className="text-xs text-[var(--hw-stone)]">
                    {[item.city, item.date].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <GoogleMark className="ml-auto h-4 w-4 shrink-0" />
              </div>
              <div className="mt-3 flex gap-0.5 text-[#F4B400]">
                {Array.from({ length: item.rating || 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-[var(--hw-forest)]">“{item.text}”</blockquote>
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[var(--hw-stone)]">{item.source}</p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
