"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";
import { useQuote } from "@/templates/handwerk-base/quote";

export function Services() {
  const { t } = useHandwerk();
  const { open } = useQuote();
  return (
    <section id={sectionIds.services} className="hw-section scroll-mt-24 bg-[var(--hw-cream)]">
      <div className="hw-container">
        <p className="hw-eyebrow">{t.services.eyebrow}</p>
        <h2 className="hw-heading mt-4">{t.services.title}</h2>
        {t.services.subtitle && <p className="mt-4 max-w-2xl text-[var(--hw-stone)]">{t.services.subtitle}</p>}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {t.services.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={open}
              className="group relative min-h-[280px] overflow-hidden rounded-2xl text-left"
            >
              {item.image && (
                <Image src={item.image} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--hw-forest-deep)] via-[var(--hw-forest-deep)]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-[var(--hw-cream)]">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-3xl">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--hw-cream)]/80">{item.description}</p>
                  </div>
                  <ArrowUpRight className="mb-1 h-6 w-6 shrink-0 text-[var(--hw-clay)]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
