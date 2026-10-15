"use client";

import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";

export function Process() {
  const { t } = useHandwerk();
  return (
    <section id={sectionIds.process} className="hw-section scroll-mt-24 bg-[var(--hw-forest)] text-[var(--hw-cream)]">
      <div className="hw-container">
        <p className="hw-eyebrow text-[var(--hw-clay)]">{t.process.eyebrow}</p>
        <h2 className="hw-heading mt-4 text-[var(--hw-cream)]">{t.process.title}</h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {t.process.items.map((item, index) => (
            <li key={item.title} className="relative">
              <span className="font-display text-5xl text-[var(--hw-clay)]">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--hw-cream)]/75">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
