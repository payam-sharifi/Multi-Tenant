"use client";

import Image from "next/image";
import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";

export function BeforeAfter() {
  const { t } = useHandwerk();
  return (
    <section id={sectionIds.beforeAfter} className="hw-section scroll-mt-24 bg-[var(--hw-sand)]">
      <div className="hw-container">
        <p className="hw-eyebrow">{t.beforeAfter.eyebrow}</p>
        <h2 className="hw-heading mt-4">{t.beforeAfter.title}</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {t.beforeAfter.items.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-2xl bg-[var(--hw-cream)]">
              <div className="grid grid-cols-2">
                <div className="relative aspect-square">
                  {item.beforeImage && <Image src={item.beforeImage} alt="" fill sizes="25vw" className="object-cover" />}
                  <span className="absolute bottom-2 left-2 rounded bg-[var(--hw-forest-deep)]/80 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                    {t.beforeAfter.before}
                  </span>
                </div>
                <div className="relative aspect-square">
                  {item.afterImage && <Image src={item.afterImage} alt="" fill sizes="25vw" className="object-cover" />}
                  <span className="absolute bottom-2 left-2 rounded bg-[var(--hw-clay)] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                    {t.beforeAfter.after}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-[var(--hw-forest)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--hw-stone)]">
                  {[item.city, item.area, item.duration, item.kind].filter(Boolean).join(" · ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
