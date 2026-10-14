"use client";

import Image from "next/image";
import { sectionIds } from "@/components/templates/handwerk-premium/data";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";

export function Projects() {
  const { t } = useHandwerk();
  return (
    <section id={sectionIds.projects} className="hw-section scroll-mt-24 bg-[var(--hw-sand)]">
      <div className="hw-container">
        <p className="hw-eyebrow">{t.projects.eyebrow}</p>
        <h2 className="hw-heading mt-4">{t.projects.title}</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {t.projects.items.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-2xl bg-[var(--hw-cream)] shadow-[0_18px_40px_-24px_rgba(21,36,28,0.45)]">
              <div className="relative aspect-[4/3]">
                {item.image && <Image src={item.image} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />}
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl text-[var(--hw-forest)]">{item.title}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.12em] text-[var(--hw-stone)]">
                  {item.area && (
                    <div>
                      <dt>{t.projects.area}</dt>
                      <dd className="mt-1 text-sm tracking-normal text-[var(--hw-forest)]">{item.area}</dd>
                    </div>
                  )}
                  {item.duration && (
                    <div>
                      <dt>{t.projects.duration}</dt>
                      <dd className="mt-1 text-sm tracking-normal text-[var(--hw-forest)]">{item.duration}</dd>
                    </div>
                  )}
                  {item.kind && (
                    <div className="col-span-2">
                      <dt>{t.projects.kind}</dt>
                      <dd className="mt-1 text-sm tracking-normal text-[var(--hw-forest)]">{item.kind}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
