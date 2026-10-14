"use client";

import Image from "next/image";
import { sectionIds } from "@/components/templates/handwerk-premium/data";
import { useHandwerk } from "@/components/templates/handwerk-premium/i18n";

export function Materials() {
  const { t } = useHandwerk();
  return (
    <section id={sectionIds.materials} className="hw-section scroll-mt-24 bg-[var(--hw-cream)]">
      <div className="hw-container">
        <p className="hw-eyebrow">{t.materials.eyebrow}</p>
        <h2 className="hw-heading mt-4">{t.materials.title}</h2>
        {t.materials.subtitle && <p className="mt-4 max-w-2xl text-[var(--hw-stone)]">{t.materials.subtitle}</p>}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.materials.items.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-2xl border border-[var(--hw-forest)]/10 bg-white">
              <div className="relative aspect-[4/3] bg-[var(--hw-sand)]">
                {item.image && <Image src={item.image} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[var(--hw-forest)]">{item.title}</h3>
                {item.spec && <p className="mt-1 text-xs text-[var(--hw-stone)]">{item.spec}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
