"use client";

import { ShieldCheck } from "lucide-react";
import { sectionIds } from "@/components/templates/handwerk-premium/data";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";

export function Guarantees() {
  const { t } = useHandwerk();
  return (
    <section id={sectionIds.guarantees} className="hw-section scroll-mt-24 bg-[var(--hw-forest)] text-[var(--hw-cream)]">
      <div className="hw-container">
        <p className="hw-eyebrow text-[var(--hw-clay)]">{t.guarantees.eyebrow}</p>
        <h2 className="hw-heading mt-4 text-[var(--hw-cream)]">{t.guarantees.title}</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.guarantees.items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <ShieldCheck className="h-6 w-6 text-[var(--hw-clay)]" />
              <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--hw-cream)]/75">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
