"use client";

import Image from "next/image";
import { sectionIds } from "@/templates/handwerk-base/data";
import { useHandwerk } from "@/templates/handwerk-base/i18n";

export function Quality() {
  const { t } = useHandwerk();
  return (
    <section id={sectionIds.quality} className="hw-section scroll-mt-24 bg-[var(--hw-forest-deep)] text-[var(--hw-cream)]">
      <div className="hw-container grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="hw-eyebrow text-[var(--hw-clay)]">{t.quality.eyebrow}</p>
          <h2 className="hw-heading mt-4 text-[var(--hw-cream)]">{t.quality.title}</h2>
          {t.quality.subtitle && <p className="mt-5 max-w-xl text-[var(--hw-cream)]/75">{t.quality.subtitle}</p>}
        </div>
        {t.quality.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={t.quality.image} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
